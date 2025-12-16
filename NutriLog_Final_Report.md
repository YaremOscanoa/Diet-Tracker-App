# NutriLog - Diet Tracker Application
## Final Project Report

---

## Abstract

NutriLog is a comprehensive nutrition tracking web application designed to help users manage their daily food intake, monitor macronutrients, and achieve their health goals. Built using modern web technologies including Next.js 14, React, and Tailwind CSS, the application provides personalized calorie and macro targets based on scientifically-backed formulas. Key features include user authentication, an intuitive onboarding wizard, meal logging with categorization, water intake tracking, BMI calculation, weekly progress reports, and intelligent meal planning with customizable calorie adjustments. The application demonstrates full-stack development capabilities with secure authentication, database management, and responsive user interface design.

---

## 1. Introduction

### 1.1 Problem Statement

In today's fast-paced world, maintaining a healthy diet has become increasingly challenging. Many individuals struggle to track their nutritional intake effectively, leading to poor dietary habits and difficulty achieving health goals such as weight loss, muscle gain, or weight maintenance. Existing nutrition tracking solutions often suffer from the following issues:

- **Complexity**: Many apps overwhelm users with excessive features and complicated interfaces
- **Lack of Personalization**: Generic calorie recommendations that don't account for individual factors like age, weight, height, sex, and activity level
- **Poor Planning Tools**: Limited or no support for meal planning ahead of time
- **No Flexibility**: Inability to adjust goals for different days (rest days vs. workout days)

### 1.2 Objectives

The primary objectives of NutriLog are to:

1. **Create an intuitive nutrition tracking experience** that is accessible to users of all technical backgrounds
2. **Provide personalized nutritional targets** using established scientific formulas (Mifflin-St Jeor equation)
3. **Enable comprehensive meal logging** with categorization by meal type (Breakfast, Lunch, Dinner, Snacks)
4. **Track water intake** to promote proper hydration
5. **Calculate and display BMI** with health category indicators
6. **Offer intelligent meal planning** with daily calorie adjustments for flexible dieting
7. **Generate weekly progress reports** to help users monitor their consistency and achievements

---

## 2. Implementation Details

### 2.1 Technologies Used

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 14.1.0 | React-based full-stack framework with App Router |
| **Frontend** | React 18 | Component-based UI library |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Authentication** | NextAuth.js | Secure session-based authentication |
| **Database** | libsql/SQLite | Lightweight SQL database |
| **Charts** | Chart.js + react-chartjs-2 | Data visualization |
| **Icons** | Lucide React | Modern icon library |
| **Password Security** | bcryptjs | Password hashing |

### 2.2 Project Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── goals/         # Nutritional goals CRUD
│   │   ├── meals/         # Meal logging
│   │   ├── meal-plans/    # Meal planning endpoints
│   │   ├── onboarding/    # User profile setup
│   │   ├── register/      # User registration
│   │   ├── search/        # Food search
│   │   ├── water/         # Water tracking
│   │   └── weekly-report/ # Progress summaries
│   ├── dashboard/         # Main dashboard page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── onboarding/        # Onboarding wizard
├── components/            # Reusable React components
│   ├── BMICard.js         # BMI display with categories
│   ├── GoalCard.js        # Calorie/macro progress
│   ├── GoalEditor.js      # Goals modification
│   ├── MacroChart.js      # Doughnut chart visualization
│   ├── MealForm.js        # Add meal form
│   ├── MealHistory.js     # Daily meal list
│   ├── MealPlanSection.js # Meal planning interface
│   ├── MealPlanEditor.js  # Custom plan editor
│   ├── QuickAddFoods.js   # Quick food selection
│   ├── WaterTracker.js    # Water intake tracking
│   ├── WeeklyMealPlanner.js # 7-day meal planner
│   ├── WeeklyReport.js    # Progress summary
│   └── DailyTip.js        # Health tips
└── lib/                   # Shared utilities
    ├── auth.js            # NextAuth configuration
    ├── db.js              # Database connection
    └── mealCatalog.js     # Food database & planning
