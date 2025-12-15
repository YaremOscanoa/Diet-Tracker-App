import MacroChart from "./MacroChart";

export default function GoalCard({ goals, total }) {
  const remaining = goals.calorie_goal - total.calories;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Chart Section */}
        <div className="relative">
          <MacroChart protein={total.protein} carbs={total.carbs} fat={total.fat} />
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-2xl font-bold text-gray-800">{remaining}</span>
            <span className="text-xs text-gray-500">left</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex-1 w-full grid grid-cols-2 gap-4">
          <StatBox label="Calories" current={total.calories} goal={goals.calorie_goal} color="bg-gray-800" />
          <StatBox label="Protein" current={total.protein} goal={goals.protein_goal} color="bg-blue-500" suffix="g" />
          <StatBox label="Carbs" current={total.carbs} goal={goals.carbs_goal} color="bg-green-500" suffix="g" />
          <StatBox label="Fat" current={total.fat} goal={goals.fat_goal} color="bg-yellow-500" suffix="g" />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, current, goal, color, suffix = "" }) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div className="flex flex-col">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold">{current} / {goal}{suffix}</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}