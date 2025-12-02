"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GoalCard from "@/components/GoalCard";
import MealForm from "@/components/MealForm";
import MealHistory from "@/components/MealHistory";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [goals, setGoals] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchData();
  }, [status]);

  const fetchData = async () => {
    const [goalsRes, mealsRes] = await Promise.all([
      fetch("/api/goals"),
      fetch("/api/meals")
    ]);
    const goalsData = await goalsRes.json();
    const mealsData = await mealsRes.json();
    setGoals(goalsData);
    setMeals(mealsData);
    setLoading(false);
  };

  const deleteMeal = async (id) => {
    await fetch(`/api/meals/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const totalIntake = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold text-xl">NutriLog</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:block">{session?.user?.name}</span>
          <button onClick={() => signOut()} className="text-gray-500 hover:text-red-600">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <GoalCard goals={goals} total={totalIntake} />
        <MealForm onMealAdded={fetchData} />
        <MealHistory meals={meals} onDelete={deleteMeal} />
      </main>
    </div>
  );
}