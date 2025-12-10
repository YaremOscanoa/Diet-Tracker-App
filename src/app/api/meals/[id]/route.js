import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";

export async function DELETE(req, { params }) {
  await ensureDb();
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.execute({
    sql: "DELETE FROM meal_logs WHERE id = ?",
    args: [params.id],
  });

  return NextResponse.json({ success: true });
}