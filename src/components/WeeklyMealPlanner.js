"use client";
import { useState } from "react";
import { X, Sparkles, ChevronDown, ChevronUp, Minus, Circle, Plus } from "lucide-react";
import { calorieAdjustments } from "@/lib/mealCatalog";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const adjustmentOptions = ['less', 'normal', 'more'];

export default function WeeklyMealPlanner({ calorieGoal, onClose, onSaved }) {
  const [adjustments, setAdjustments] = useState(
    days.reduce((acc, day) => ({ ...acc, [day]: 'normal' }), {})
  );
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);

  const cycleAdjustment = (day) => {
    const current = adjustments[day];
    const currentIdx = adjustmentOptions.indexOf(current);
    const nextIdx = (currentIdx + 1) % adjustmentOptions.length;
    setAdjustments({ ...adjustments, [day]: adjustmentOptions[nextIdx] });
  };

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/meal-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekly: true, adjustments })
      });
      if (res.ok) {
        const data = await res.json();
        setWeeklyPlan(data.weeklyPlan);
      }
    } catch (error) {
      console.error("Error generating weekly plan:", error);
    } finally {
      setGenerating(false);
    }
  };

  const savePlan = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/meal-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekly: true, adjustments, save: true })
      });
      if (res.ok) {
        await onSaved?.();
        onClose();
      }
    } catch (error) {
      console.error("Error saving weekly plan:", error);
    } finally {
      setSaving(false);
    }
  };

  const getAdjustmentIcon = (adj) => {
    if (adj === 'less') return <Minus size={14} />;
    if (adj === 'more') return <Plus size={14} />;
    return <Circle size={14} />;
  };

  const mealTypeLabels = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack"
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Weekly Meal Planner</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-2">
              Set your eating preference for each day. Click on a day to cycle through: 
              <span className="text-blue-600 font-medium"> Eat Less (-20%)</span>, 
              <span className="text-green-600 font-medium"> Normal</span>, 
              <span className="text-orange-600 font-medium"> Eat More (+20%)</span>
            </p>
            <p className="text-xs text-gray-500">Base goal: {calorieGoal} cal/day</p>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const adj = adjustments[day];
              const info = calorieAdjustments[adj];
              return (
                <button
                  key={day}
                  onClick={() => cycleAdjustment(day)}
                  className={`p-2 rounded-lg border-2 transition-all ${info.bg} border-transparent hover:border-gray-300`}
                >
                  <div className="text-xs font-medium text-gray-700">{day.slice(0, 3)}</div>
                  <div className={`flex justify-center mt-1 ${info.color}`}>
                    {getAdjustmentIcon(adj)}
                  </div>
                  <div className={`text-xs mt-1 ${info.color}`}>
                    {Math.round(calorieGoal * info.multiplier)}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={generatePlan}
            disabled={generating}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={18} />
            {generating ? "Generating..." : "Generate Weekly Plan"}
          </button>

          {weeklyPlan && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Your Weekly Plan</h4>
              {days.map((day) => {
                const dayPlan = weeklyPlan[day];
                const adj = calorieAdjustments[dayPlan.adjustment];
                return (
                  <div key={day} className="border rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedDay(expandedDay === day ? null : day)}
                    >
                      <div className="flex items-center gap-2">
                        {expandedDay === day ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        <span className="font-medium">{day}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${adj.bg} ${adj.color}`}>
                          {adj.label}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{dayPlan.totals.calories} cal</span>
                    </div>
                    
                    {expandedDay === day && (
                      <div className="px-3 pb-3 space-y-1 border-t pt-2">
                        {Object.entries(dayPlan.meals).map(([type, meal]) => (
                          <div key={type} className="flex justify-between text-sm text-gray-600">
                            <span>{mealTypeLabels[type]}: {meal.name}</span>
                            <span>{meal.calories} cal</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={savePlan}
            disabled={!weeklyPlan || saving}
            className="flex-1 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Weekly Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
