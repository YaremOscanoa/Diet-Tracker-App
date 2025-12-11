# NutriLog - Diet Tracker App

## Overview
A simple, smart nutrition tracking companion built with Next.js. Users can register, complete an onboarding flow to set their profile and goals, track meals by category, monitor water intake, and view weekly progress reports.

## Features
- **User Registration & Login**: Secure authentication with NextAuth.js
- **Onboarding Flow**: 4-step wizard to set goal type (lose/maintain/gain), profile (age, weight, height, sex), and activity level
- **Automated Target Calculation**: Uses Mifflin-St Jeor formula to calculate TDEE and macro targets based on user profile
- **Food Logging**: Search food database (Edamam API) or Quick Add with manual calorie/macro entry
- **Meal Type Categorization**: Organize meals by Breakfast, Lunch, Dinner, and Snacks
- **Daily Dashboard**: Visual calorie/macro breakdown with doughnut chart and progress bars
- **Goals Editing**: Manually adjust calorie and macro targets
- **Water Tracking**: Track daily water intake with quick-add buttons
- **Weekly Progress Report**: Summary of consistency, goal achievement, and daily averages

## Project Structure
- `src/app/` - Next.js 14 App Router pages and API routes
  - `api/auth/` - NextAuth.js authentication endpoints
  - `api/goals/` - User nutritional goals CRUD endpoints
  - `api/meals/` - Meal logging endpoints
  - `api/onboarding/` - Onboarding status and profile setup
  - `api/register/` - User registration
  - `api/search/` - Food database search
  - `api/water/` - Water intake logging
  - `api/weekly-report/` - Weekly progress summary
  - `dashboard/` - Main dashboard page
  - `login/` - Login page
  - `register/` - Registration page
  - `onboarding/` - Onboarding wizard
- `src/components/` - React components
  - GoalCard, MacroChart, MealForm, MealHistory, WaterTracker, GoalEditor, WeeklyReport, Providers
- `src/lib/` - Shared utilities
  - `db.js` - Database connection using libsql (SQLite)
  - `auth.js` - NextAuth.js configuration

## Technology Stack
- **Framework**: Next.js 14.1.0 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with credentials provider
- **Database**: libsql/SQLite (local file: local.db)
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React

## Running the App
The dev server runs on port 5000:
```bash
npm run dev -- -H 0.0.0.0 -p 5000
```

## Environment Variables
- `NEXTAUTH_SECRET` - Secret for NextAuth.js JWT encryption
- `NEXTAUTH_URL` - Base URL for authentication (http://localhost:5000)
- Optional: `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` for Turso cloud database
- Optional: `EDAMAM_APP_ID` and `EDAMAM_APP_KEY` for food database API (uses mock data if not set)

## Database Schema
The app auto-creates these tables on first run:
- `users` - User accounts (id, email, password, name, age, weight, height, sex, activity_level, goal_type, onboarding_complete, created_at)
- `user_goals` - Nutritional goals (user_id, calorie_goal, protein_goal, carbs_goal, fat_goal)
- `meal_logs` - Meal entries (id, user_id, name, calories, protein, carbs, fat, meal_type, created_at)
- `water_logs` - Water intake entries (id, user_id, amount_ml, created_at)

## TDEE Calculation
Uses the Mifflin-St Jeor formula:
- Male: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
- Female: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
- TDEE = BMR * Activity Multiplier
- Goal adjustments: Lose (-500 cal), Gain (+300 cal), Maintain (no change)
