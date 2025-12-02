import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get User ID helper
  let userId = session.user.id;
  if(!userId) {
     const u = await db.execute({sql: "SELECT id FROM users WHERE email = ?", args: [session.user.email]});
     userId = u.rows[0]?.id;
  }

  const result = await db.execute({
    sql: "SELECT * FROM user_goals WHERE user_id = ?",
    args: [userId],
  });

  if (result.rows.length === 0) {
    // Return defaults if not found
    return NextResponse.json({ calorie_goal: 2000, protein_goal: 150, carbs_goal: 200, fat_goal: 70 });
  }

  return NextResponse.json(result.rows[0]);
}