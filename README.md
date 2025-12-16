# NutriLog - Diet Tracker App

A smart nutrition tracking companion that helps you manage your diet through personalized calorie and macro goals, meal logging, BMI tracking, and intelligent meal planning.

## Features

- **User Authentication** - Secure registration and login with encrypted passwords
- **Personalized Onboarding** - 4-step wizard to set your goals, profile, and activity level
- **Smart Calorie Targets** - Automatic calculation using the Mifflin-St Jeor formula
- **Meal Logging** - Track meals by category (Breakfast, Lunch, Dinner, Snacks)
- **Macro Tracking** - Monitor protein, carbs, and fat intake with visual charts
- **Water Intake** - Track daily hydration with quick-add buttons
- **BMI Calculator** - View your BMI with health category indicators
- **Weekly Meal Planning** - Plan 7 days of meals with calorie adjustments for rest/workout days
- **Progress Reports** - Weekly summaries of your consistency and achievements

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: SQLite (libsql)
- **Charts**: Chart.js

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nutrilog.git
cd nutrilog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Add your environment variables:
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev -- -H 0.0.0.0 -p 5000
```

5. Open [http://localhost:5000](http://localhost:5000) in your browser

## Project Structure

```
src/
├── app/                 # Next.js pages and API routes
│   ├── api/            # Backend endpoints
│   ├── dashboard/      # Main dashboard
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   └── onboarding/     # Onboarding wizard
├── components/         # React components
│   ├── GoalCard.js     # Calorie progress display
│   ├── BMICard.js      # BMI calculator
│   ├── MacroChart.js   # Macro visualization
│   ├── MealForm.js     # Add meal form
│   ├── WaterTracker.js # Water intake
│   └── WeeklyMealPlanner.js # 7-day planner
└── lib/                # Utilities
    ├── auth.js         # Auth configuration
    ├── db.js           # Database connection
    └── mealCatalog.js  # Food database
```

## How It Works

### Calorie Calculation

NutriLog uses the Mifflin-St Jeor equation to calculate your Basal Metabolic Rate (BMR):

- **Male**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- **Female**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

Your Total Daily Energy Expenditure (TDEE) is then calculated by multiplying BMR by your activity level, with adjustments based on your goal:

- **Lose Weight**: TDEE - 500 calories
- **Maintain Weight**: TDEE
- **Gain Weight**: TDEE + 300 calories

### Weekly Meal Planning

The weekly planner allows you to set different calorie targets for each day:

- **Eat Less** (Blue): 80% of your daily goal - ideal for rest days
- **Normal** (Green): 100% of your daily goal
- **Eat More** (Orange): 120% of your daily goal - great for workout days

## Database Schema

The app automatically creates these tables:

- `users` - User accounts and profile information
- `user_goals` - Personalized calorie and macro targets
- `meal_logs` - Daily meal entries
- `water_logs` - Water intake records
- `meal_plans` - Saved meal plans
- `meal_plan_items` - Individual items within plans

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | Secret key for JWT encryption | Yes |
| `NEXTAUTH_URL` | Base URL for authentication | Yes |
| `EDAMAM_APP_ID` | Edamam API ID for food search | No |
| `EDAMAM_APP_KEY` | Edamam API key | No |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Lucide](https://lucide.dev/) - Icons
