"use client";
import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw, Heart, Flame, Utensils, Moon, Footprints } from "lucide-react";

const HEALTH_TIPS = [
  { tip: "Drink a glass of water before each meal to help control portions and stay hydrated.", category: "hydration", icon: Heart },
  { tip: "Aim for at least 10,000 steps daily. Take the stairs instead of the elevator!", category: "exercise", icon: Footprints },
  { tip: "Get 7-8 hours of sleep. Poor sleep can increase hunger hormones.", category: "sleep", icon: Moon },
  { tip: "Eat slowly and mindfully. It takes 20 minutes for your brain to register fullness.", category: "eating", icon: Utensils },
  { tip: "Replace sugary drinks with water, tea, or sparkling water to cut empty calories.", category: "hydration", icon: Heart },
  { tip: "Fill half your plate with vegetables at each meal for more nutrients and fewer calories.", category: "nutrition", icon: Utensils },
  { tip: "High-protein breakfasts help reduce cravings and overeating later in the day.", category: "nutrition", icon: Flame },
  { tip: "Take a 10-minute walk after meals to improve digestion and blood sugar levels.", category: "exercise", icon: Footprints },
  { tip: "Keep healthy snacks visible and junk food out of sight to make better choices.", category: "nutrition", icon: Utensils },
  { tip: "Stress can trigger emotional eating. Try deep breathing or a short walk instead.", category: "mental", icon: Heart },
  { tip: "Track everything you eat - awareness is the first step to better eating habits.", category: "tracking", icon: Flame },
  { tip: "Eat more fiber! It keeps you full longer and supports healthy digestion.", category: "nutrition", icon: Utensils },
  { tip: "Limit eating after 8 PM to give your digestive system time to rest overnight.", category: "eating", icon: Moon },
  { tip: "Meal prep on weekends to avoid unhealthy fast food choices during busy weekdays.", category: "planning", icon: Utensils },
  { tip: "Celebrate small wins! Every healthy choice counts toward your bigger goal.", category: "motivation", icon: Heart },
];

const CATEGORY_COLORS = {
  hydration: "bg-blue-50 border-blue-200",
  exercise: "bg-green-50 border-green-200",
  sleep: "bg-purple-50 border-purple-200",
  eating: "bg-orange-50 border-orange-200",
  nutrition: "bg-emerald-50 border-emerald-200",
  mental: "bg-pink-50 border-pink-200",
  tracking: "bg-amber-50 border-amber-200",
  planning: "bg-cyan-50 border-cyan-200",
  motivation: "bg-rose-50 border-rose-200",
};

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("tipDate");
    const storedIndex = localStorage.getItem("tipIndex");

    if (storedDate === today && storedIndex) {
      setTipIndex(parseInt(storedIndex));
    } else {
      const newIndex = Math.floor(Math.random() * HEALTH_TIPS.length);
      setTipIndex(newIndex);
      localStorage.setItem("tipDate", today);
      localStorage.setItem("tipIndex", newIndex.toString());
    }
  }, []);

  const getNewTip = () => {
    setIsRefreshing(true);
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * HEALTH_TIPS.length);
    } while (newIndex === tipIndex);
    
    setTimeout(() => {
      setTipIndex(newIndex);
      setIsRefreshing(false);
    }, 300);
  };

  const currentTip = HEALTH_TIPS[tipIndex];
  const Icon = currentTip.icon;
  const bgColor = CATEGORY_COLORS[currentTip.category] || "bg-gray-50 border-gray-200";

  return (
    <div className={`p-5 rounded-xl border-2 ${bgColor} transition-all duration-300`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Lightbulb className="text-yellow-500" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Tip of the Day</h3>
            <p className={`text-gray-600 leading-relaxed transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
              {currentTip.tip}
            </p>
          </div>
        </div>
        <button
          onClick={getNewTip}
          disabled={isRefreshing}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
          title="Get another tip"
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Icon size={14} className="text-gray-400" />
        <span className="text-xs text-gray-400 capitalize">{currentTip.category}</span>
      </div>
    </div>
  );
}
