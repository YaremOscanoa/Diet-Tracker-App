import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url: url || "file:local.db", // Fallback for local dev if no env vars
  authToken: authToken,
});