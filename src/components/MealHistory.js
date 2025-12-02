"use client";
import { Trash2 } from "lucide-react";

export default function MealHistory({ meals, onDelete }) {
  if (meals.length === 0) {
    return <div className="text-center text-gray-400 py-8">No meals logged today.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-4">Today's History</h3>
      <div className="space-y-3">
        {meals.map((meal) => (
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
    </div>
  );
}