"use client";
import { useState } from "react";
import { Search, Plus } from "lucide-react";

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" }
];

export default function MealForm({ onMealAdded }) {
  const [activeTab, setActiveTab] = useState("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [mealType, setMealType] = useState("breakfast");
  const [manual, setManual] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setResults(data.hints || []);
    setLoading(false);
  };

  const addFood = async (foodData) => {
    await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...foodData, meal_type: mealType }),
    });
    onMealAdded();
    setResults([]);
    setQuery("");
    setManual({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex gap-4 mb-4 border-b">
        <button 
          onClick={() => setActiveTab("search")} 
          className={`pb-2 ${activeTab === "search" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
        >
          Search Food
        </button>
        <button 
          onClick={() => setActiveTab("manual")} 
          className={`pb-2 ${activeTab === "manual" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
        >
          Quick Add
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
        <div className="flex gap-2 flex-wrap">
          {MEAL_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setMealType(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mealType === type.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "search" ? (
        <div>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search (e.g., Apple, Pizza)..."
              className="flex-1 p-2 border rounded-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg">
              <Search size={20} />
            </button>
          </form>
          {loading && <p className="text-sm text-gray-500">Searching...</p>}
          <div className="max-h-60 overflow-y-auto">
            {results.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg group">
                <div>
                  <p className="font-semibold">{item.food.label}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round(item.food.nutrients.ENERC_KCAL || 0)} cal | 
                    P: {Math.round(item.food.nutrients.PROCNT || 0)}g | 
                    C: {Math.round(item.food.nutrients.CHOCDF || 0)}g | 
                    F: {Math.round(item.food.nutrients.FAT || 0)}g
                  </p>
                </div>
                <button 
                  onClick={() => addFood({
                    name: item.food.label,
                    calories: Math.round(item.food.nutrients.ENERC_KCAL || 0),
                    protein: Math.round(item.food.nutrients.PROCNT || 0),
                    carbs: Math.round(item.food.nutrients.CHOCDF || 0),
                    fat: Math.round(item.food.nutrients.FAT || 0),
                  })}
                  className="text-blue-600 bg-blue-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); addFood(manual); }} className="grid gap-3">
          <input 
            placeholder="Food Name" className="p-2 border rounded" required
            value={manual.name} onChange={e => setManual({...manual, name: e.target.value})} 
          />
          <div className="grid grid-cols-4 gap-2">
            <input type="number" placeholder="Cals" className="p-2 border rounded" required
              value={manual.calories} onChange={e => setManual({...manual, calories: e.target.value})} />
            <input type="number" placeholder="Prot (g)" className="p-2 border rounded"
              value={manual.protein} onChange={e => setManual({...manual, protein: e.target.value})} />
            <input type="number" placeholder="Carbs (g)" className="p-2 border rounded"
              value={manual.carbs} onChange={e => setManual({...manual, carbs: e.target.value})} />
            <input type="number" placeholder="Fat (g)" className="p-2 border rounded"
              value={manual.fat} onChange={e => setManual({...manual, fat: e.target.value})} />
          </div>
          <button type="submit" className="bg-green-600 text-white p-2 rounded-lg font-semibold">Log Meal</button>
        </form>
      )}
    </div>
  );
}
