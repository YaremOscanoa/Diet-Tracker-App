import { db, ensureDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await ensureDb();
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db.execute({
      sql: "SELECT 1 FROM users WHERE email = ?",
      args: [email],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await db.execute({
      sql: "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      args: [email, hashedPassword, name],
    });

    const userId = insertResult.lastInsertRowid;

    if (userId) {
      await db.execute({
        sql: "INSERT OR IGNORE INTO user_goals (user_id) VALUES (?)",
        args: [userId],
      });
    }

    return NextResponse.json({ message: "Registered" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}