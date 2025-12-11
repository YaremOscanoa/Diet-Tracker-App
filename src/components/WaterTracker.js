"use client";
import { Droplets, Plus } from "lucide-react";

export default function WaterTracker({ water, onAddWater }) {
  const waterGoal = 2000;
  const glasses = Math.floor(water / 250);
  const progress = Math.min((water / waterGoal) * 100, 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="text-blue-500" size={24} />
          <h3 className="font-bold text-gray-800">Water</h3>
        </div>
        <span className="text-sm text-gray-500">{water} / {waterGoal} ml</span>
      </div>
      
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-blue-500 transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{glasses} glasses</span>
        <div className="flex gap-2">
          {[250, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => onAddWater(amount)}
              className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus size={16} />
              {amount}ml
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
