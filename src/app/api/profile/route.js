import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, ensureDb } from "@/lib/db";

function calculateBMI(weight, height) {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" };
  if (bmi < 25) return { category: "Normal", color: "text-green-600" };
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" };
  return { category: "Obese", color: "text-red-600" };
}

export async function GET() {
  await ensureDb();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.execute({
    sql: "SELECT id, name, age, weight, height, sex, activity_level, goal_type FROM users WHERE id = ?",
    args: [session.user.id]
  });

  if (result.rows.length === 0) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const user = result.rows[0];
  const bmi = calculateBMI(user.weight, user.height);
  const bmiInfo = bmi ? getBMICategory(bmi) : null;

  return Response.json({
    name: user.name,
    age: user.age,
    weight: user.weight,
    height: user.height,
    sex: user.sex,
    activity_level: user.activity_level,
    goal_type: user.goal_type,
    bmi: bmi ? Math.round(bmi * 10) / 10 : null,
    bmi_category: bmiInfo?.category || null,
    bmi_color: bmiInfo?.color || null
  });
}
