"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GoalCard from "@/components/GoalCard";
import MealForm from "@/components/MealForm";
import MealHistory from "@/components/MealHistory";
import WaterTracker from "@/components/WaterTracker";
import GoalEditor from "@/components/GoalEditor";
import WeeklyReport from "@/components/WeeklyReport";
import { LogOut, Settings, BarChart2 } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [goals, setGoals] = useState(null);
  const [meals, setMeals] = useState([]);
  const [water, setWater] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") checkOnboarding();
  }, [status]);

  const checkOnboarding = async () => {
    try {
      const res = await fetch("/api/onboarding");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (!data.onboarding_complete) {
        router.push("/onboarding");
      } else {
        fetchData();
      }
    } catch (error) {
      console.error("Error checking onboarding:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const [goalsRes, mealsRes, waterRes] = await Promise.all([
      fetch("/api/goals"),
      fetch("/api/meals"),
      fetch("/api/water")
    ]);
    const goalsData = await goalsRes.json();
    const mealsData = await mealsRes.json();
    const waterData = await waterRes.json();
    setGoals(goalsData);
    setMeals(mealsData);
    setWater(waterData.total || 0);
    setLoading(false);
  };

  const deleteMeal = async (id) => {
    await fetch(`/api/meals/${id}`, { method: "DELETE" });
    fetchData();
  };

  const updateGoals = async (newGoals) => {
    await fetch("/api/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGoals)
    });
    setGoals(newGoals);
    setShowGoalEditor(false);
  };

  const addWater = async (amount) => {
    const res = await fetch("/api/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount_ml: amount })
    });
    const data = await res.json();
    setWater(data.total || 0);
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const totalIntake = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const mealsByType = {
    breakfast: meals.filter(m => m.meal_type === 'breakfast'),
    lunch: meals.filter(m => m.meal_type === 'lunch'),
    dinner: meals.filter(m => m.meal_type === 'dinner'),
    snack: meals.filter(m => m.meal_type === 'snack'),
    other: meals.filter(m => !m.meal_type || m.meal_type === 'other')
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold text-xl">NutriLog</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowWeeklyReport(true)} 
            className="text-gray-500 hover:text-blue-600"
            title="Weekly Report"
          >
            <BarChart2 size={20} />
          </button>
          <button 
            onClick={() => setShowGoalEditor(true)} 
            className="text-gray-500 hover:text-blue-600"
            title="Edit Goals"
          >
            <Settings size={20} />
          </button>
          <span className="text-sm text-gray-500 hidden md:block">{session?.user?.name}</span>
          <button onClick={() => signOut()} className="text-gray-500 hover:text-red-600">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <GoalCard goals={goals} total={totalIntake} />
        
        <div className="grid md:grid-cols-2 gap-4">
          <WaterTracker water={water} onAddWater={addWater} />
        </div>

        <MealForm onMealAdded={fetchData} />
        <MealHistory meals={meals} mealsByType={mealsByType} onDelete={deleteMeal} />
      </main>

      {showGoalEditor && (
        <GoalEditor 
          goals={goals} 
          onSave={updateGoals} 
          onClose={() => setShowGoalEditor(false)} 
        />
      )}

      {showWeeklyReport && (
        <WeeklyReport onClose={() => setShowWeeklyReport(false)} />
      )}
    </div>
  );
}
