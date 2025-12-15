import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, ensureDb } from "@/lib/db";
import { generateMealPlan } from "@/lib/mealCatalog";

export async function POST(request) {
  await ensureDb();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { save } = await request.json().catch(() => ({}));

  const goalsResult = await db.execute({
    sql: "SELECT calorie_goal FROM user_goals WHERE user_id = ?",
    args: [session.user.id]
  });

  const calorieGoal = goalsResult.rows[0]?.calorie_goal || 2000;
  const generatedPlan = generateMealPlan(calorieGoal);

  if (save) {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await db.execute({
      sql: `INSERT INTO meal_plans (user_id, name, plan_date, plan_type, total_calories) VALUES (?, ?, ?, ?, ?)`,
      args: [session.user.id, `Auto Plan - ${today}`, today, 'auto', generatedPlan.totals.calories]
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
