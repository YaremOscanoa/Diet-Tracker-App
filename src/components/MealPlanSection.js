"use client";
import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import MealPlanEditor from "./MealPlanEditor";

export default function MealPlanSection({ calorieGoal }) {
  const [plans, setPlans] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/meal-plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/meal-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedPlan(data);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setGenerating(false);
    }
  };

  const savePlan = async (planData) => {
    try {
      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData)
      });
      if (res.ok) {
        fetchPlans();
        setShowEditor(false);
        setGeneratedPlan(null);
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const deletePlan = async (id) => {
    try {
      await fetch("/api/meal-plans", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const saveGeneratedPlan = async () => {
    if (!generatedPlan) return;
    
    const items = Object.entries(generatedPlan.meals).map(([mealType, meal]) => ({
      meal_type: mealType,
      food_name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat
    }));

    await savePlan({
      name: `Auto Plan - ${new Date().toLocaleDateString()}`,
      plan_type: 'auto',
      items
    });
  };

  const mealTypeLabels = {
    breakfast: "Breakfast",
    lunch: "Lunch", 
    dinner: "Dinner",
    snack: "Snack"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-purple-600" />
          <h3 className="font-semibold text-gray-800">Meal Plans</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generatePlan}
            disabled={generating}
            className="flex items-center gap-1 text-sm px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
          >
            <Sparkles size={14} />
            {generating ? "Generating..." : "Suggest"}
          </button>
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus size={14} />
            Custom
          </button>
        </div>
      </div>

      {generatedPlan && (
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-purple-800">Suggested Plan</span>
            <div className="flex gap-2">
              <button
                onClick={saveGeneratedPlan}
                className="text-sm px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save
              </button>
              <button
                onClick={() => setGeneratedPlan(null)}
                className="text-sm px-3 py-1 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
              >
                Dismiss
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {Object.entries(generatedPlan.meals).map(([type, meal]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="text-gray-600">{mealTypeLabels[type]}: {meal.name}</span>
                <span className="text-gray-500">{meal.calories} cal</span>
              </div>
            ))}
            <div className="border-t border-purple-200 pt-2 mt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{generatedPlan.totals.calories} cal</span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-12 bg-gray-100 rounded"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
        </div>
      ) : plans.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No meal plans yet. Generate a suggestion or create a custom plan!
        </p>
      ) : (
        <div className="space-y-2">
          {plans.slice(0, 5).map((plan) => (
            <div key={plan.id} className="border border-gray-100 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
              >
                <div className="flex items-center gap-2">
                  {expandedPlan === plan.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span className="font-medium text-sm">{plan.name}</span>
                  {plan.plan_type === 'auto' && (
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded">Auto</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{plan.total_calories} cal</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deletePlan(plan.id); }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              {expandedPlan === plan.id && plan.items && (
                <div className="px-3 pb-3 space-y-1 border-t border-gray-100 pt-2">
                  {plan.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-600">
                      <span>{mealTypeLabels[item.meal_type]}: {item.food_name}</span>
                      <span>{item.calories} cal</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <MealPlanEditor
          calorieGoal={calorieGoal}
          onSave={savePlan}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
