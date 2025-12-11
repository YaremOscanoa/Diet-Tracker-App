import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  await ensureDb();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userId = session.user.id;
  if (!userId) {
    const u = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [session.user.email] });
    userId = u.rows[0]?.id;
  }

  const result = await db.execute({
    sql: "SELECT * FROM user_goals WHERE user_id = ?",
    args: [userId],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ calorie_goal: 2000, protein_goal: 150, carbs_goal: 200, fat_goal: 70 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function PUT(req) {
  await ensureDb();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { calorie_goal, protein_goal, carbs_goal, fat_goal } = await req.json();

  let userId = session.user.id;
  if (!userId) {
    const u = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [session.user.email] });
    userId = u.rows[0]?.id;
  }

  await db.execute({
    sql: `INSERT INTO user_goals (user_id, calorie_goal, protein_goal, carbs_goal, fat_goal) 
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET 
          calorie_goal = excluded.calorie_goal,
          protein_goal = excluded.protein_goal,
          carbs_goal = excluded.carbs_goal,
          fat_goal = excluded.fat_goal`,
    args: [userId, calorie_goal, protein_goal, carbs_goal, fat_goal]
  });

  return NextResponse.json({ success: true });
}
