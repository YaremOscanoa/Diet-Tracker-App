"use client";
import { useState } from "react";
import { Apple, Coffee, Sandwich, Cookie, Salad, Pizza, Egg, Milk, Plus, Check } from "lucide-react";

const QUICK_FOODS = [
  { name: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0, icon: Apple, color: "bg-red-100 text-red-600" },
  { name: "Coffee", calories: 5, protein: 0, carbs: 0, fat: 0, icon: Coffee, color: "bg-amber-100 text-amber-600" },
  { name: "Sandwich", calories: 350, protein: 15, carbs: 40, fat: 12, icon: Sandwich, color: "bg-yellow-100 text-yellow-600" },
  { name: "Cookie", calories: 150, protein: 2, carbs: 20, fat: 7, icon: Cookie, color: "bg-orange-100 text-orange-600" },
  { name: "Salad", calories: 120, protein: 3, carbs: 12, fat: 7, icon: Salad, color: "bg-green-100 text-green-600" },
  { name: "Pizza Slice", calories: 285, protein: 12, carbs: 36, fat: 10, icon: Pizza, color: "bg-red-100 text-red-600" },
  { name: "Eggs (2)", calories: 155, protein: 13, carbs: 1, fat: 11, icon: Egg, color: "bg-yellow-100 text-yellow-600" },
  { name: "Milk (cup)", calories: 150, protein: 8, carbs: 12, fat: 8, icon: Milk, color: "bg-blue-100 text-blue-600" },
];

export default function QuickAddFoods({ onAddFood }) {
  const [addedItems, setAddedItems] = useState({});
  const [selectedMealType, setSelectedMealType] = useState("snack");

  const handleQuickAdd = async (food) => {
    setAddedItems(prev => ({ ...prev, [food.name]: true }));
    
    await onAddFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      meal_type: selectedMealType
    });

    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [food.name]: false }));
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Quick Add</h3>
        <select
          value={selectedMealType}
          onChange={(e) => setSelectedMealType(e.target.value)}
          className="text-sm border rounded-lg px-3 py-1 bg-white"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {QUICK_FOODS.map((food) => {
          const Icon = food.icon;
          const isAdded = addedItems[food.name];
          
          return (
            <button
              key={food.name}
              onClick={() => handleQuickAdd(food)}
              disabled={isAdded}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                isAdded 
                  ? "bg-green-100 scale-95" 
                  : `${food.color} hover:scale-105 hover:shadow-md`
              }`}
            >
              {isAdded ? (
                <Check size={24} className="text-green-600" />
              ) : (
                <Icon size={24} />
              )}
              <span className="text-xs font-medium mt-1 text-gray-700">{food.name}</span>
              <span className="text-xs text-gray-500">{food.calories} cal</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
