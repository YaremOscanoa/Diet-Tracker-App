"use client";
import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { mealCatalog } from "@/lib/mealCatalog";

export default function MealPlanEditor({ calorieGoal, onSave, onClose }) {
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");

  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
  const mealTypeLabels = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack"
  };

  const distribution = {
    breakfast: 0.30,
    lunch: 0.35,
    dinner: 0.25,
    snack: 0.10
  };

  const addFood = (food) => {
    setItems([...items, { ...food, meal_type: selectedMealType }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totals = items.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fat: acc.fat + item.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleSave = () => {
    if (!name.trim() || items.length === 0) return;
    onSave({
      name: name.trim(),
      plan_type: 'custom',
      items: items.map((item, idx) => ({
        meal_type: item.meal_type,
        food_name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        order_index: idx
      }))
    });
  };

  const targetForType = Math.round(calorieGoal * distribution[selectedMealType]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Create Meal Plan</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekday Plan"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {mealTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMealType(type)}
                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                  selectedMealType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {mealTypeLabels[type]}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            Target for {mealTypeLabels[selectedMealType]}: ~{targetForType} cal
          </div>

          <div className="border rounded-lg max-h-48 overflow-y-auto">
            {mealCatalog[selectedMealType].map((food, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium text-sm">{food.name}</div>
                  <div className="text-xs text-gray-500">
                    {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                  </div>
                </div>
                <button
                  onClick={() => addFood(food)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="border rounded-lg p-3 bg-gray-50">
              <h4 className="font-medium text-sm mb-2">Selected Items</h4>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>
                      <span className="text-gray-400">[{mealTypeLabels[item.meal_type]}]</span>{" "}
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{item.calories} cal</span>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>{totals.calories} cal</span>
                </div>
              </div>
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
            onClick={handleSave}
            disabled={!name.trim() || items.length === 0}
            className="flex-1 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
}
