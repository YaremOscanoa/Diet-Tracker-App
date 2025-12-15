export const mealCatalog = {
  breakfast: [
    { name: "Oatmeal with Berries", calories: 300, protein: 10, carbs: 50, fat: 6 },
    { name: "Scrambled Eggs (2)", calories: 180, protein: 12, carbs: 2, fat: 14 },
    { name: "Greek Yogurt Parfait", calories: 250, protein: 15, carbs: 35, fat: 6 },
    { name: "Whole Wheat Toast with Avocado", calories: 280, protein: 8, carbs: 30, fat: 15 },
    { name: "Protein Smoothie", calories: 320, protein: 25, carbs: 40, fat: 8 },
    { name: "Banana Pancakes (3)", calories: 350, protein: 10, carbs: 55, fat: 10 },
    { name: "Egg White Omelet", calories: 150, protein: 20, carbs: 5, fat: 5 }
  ],
  lunch: [
    { name: "Grilled Chicken Salad", calories: 400, protein: 35, carbs: 20, fat: 20 },
    { name: "Turkey Sandwich", calories: 450, protein: 28, carbs: 45, fat: 15 },
    { name: "Quinoa Buddha Bowl", calories: 480, protein: 18, carbs: 60, fat: 18 },
    { name: "Tuna Wrap", calories: 380, protein: 30, carbs: 35, fat: 12 },
    { name: "Chicken Caesar Wrap", calories: 520, protein: 32, carbs: 40, fat: 25 },
    { name: "Vegetable Soup with Bread", calories: 320, protein: 12, carbs: 50, fat: 8 },
    { name: "Salmon Poke Bowl", calories: 550, protein: 35, carbs: 50, fat: 22 }
  ],
  dinner: [
    { name: "Grilled Salmon with Vegetables", calories: 450, protein: 40, carbs: 20, fat: 25 },
    { name: "Chicken Stir Fry", calories: 400, protein: 35, carbs: 35, fat: 12 },
    { name: "Lean Beef with Rice", calories: 520, protein: 38, carbs: 50, fat: 18 },
    { name: "Baked Cod with Potatoes", calories: 380, protein: 32, carbs: 40, fat: 8 },
    { name: "Turkey Meatballs with Pasta", calories: 550, protein: 35, carbs: 55, fat: 20 },
    { name: "Vegetable Curry with Rice", calories: 480, protein: 15, carbs: 65, fat: 18 },
    { name: "Grilled Chicken Breast", calories: 350, protein: 45, carbs: 10, fat: 12 }
  ],
  snack: [
    { name: "Apple with Almond Butter", calories: 200, protein: 5, carbs: 25, fat: 10 },
    { name: "Protein Bar", calories: 220, protein: 20, carbs: 22, fat: 8 },
    { name: "Mixed Nuts (30g)", calories: 180, protein: 6, carbs: 8, fat: 16 },
    { name: "Greek Yogurt", calories: 120, protein: 15, carbs: 8, fat: 3 },
    { name: "Cottage Cheese with Fruit", calories: 150, protein: 14, carbs: 15, fat: 4 },
    { name: "Hummus with Carrots", calories: 130, protein: 5, carbs: 15, fat: 6 },
    { name: "Rice Cakes with PB", calories: 160, protein: 5, carbs: 20, fat: 7 }
  ]
};

export const calorieAdjustments = {
  less: { label: "Eat Less", multiplier: 0.8, color: "text-blue-600", bg: "bg-blue-100" },
  normal: { label: "Normal", multiplier: 1.0, color: "text-green-600", bg: "bg-green-100" },
  more: { label: "Eat More", multiplier: 1.2, color: "text-orange-600", bg: "bg-orange-100" }
};

export function generateMealPlan(calorieGoal, adjustment = 'normal') {
  const multiplier = calorieAdjustments[adjustment]?.multiplier || 1.0;
  const adjustedGoal = Math.round(calorieGoal * multiplier);
  
  const distribution = {
    breakfast: 0.30,
    lunch: 0.35,
    dinner: 0.25,
    snack: 0.10
  };

  const plan = {};
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  for (const [mealType, percentage] of Object.entries(distribution)) {
    const targetCalories = adjustedGoal * percentage;
    const foods = mealCatalog[mealType];
    
    const closest = foods.reduce((prev, curr) => {
      return Math.abs(curr.calories - targetCalories) < Math.abs(prev.calories - targetCalories) ? curr : prev;
    });

    plan[mealType] = { ...closest };
    totalCalories += closest.calories;
    totalProtein += closest.protein;
    totalCarbs += closest.carbs;
    totalFat += closest.fat;
  }

  return {
    meals: plan,
    adjustment,
    targetCalories: adjustedGoal,
    totals: {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat
    }
  };
}

export function generateWeeklyPlan(calorieGoal, adjustments = {}) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekPlan = {};
  
  days.forEach(day => {
    const adjustment = adjustments[day] || 'normal';
    weekPlan[day] = generateMealPlan(calorieGoal, adjustment);
  });
  
  return weekPlan;
}
