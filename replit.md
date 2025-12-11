# NutriLog - Diet Tracker App

## Overview
A simple, smart nutrition tracking companion built with Next.js. Users can register, log in, track meals, set nutritional goals, and view their macro breakdown.

## Project Structure
- `src/app/` - Next.js 14 App Router pages and API routes
  - `api/auth/` - NextAuth.js authentication endpoints
  - `api/goals/` - User nutritional goals endpoints
  - `api/meals/` - Meal logging endpoints
  - `api/register/` - User registration
  - `api/search/` - Food search functionality
  - `dashboard/` - Main dashboard page
  - `login/` - Login page
  - `register/` - Registration page
- `src/components/` - React components (GoalCard, MacroChart, MealForm, MealHistory)
- `src/lib/db.js` - Database connection using libsql (SQLite)

## Technology Stack
- **Framework**: Next.js 14.1.0 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with credentials provider
- **Database**: libsql/SQLite (local file: local.db)
- **Charts**: Chart.js with react-chartjs-2

## Running the App
The dev server runs on port 5000:
```bash
npm run dev -- -H 0.0.0.0 -p 5000
```

## Environment Variables
- `NEXTAUTH_SECRET` - Secret for NextAuth.js JWT encryption
- `NEXTAUTH_URL` - Base URL for authentication (http://localhost:5000)
- Optional: `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` for Turso cloud database

## Database Schema
The app auto-creates these tables on first run:
- `users` - User accounts (id, email, password, name, created_at)
- `user_goals` - Nutritional goals (user_id, calorie_goal, protein_goal, carbs_goal, fat_goal)
- `meal_logs` - Meal entries (id, user_id, name, calories, protein, carbs, fat, created_at)
