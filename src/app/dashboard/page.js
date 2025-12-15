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
import QuickAddFoods from "@/components/QuickAddFoods";
import DailyTip from "@/components/DailyTip";
import BMICard from "@/components/BMICard";
import MealPlanSection from "@/components/MealPlanSection";
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

  const addQuickFood = async (foodData) => {
    await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foodData)
    });
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

  const reduceWater = async (amount) => {
    const res = await fetch("/api/water", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reduce_ml: amount })
    });
    const data = await res.json();
    setWater(data.total || 0);
  };

  const resetWater = async () => {
    const res = await fetch("/api/water", { method: "DELETE" });
    const data = await res.json();
    setWater(data.total || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalIntake = meals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          NutriLog
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowWeeklyReport(true)} 
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Weekly Report"
          >
            <BarChart2 size={20} />
          </button>
          <button 
            onClick={() => setShowGoalEditor(true)} 
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Goals"
          >
            <Settings size={20} />
          </button>
          <span className="text-sm text-gray-500 hidden md:block">{session?.user?.name}</span>
          <button 
            onClick={() => signOut()} 
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <DailyTip />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalCard goals={goals} total={totalIntake} />
          <BMICard />
        </div>
        
        <MealPlanSection calorieGoal={goals?.calorie_goal || 2000} />
        
        <WaterTracker 
          water={water} 
          onAddWater={addWater} 
          onReduceWater={reduceWater}
          onResetWater={resetWater}
        />

        <QuickAddFoods onAddFood={addQuickFood} />

        <MealForm onMealAdded={fetchData} />
        
        <MealHistory meals={meals} onDelete={deleteMeal} />
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
