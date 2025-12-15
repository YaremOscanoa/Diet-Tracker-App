"use client";
import { useState } from "react";
import { Trash2, Coffee, Sun, Moon, Cookie, ChevronDown, ChevronUp, Flame } from "lucide-react";

const MEAL_CONFIG = {
  breakfast: { icon: Coffee, label: "Breakfast", color: "text-orange-500", bg: "bg-orange-50" },
  lunch: { icon: Sun, label: "Lunch", color: "text-yellow-500", bg: "bg-yellow-50" },
  dinner: { icon: Moon, label: "Dinner", color: "text-purple-500", bg: "bg-purple-50" },
  snack: { icon: Cookie, label: "Snacks", color: "text-amber-500", bg: "bg-amber-50" }
};

function MealItem({ meal, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(meal.id);
  };

  return (
    <div 
      className={`bg-white border rounded-lg overflow-hidden transition-all duration-200 ${
        isDeleting ? "opacity-50 scale-95" : ""
      }`}
    >
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
            <Flame size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{meal.name}</p>
            <p className="text-sm text-gray-500">{meal.calories} kcal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
          {showDetails ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </div>
      
      {showDetails && (
        <div className="px-3 pb-3 pt-0">
          <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{meal.protein}g</p>
              <p className="text-xs text-gray-500">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{meal.carbs}g</p>
              <p className="text-xs text-gray-500">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-yellow-600">{meal.fat}g</p>
              <p className="text-xs text-gray-500">Fat</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MealSection({ type, meals, onDelete }) {
  const config = MEAL_CONFIG[type];
  const Icon = config.icon;
  const sectionMeals = meals.filter(m => m.meal_type === type);
  const sectionCalories = sectionMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-3 rounded-lg ${config.bg} mb-2 hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-2">
          <Icon size={18} className={config.color} />
          <h4 className="font-semibold text-gray-700">{config.label}</h4>
          <span className="text-sm text-gray-500">({sectionMeals.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">{sectionCalories} kcal</span>
          {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </button>
      
      {isExpanded && (
        <div className="space-y-2 ml-2">
          {sectionMeals.length === 0 ? (
            <p className="text-sm text-gray-400 py-2 pl-2">No items logged yet</p>
          ) : (
            sectionMeals.map((meal) => (
              <MealItem key={meal.id} meal={meal} onDelete={onDelete} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function MealHistory({ meals, onDelete }) {
  const totalCalories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Today's Food Log</h3>
        <span className="text-sm font-medium text-gray-500">
          Total: {totalCalories} kcal
        </span>
      </div>
      
      {["breakfast", "lunch", "dinner", "snack"].map((type) => (
        <MealSection key={type} type={type} meals={meals} onDelete={onDelete} />
      ))}
    </div>
  );
}
