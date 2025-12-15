import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, ensureDb } from "@/lib/db";
import { generateMealPlan, generateWeeklyPlan } from "@/lib/mealCatalog";

export async function POST(request) {
  await ensureDb();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { save, weekly, adjustments, adjustment } = await request.json().catch(() => ({}));

  const goalsResult = await db.execute({
    sql: "SELECT calorie_goal FROM user_goals WHERE user_id = ?",
    args: [session.user.id]
  });

  const calorieGoal = goalsResult.rows[0]?.calorie_goal || 2000;

  if (weekly) {
    const weeklyPlan = generateWeeklyPlan(calorieGoal, adjustments || {});
    
    if (save) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      
      for (let i = 0; i < 7; i++) {
        const day = days[i];
        const planDate = new Date(today);
        planDate.setDate(today.getDate() + mondayOffset + i);
        const dateStr = planDate.toISOString().split('T')[0];
        const dayPlan = weeklyPlan[day];
        
        const existing = await db.execute({
          sql: "SELECT id FROM meal_plans WHERE user_id = ? AND plan_date = ? AND plan_type = 'weekly'",
          args: [session.user.id, dateStr]
        });
        
        if (existing.rows.length > 0) {
          const existingId = existing.rows[0].id;
          await db.execute({
            sql: "DELETE FROM meal_plan_items WHERE meal_plan_id = ?",
            args: [existingId]
          });
          await db.execute({
            sql: "DELETE FROM meal_plans WHERE id = ?",
            args: [existingId]
          });
        }
        
        const result = await db.execute({
          sql: `INSERT INTO meal_plans (user_id, name, plan_date, plan_type, total_calories, calorie_adjustment) VALUES (?, ?, ?, ?, ?, ?)`,
          args: [session.user.id, `${day} Plan`, dateStr, 'weekly', dayPlan.totals.calories, dayPlan.adjustment]
        });

        const planId = Number(result.lastInsertRowid);
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        
        for (let j = 0; j < mealTypes.length; j++) {
          const mealType = mealTypes[j];
          const meal = dayPlan.meals[mealType];
          await db.execute({
            sql: `INSERT INTO meal_plan_items (meal_plan_id, meal_type, food_name, calories, protein, carbs, fat, order_index) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [planId, mealType, meal.name, meal.calories, meal.protein, meal.carbs, meal.fat, j]
          });
        }
      }
      
      return Response.json({ weeklyPlan, saved: true });
    }
    
    return Response.json({ weeklyPlan });
  }

  const generatedPlan = generateMealPlan(calorieGoal, adjustment || 'normal');

  if (save) {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await db.execute({
      sql: `INSERT INTO meal_plans (user_id, name, plan_date, plan_type, total_calories, calorie_adjustment) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [session.user.id, `Auto Plan - ${today}`, today, 'auto', generatedPlan.totals.calories, generatedPlan.adjustment]
    });

    const planId = Number(result.lastInsertRowid);
    
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    for (let i = 0; i < mealTypes.length; i++) {
      const mealType = mealTypes[i];
      const meal = generatedPlan.meals[mealType];
      await db.execute({
        sql: `INSERT INTO meal_plan_items (meal_plan_id, meal_type, food_name, calories, protein, carbs, fat, order_index) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [planId, mealType, meal.name, meal.calories, meal.protein, meal.carbs, meal.fat, i]
      });
    }

    return Response.json({ id: planId, ...generatedPlan, saved: true });
  }

  return Response.json(generatedPlan);
}
