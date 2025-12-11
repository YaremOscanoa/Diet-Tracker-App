import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    await ensureDb();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let userId = session.user.id;
    if (!userId) {
      const u = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [session.user.email] });
      userId = u.rows[0]?.id;
    }

    const goalsResult = await db.execute({
      sql: "SELECT * FROM user_goals WHERE user_id = ?",
      args: [userId]
    });
    const goals = goalsResult.rows[0] || { calorie_goal: 2000, protein_goal: 150, carbs_goal: 200, fat_goal: 70 };

    const mealsResult = await db.execute({
      sql: `SELECT date(created_at) as day, 
            SUM(calories) as total_calories,
            SUM(protein) as total_protein,
            SUM(carbs) as total_carbs,
            SUM(fat) as total_fat
            FROM meal_logs 
            WHERE user_id = ? AND created_at >= date('now', '-7 days')
            GROUP BY date(created_at)`,
      args: [userId]
    });

    const dailyData = mealsResult.rows;
    const daysLogged = dailyData.length;

    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    let calorieGoalDays = 0, proteinGoalDays = 0;

    dailyData.forEach(day => {
      const dayCalories = day.total_calories || 0;
      const dayProtein = day.total_protein || 0;
      
      totalCalories += dayCalories;
      totalProtein += dayProtein;
      totalCarbs += day.total_carbs || 0;
      totalFat += day.total_fat || 0;

      if (dayCalories <= goals.calorie_goal * 1.1 && dayCalories >= goals.calorie_goal * 0.8) {
        calorieGoalDays++;
      }
      if (dayProtein >= goals.protein_goal * 0.9) {
        proteinGoalDays++;
      }
    });

    const avgCalories = daysLogged > 0 ? Math.round(totalCalories / daysLogged) : 0;
    const avgProtein = daysLogged > 0 ? Math.round(totalProtein / daysLogged) : 0;
    const avgCarbs = daysLogged > 0 ? Math.round(totalCarbs / daysLogged) : 0;
    const avgFat = daysLogged > 0 ? Math.round(totalFat / daysLogged) : 0;

    const highlights = [];
    if (daysLogged > 0) {
      if (proteinGoalDays >= Math.min(5, daysLogged)) {
        highlights.push(`You hit your protein goal ${proteinGoalDays} out of ${daysLogged} days!`);
      }
      if (calorieGoalDays >= Math.min(5, daysLogged)) {
        highlights.push(`Great job staying within your calorie goal ${calorieGoalDays} days!`);
      }
      if (daysLogged >= 7) {
        highlights.push("Perfect consistency - you logged every day this week!");
      } else if (daysLogged >= 5) {
        highlights.push(`Good consistency - you logged ${daysLogged} days this week!`);
      }
    }

    return NextResponse.json({
      daysLogged,
      calorieGoalDays,
      proteinGoalDays,
      avgCalories,
      avgProtein,
      avgCarbs,
      avgFat,
      highlights
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
