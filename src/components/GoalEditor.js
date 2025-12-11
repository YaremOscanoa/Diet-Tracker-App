"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function GoalEditor({ goals, onSave, onClose }) {
  const [form, setForm] = useState({
    calorie_goal: goals.calorie_goal,
    protein_goal: goals.protein_goal,
    carbs_goal: goals.carbs_goal,
    fat_goal: goals.fat_goal
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      calorie_goal: parseInt(form.calorie_goal),
      protein_goal: parseInt(form.protein_goal),
      carbs_goal: parseInt(form.carbs_goal),
      fat_goal: parseInt(form.fat_goal)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Goals</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Calories
            </label>
            <input
              type="number"
              value={form.calorie_goal}
              onChange={(e) => setForm({ ...form, calorie_goal: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                value={form.protein_goal}
                onChange={(e) => setForm({ ...form, protein_goal: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                value={form.carbs_goal}
                onChange={(e) => setForm({ ...form, carbs_goal: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                value={form.fat_goal}
                onChange={(e) => setForm({ ...form, fat_goal: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Save Goals
          </button>
        </form>
      </div>
    </div>
  );
}
