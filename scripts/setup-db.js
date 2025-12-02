// Run this with: node scripts/setup-db.js
const { createClient } = require("@libsql/client");
require('dotenv').config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("Setting up database...");

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

  console.log("Database tables created successfully!");
}

main().catch(console.error);