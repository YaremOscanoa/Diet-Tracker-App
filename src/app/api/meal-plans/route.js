import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, ensureDb } from "@/lib/db";

export async function GET() {
  await ensureDb();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plans = await db.execute({
    sql: `SELECT mp.*, 
          (SELECT json_group_array(json_object(
            'id', mpi.id,
            'meal_type', mpi.meal_type,
            'food_name', mpi.food_name,
            'calories', mpi.calories,
            'protein', mpi.protein,
            'carbs', mpi.carbs,
            'fat', mpi.fat,
            'order_index', mpi.order_index
          )) FROM meal_plan_items mpi WHERE mpi.meal_plan_id = mp.id ORDER BY mpi.order_index) as items
          FROM meal_plans mp 
          WHERE mp.user_id = ? 
          ORDER BY mp.created_at DESC`,
    args: [session.user.id]
  });

  const result = plans.rows.map(plan => ({
    ...plan,
    items: plan.items ? JSON.parse(plan.items) : []
  }));

  return Response.json(result);
}

export async function POST(request) {
  await ensureDb();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, plan_date, plan_type, items } = await request.json();

  const totalCalories = items?.reduce((sum, item) => sum + (item.calories || 0), 0) || 0;

  const result = await db.execute({
    sql: `INSERT INTO meal_plans (user_id, name, plan_date, plan_type, total_calories) VALUES (?, ?, ?, ?, ?)`,
    args: [session.user.id, name, plan_date || new Date().toISOString().split('T')[0], plan_type || 'custom', totalCalories]
  });

  const planId = Number(result.lastInsertRowid);

  if (items && items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await db.execute({
        sql: `INSERT INTO meal_plan_items (meal_plan_id, meal_type, food_name, calories, protein, carbs, fat, order_index) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [planId, item.meal_type, item.food_name, item.calories || 0, item.protein || 0, item.carbs || 0, item.fat || 0, i]
      });
    }
  }

  return Response.json({ id: planId, success: true });
}

export async function DELETE(request) {
  await ensureDb();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  const planCheck = await db.execute({
    sql: "SELECT id FROM meal_plans WHERE id = ? AND user_id = ?",
    args: [id, session.user.id]
  });

  if (planCheck.rows.length === 0) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }

  await db.execute({
    sql: "DELETE FROM meal_plan_items WHERE meal_plan_id = ?",
    args: [id]
  });

  await db.execute({
    sql: "DELETE FROM meal_plans WHERE id = ? AND user_id = ?",
    args: [id, session.user.id]
  });

  return Response.json({ success: true });
}
