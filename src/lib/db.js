import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url: url || "file:local.db",
  authToken: authToken,
});

async function initSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      age INTEGER,
      weight REAL,
      height REAL,
      sex TEXT,
      activity_level TEXT,
      goal_type TEXT,
      onboarding_complete INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_goals (
      user_id INTEGER PRIMARY KEY,
      calorie_goal INTEGER DEFAULT 2000,
      protein_goal INTEGER DEFAULT 150,
      carbs_goal INTEGER DEFAULT 200,
      fat_goal INTEGER DEFAULT 70
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS meal_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein INTEGER DEFAULT 0,
      carbs INTEGER DEFAULT 0,
      fat INTEGER DEFAULT 0,
      meal_type TEXT DEFAULT 'other',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS water_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount_ml INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS meal_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_date TEXT NOT NULL,
      name TEXT NOT NULL,
      plan_type TEXT DEFAULT 'custom',
      total_calories INTEGER DEFAULT 0,
      calorie_adjustment TEXT DEFAULT 'normal',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    await db.execute(`ALTER TABLE meal_plans ADD COLUMN calorie_adjustment TEXT DEFAULT 'normal'`);
  } catch (e) {
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS meal_plan_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meal_plan_id INTEGER NOT NULL,
      meal_type TEXT NOT NULL,
      food_name TEXT NOT NULL,
      calories INTEGER DEFAULT 0,
      protein INTEGER DEFAULT 0,
      carbs INTEGER DEFAULT 0,
      fat INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE
    );
  `);
}

const schemaReady = initSchema();
export async function ensureDb() {
  return schemaReady;
}
