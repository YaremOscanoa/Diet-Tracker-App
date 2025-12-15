"use client";
import { Droplets, Plus, Minus, RotateCcw } from "lucide-react";

export default function WaterTracker({ water, onAddWater, onReduceWater, onResetWater }) {
  const waterGoal = 2000;
  const glasses = Math.floor(water / 250);
  const progress = Math.min((water / waterGoal) * 100, 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="text-blue-500" size={24} />
          <h3 className="font-bold text-gray-800">Water Intake</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{water} / {waterGoal} ml</span>
          {onResetWater && water > 0 && (
            <button
              onClick={onResetWater}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Reset water"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden mb-4 relative">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(Math.min(8, glasses))].map((_, i) => (
              <Droplets key={i} size={14} className="text-blue-500 -ml-1 first:ml-0" />
            ))}
          </div>
          <span className="text-sm text-gray-500">{glasses} glasses</span>
        </div>
        
        <div className="flex gap-2">
          {onReduceWater && water > 0 && (
            <button
              onClick={() => onReduceWater(250)}
              className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Minus size={16} />
              250ml
            </button>
          )}
          <button
            onClick={() => onAddWater(250)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <Plus size={16} />
            250ml
          </button>
          <button
            onClick={() => onAddWater(500)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            <Plus size={16} />
            500ml
          </button>
        </div>
      </div>
    </div>
  );
}