```

### 2.3 Core Features

#### 2.3.1 User Authentication & Registration
- Secure user registration with password hashing using bcryptjs
- Session-based authentication via NextAuth.js
- Protected routes requiring authentication
- Clean login/registration interface with form validation

#### 2.3.2 Personalized Onboarding Flow
A 4-step wizard that collects user information to calculate personalized targets:

1. **Goal Selection**: Choose between Lose Weight, Maintain Weight, or Gain Weight
2. **Profile Information**: Enter age, current weight (kg), and height (cm)
3. **Biological Sex**: Select Male or Female for accurate BMR calculation
4. **Activity Level**: Choose from Sedentary, Light, Moderate, Active, or Very Active

#### 2.3.3 TDEE & Macro Calculation
Uses the Mifflin-St Jeor equation for Basal Metabolic Rate (BMR):

- **Male**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- **Female**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

Total Daily Energy Expenditure (TDEE) = BMR × Activity Multiplier

Activity Multipliers:
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9

Goal Adjustments:
- Lose Weight: TDEE - 500 calories
- Maintain Weight: TDEE (no change)
- Gain Weight: TDEE + 300 calories

#### 2.3.4 Meal Logging
- Search food database or use Quick Add for manual entry
- Categorize meals by type: Breakfast, Lunch, Dinner, Snacks
- Track calories, protein, carbohydrates, and fat
- View daily meal history with delete functionality
- Visual progress tracking with doughnut charts

#### 2.3.5 Water Intake Tracking
- Add water in 250ml increments
- Reduce or reset daily intake
- Visual glass icon showing current consumption
- Daily goal of 2000ml (8 glasses)

#### 2.3.6 BMI Calculator
- Automatically calculates BMI from user profile
- Displays BMI value with category indicator:
  - Underweight (< 18.5)
  - Normal (18.5 - 24.9)
  - Overweight (25 - 29.9)
  - Obese (≥ 30)
- Color-coded visual feedback

### 2.4 Additional Features

#### 2.4.1 Weekly Meal Planning with Calorie Adjustments
An innovative feature allowing users to plan meals for an entire week with flexible calorie targets:

- **7-Day View**: Plan Monday through Sunday at a glance
- **Calorie Adjustment Options**:
  - **Eat Less** (Blue): 20% calorie reduction for rest days
  - **Normal** (Green): Standard calorie target
  - **Eat More** (Orange): 20% calorie increase for workout days
- **Auto-Generation**: System generates balanced meals based on the meal catalog
- **Meal Distribution**: 30% Breakfast, 35% Lunch, 25% Dinner, 10% Snacks
- **Save & Replace**: Existing weekly plans are automatically updated

#### 2.4.2 Weekly Progress Report
- Summary of daily logging consistency
- Average daily calorie intake
- Goal achievement percentage
- Visual trend indicators

#### 2.4.3 Goals Editor
- Manually adjust calorie and macro targets
- Override calculated values if needed
- Save custom nutritional goals

#### 2.4.4 Daily Health Tips
- Rotating collection of nutrition and wellness tips
- Educational content to support healthy habits

### 2.5 Database Schema

```sql
-- User accounts
CREATE TABLE users (
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

-- Nutritional goals
CREATE TABLE user_goals (
  user_id INTEGER PRIMARY KEY,
  calorie_goal INTEGER,
  protein_goal INTEGER,
  carbs_goal INTEGER,
  fat_goal INTEGER
);

-- Meal entries
CREATE TABLE meal_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  calories INTEGER,
  protein REAL,
  carbs REAL,
  fat REAL,
  meal_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Water intake
CREATE TABLE water_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount_ml INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Meal plans
CREATE TABLE meal_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_date TEXT NOT NULL,
  name TEXT,
  plan_type TEXT DEFAULT 'custom',
  total_calories INTEGER,
  calorie_adjustment TEXT DEFAULT 'normal',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Meal plan items
CREATE TABLE meal_plan_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meal_plan_id INTEGER NOT NULL,
  meal_type TEXT NOT NULL,
  food_name TEXT NOT NULL,
  calories INTEGER,
  protein REAL,
  carbs REAL,
  fat REAL,
  order_index INTEGER DEFAULT 0
);
```

### 2.6 Challenges Faced and Solutions

| Challenge | Solution |
|-----------|----------|
| **Cross-user data access vulnerability** | Implemented user ownership verification in all API endpoints before any CRUD operations |
| **Duplicate weekly meal plan entries** | Created upsert logic to detect existing plans for the same date range and replace them |
| **UI layout overlap (GoalCard/BMICard)** | Restructured dashboard layout to stack cards vertically instead of side-by-side |
| **Database schema migration** | Used `ALTER TABLE IF NOT EXISTS` pattern for backward-compatible column additions |
| **State management after saves** | Added proper callback functions and state refreshes to ensure UI updates after API calls |
| **Calorie distribution in meal plans** | Implemented percentage-based distribution (30/35/25/10) matching typical eating patterns |

---

## 3. Screenshots

### 3.1 Login Page
The login interface provides a clean, centered form for returning users to access their accounts.

![Login Page](screenshots/login.png)

*Features: Email and password fields, login button, link to registration*

### 3.2 Registration Page
New users can create an account with their name, email, and password.

![Registration Page](screenshots/register.png)

*Features: Name, email, password fields with validation, link to login*

### 3.3 Onboarding Wizard - Goal Selection
The first step of onboarding asks users to select their primary health goal.

![Onboarding - Goals](screenshots/onboarding.png)

*Features: Three goal options (Lose/Maintain/Gain Weight), progress indicator, next button*

### 3.4 Main Dashboard
The dashboard displays all tracking information including calories, macros, meals, water, and BMI.

![Dashboard](screenshots/dashboard.png)

*Features: Calorie progress card, BMI card, macro chart, meal history, water tracker, meal plans*

### 3.5 Meal Planning Interface
Users can generate daily or weekly meal plans with calorie adjustments.

*Features: Daily/Weekly toggle, calorie adjustment buttons, auto-generated meals, save functionality*

---

## 4. Conclusion

### 4.1 Learning Outcomes

Through the development of NutriLog, the following key learnings were achieved:

1. **Full-Stack Development**: Gained experience building a complete application with Next.js App Router, combining frontend React components with backend API routes
2. **Authentication Implementation**: Learned to implement secure authentication using NextAuth.js with credentials provider and session management
3. **Database Design**: Designed and implemented a relational database schema suitable for nutrition tracking with proper relationships
4. **Scientific Formula Integration**: Applied the Mifflin-St Jeor equation to calculate personalized nutritional targets
5. **User Experience Design**: Created an intuitive onboarding flow and dashboard that presents complex data in an accessible format
6. **Security Best Practices**: Implemented user ownership verification to prevent unauthorized data access
7. **State Management**: Managed complex UI state with proper refresh patterns after CRUD operations

### 4.2 Potential Future Enhancements

1. **Food Database Integration**: Connect to external APIs (Edamam, USDA) for comprehensive food search with nutritional data
2. **Barcode Scanning**: Add mobile barcode scanning for quick food logging
3. **Social Features**: Allow users to share meal plans and recipes with friends
4. **Progress Photos**: Enable users to track visual progress alongside nutritional data
5. **Exercise Tracking**: Integrate workout logging to adjust calorie targets based on activity
6. **AI-Powered Recommendations**: Use machine learning to suggest meals based on user preferences and history
7. **Mobile App**: Develop native iOS/Android applications for on-the-go tracking
8. **Nutritionist Integration**: Allow professional nutritionists to view client progress and provide guidance
9. **Advanced Analytics**: Add detailed charts showing trends over weeks, months, and years
10. **Recipe Builder**: Create custom recipes with automatic nutritional calculation

---

## 5. References

### 5.1 Libraries and Frameworks

1. **Next.js** - React Framework for Production. https://nextjs.org/
2. **React** - A JavaScript library for building user interfaces. https://reactjs.org/
3. **Tailwind CSS** - A utility-first CSS framework. https://tailwindcss.com/
4. **NextAuth.js** - Authentication for Next.js. https://next-auth.js.org/
5. **Chart.js** - Simple yet flexible JavaScript charting. https://www.chartjs.org/
6. **react-chartjs-2** - React wrapper for Chart.js. https://react-chartjs-2.js.org/
7. **Lucide React** - Beautiful & consistent icons. https://lucide.dev/
8. **bcryptjs** - Optimized bcrypt in JavaScript. https://github.com/dcodeIO/bcrypt.js
9. **libsql** - SQLite for the edge. https://libsql.org/

### 5.2 Scientific References

1. **Mifflin-St Jeor Equation**: Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. "A new predictive equation for resting energy expenditure in healthy individuals." Am J Clin Nutr. 1990;51(2):241-247.

2. **Activity Multipliers**: Food and Agriculture Organization of the United Nations. "Human energy requirements: Report of a Joint FAO/WHO/UNU Expert Consultation." 2001.

3. **BMI Categories**: World Health Organization. "Body mass index - BMI." https://www.who.int/europe/news-room/fact-sheets/item/body-mass-index---bmi

### 5.3 Design Resources

1. **Tailwind UI** - Component design patterns. https://tailwindui.com/
2. **Heroicons** - Icon design inspiration. https://heroicons.com/

---

## Appendix A: API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | Authentication handling |
| `/api/register` | POST | User registration |
| `/api/onboarding` | GET/POST | Onboarding status and profile |
| `/api/goals` | GET/PUT | User nutritional goals |
| `/api/meals` | GET/POST/DELETE | Meal logging |
| `/api/water` | GET/POST | Water intake |
| `/api/meal-plans` | GET/POST/DELETE | Meal plan management |
| `/api/meal-plans/generate` | POST | Generate meal suggestions |
| `/api/weekly-report` | GET | Weekly progress summary |
| `/api/search` | GET | Food database search |

---

*Report prepared for NutriLog Diet Tracker Application*
*December 2024*
