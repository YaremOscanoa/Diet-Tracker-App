import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    const existing = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute({
      sql: "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      args: [email, hashedPassword, name],
    });

    // Initialize default goals
    const newUser = await db.execute({
        sql: "SELECT id FROM users WHERE email = ?",
        args: [email]
    });
    
    if(newUser.rows[0]){
        await db.execute({
            sql: "INSERT INTO user_goals (user_id) VALUES (?)",
            args: [newUser.rows[0].id]
        });
    }

    return NextResponse.json({ message: "Registered" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}