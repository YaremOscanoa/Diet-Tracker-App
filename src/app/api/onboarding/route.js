import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";
import { authOptions } from "@/lib/auth";

function calculateTDEE(weight, height, age, sex, activityLevel) {
  const w = parseFloat(weight) || 70;
  const h = parseFloat(height) || 170;
  const a = parseInt(age) || 30;
  
  let bmr;
  if (sex === "male") {
    bmr = 10 * w + 6.25 * h - 5 * a + 5;
  } else {
    bmr = 10 * w + 6.25 * h - 5 * a - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9
  };

  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
  return Math.max(1200, Math.min(5000, tdee));
}

function calculateMacros(calories, goalType) {
  let proteinPct, carbsPct, fatPct;

  if (goalType === "lose") {
    proteinPct = 0.35;
    carbsPct = 0.35;
    fatPct = 0.30;
  } else if (goalType === "gain") {
    proteinPct = 0.30;
    carbsPct = 0.45;
    fatPct = 0.25;
  } else {
    proteinPct = 0.30;
    carbsPct = 0.40;
    fatPct = 0.30;
  }

  return {
    protein: Math.round((calories * proteinPct) / 4),
    carbs: Math.round((calories * carbsPct) / 4),
    fat: Math.round((calories * fatPct) / 9)
  };
}

export async function POST(req) {
  try {
    await ensureDb();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { goal_type, age, weight, height, sex, activity_level } = await req.json();

    const numAge = parseInt(age) || 30;
    const numWeight = parseFloat(weight) || 70;
    const numHeight = parseFloat(height) || 170;

    if (numAge < 13 || numAge > 120 || numWeight < 30 || numWeight > 300 || numHeight < 100 || numHeight > 250) {
      return NextResponse.json({ error: "Invalid profile values" }, { status: 400 });
    }

    let userId = session.user.id;
    if (!userId) {
      const u = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [session.user.email] });
      userId = u.rows[0]?.id;
    }

    await db.execute({
      sql: `UPDATE users SET age = ?, weight = ?, height = ?, sex = ?, activity_level = ?, goal_type = ?, onboarding_complete = 1 WHERE id = ?`,
      args: [numAge, numWeight, numHeight, sex, activity_level, goal_type, userId]
    });

    let tdee = calculateTDEE(numWeight, numHeight, numAge, sex, activity_level);

    if (goal_type === "lose") {
      tdee = Math.max(1200, tdee - 500);
    } else if (goal_type === "gain") {
      tdee = Math.min(5000, tdee + 300);
    }

    const macros = calculateMacros(tdee, goal_type);

    await db.execute({
      sql: `INSERT INTO user_goals (user_id, calorie_goal, protein_goal, carbs_goal, fat_goal) 
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET 
            calorie_goal = excluded.calorie_goal,
            protein_goal = excluded.protein_goal,
            carbs_goal = excluded.carbs_goal,
            fat_goal = excluded.fat_goal`,
      args: [userId, tdee, macros.protein, macros.carbs, macros.fat]
    });

    return NextResponse.json({ success: true, calories: tdee, ...macros });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

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

    const result = await db.execute({
      sql: "SELECT onboarding_complete FROM users WHERE id = ?",
      args: [userId]
    });

    return NextResponse.json({ 
      onboarding_complete: result.rows[0]?.onboarding_complete === 1 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
