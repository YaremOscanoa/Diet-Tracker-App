"use client";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

export default function BMICard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
        <div className="h-16 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (!profile || !profile.bmi) {
    return null;
  }

  const getBMIPosition = (bmi) => {
    if (bmi < 15) return 0;
    if (bmi > 40) return 100;
    return ((bmi - 15) / 25) * 100;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={18} className="text-blue-600" />
        <h3 className="font-semibold text-gray-800">Your BMI</h3>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-3xl font-bold text-gray-800">{profile.bmi}</span>
          <span className={`ml-2 text-sm font-medium ${profile.bmi_color}`}>
            {profile.bmi_category}
          </span>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>{profile.weight} kg</div>
          <div>{profile.height} cm</div>
        </div>
      </div>

      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mt-3">
        <div className="absolute inset-0 flex">
          <div className="h-full bg-blue-400 flex-1"></div>
          <div className="h-full bg-green-400 flex-1"></div>
          <div className="h-full bg-yellow-400 flex-1"></div>
          <div className="h-full bg-red-400 flex-1"></div>
        </div>
        <div 
          className="absolute top-0 w-1 h-full bg-gray-800 rounded"
          style={{ left: `${getBMIPosition(profile.bmi)}%`, transform: 'translateX(-50%)' }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Under</span>
        <span>Normal</span>
        <span>Over</span>
        <span>Obese</span>
      </div>
    </div>
  );
}
