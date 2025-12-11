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
    sql: "SELECT SUM(amount_ml) as total FROM water_logs WHERE user_id = ? AND date(created_at) = date('now')",
    args: [userId]
  });

  return NextResponse.json({ total: result.rows[0]?.total || 0 });
}

export async function POST(req) {
  await ensureDb();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount_ml } = await req.json();

  let userId = session.user.id;
  if (!userId) {
    const u = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [session.user.email] });
    userId = u.rows[0]?.id;
  }

  await db.execute({
    sql: "INSERT INTO water_logs (user_id, amount_ml) VALUES (?, ?)",
    args: [userId, parseInt(amount_ml) || 0]
  });

  const result = await db.execute({
    sql: "SELECT SUM(amount_ml) as total FROM water_logs WHERE user_id = ? AND date(created_at) = date('now')",
    args: [userId]
  });

  return NextResponse.json({ total: result.rows[0]?.total || 0 }, { status: 201 });
}
