"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MacroChart({ protein, carbs, fat }) {
  const data = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [protein, carbs, fat],
        backgroundColor: ["#3b82f6", "#22c55e", "#eab308"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="w-32 h-32 mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
}