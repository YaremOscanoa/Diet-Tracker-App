"use client";
import { Trash2, Coffee, Sun, Moon, Cookie } from "lucide-react";

const MEAL_ICONS = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie
};

const MEAL_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks"
};

function MealSection({ type, meals, onDelete }) {
  const Icon = MEAL_ICONS[type] || Coffee;
  const sectionMeals = meals.filter(m => m.meal_type === type);
  const sectionCalories = sectionMeals.reduce((acc, m) => acc + m.calories, 0);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-gray-500" />
          <h4 className="font-semibold text-gray-700">{MEAL_LABELS[type]}</h4>
        </div>
        {sectionCalories > 0 && (
          <span className="text-sm text-gray-500">{sectionCalories} kcal</span>
        )}
      </div>
      {sectionMeals.length === 0 ? (
        <p className="text-sm text-gray-400 ml-6">No items logged</p>
      ) : (
        <div className="space-y-2 ml-6">
          {sectionMeals.map((meal) => (
            <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{meal.name}</p>
                <p className="text-xs text-gray-500">
                  {meal.calories} kcal • {meal.protein}p • {meal.carbs}c • {meal.fat}f
                </p>
              </div>
              <button 
                onClick={() => onDelete(meal.id)} 
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MealHistory({ meals, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-4">Today's Food Log</h3>
      {["breakfast", "lunch", "dinner", "snack"].map((type) => (
        <MealSection key={type} type={type} meals={meals} onDelete={onDelete} />
      ))}
    </div>
  );
}
