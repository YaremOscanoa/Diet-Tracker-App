import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url: url || "file:local.db", // Fallback for local dev if no env vars
  authToken: authToken,
});

/**
 * Ensure the database schema exists. This allows local dev to work
 * without having to remember to run the setup script first.
 * The promise is cached so we only run this once per server process.
 */
async function initSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Cache the promise so schema creation runs only once per runtime
const schemaReady = initSchema();
export async function ensureDb() {
  return schemaReady;
}