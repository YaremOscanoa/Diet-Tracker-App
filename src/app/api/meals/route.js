import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get start of today in string format YYYY-MM-DD to simplify query
  // For SQLite specifically, we can check date(created_at)
  const result = await db.execute({
    sql: "SELECT * FROM meal_logs WHERE user_id = ? AND date(created_at) = date('now') ORDER BY created_at DESC",
    args: [session.user.id], // Note: NextAuth usually puts ID in token, check auth config
  });

  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, calories, protein, carbs, fat } = await req.json();

  // Need user ID. In the auth route, we ensured token.sub is mapped to session.user.id
  // However, getServerSession needs the authOptions passed to it to fully retrieve ID in some versions.
  // For simplicity, we will assume we can get the email and lookup ID if needed, or ID is present.
  
  // Quick lookup to be safe if session.user.id is missing
  let userId = session.user.id;
  if(!userId) {
     const u = await db.execute({sql: "SELECT id FROM users WHERE email = ?", args: [session.user.email]});
     userId = u.rows[0]?.id;
  }

  const result = await db.execute({
    sql: "INSERT INTO meal_logs (user_id, name, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?)",
    args: [userId, name, calories, protein || 0, carbs || 0, fat || 0],
  });

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}