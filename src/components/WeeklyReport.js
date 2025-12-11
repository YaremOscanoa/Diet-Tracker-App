"use client";
import { useEffect, useState } from "react";
import { X, TrendingUp, Target, Award } from "lucide-react";

export default function WeeklyReport({ onClose }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const res = await fetch("/api/weekly-report");
    const data = await res.json();
    setReport(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
          Loading report...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Weekly Progress</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={24} />
              <h3 className="font-bold text-lg">This Week's Summary</h3>
            </div>
            <p className="text-blue-100">
              {report?.daysLogged || 0} out of 7 days logged
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Target className="text-green-500 mt-1" size={20} />
              <div>
                <h4 className="font-semibold">Calorie Goal</h4>
                <p className="text-sm text-gray-600">
                  Hit your calorie goal {report?.calorieGoalDays || 0} out of {report?.daysLogged || 0} days
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Award className="text-blue-500 mt-1" size={20} />
              <div>
                <h4 className="font-semibold">Protein Champion</h4>
                <p className="text-sm text-gray-600">
                  Hit your protein goal {report?.proteinGoalDays || 0} out of {report?.daysLogged || 0} days
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Daily Averages</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-800">{report?.avgCalories || 0}</p>
                <p className="text-sm text-gray-500">Avg Calories</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-800">{report?.avgProtein || 0}g</p>
                <p className="text-sm text-gray-500">Avg Protein</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-800">{report?.avgCarbs || 0}g</p>
                <p className="text-sm text-gray-500">Avg Carbs</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-800">{report?.avgFat || 0}g</p>
                <p className="text-sm text-gray-500">Avg Fat</p>
              </div>
            </div>
          </div>

          {report?.highlights && report.highlights.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Highlights</h4>
              <ul className="space-y-2">
                {report.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
