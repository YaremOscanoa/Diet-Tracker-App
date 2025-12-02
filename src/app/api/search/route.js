import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!process.env.EDAMAM_APP_ID || !process.env.EDAMAM_APP_KEY) {
    // Return mock data if no keys
    return NextResponse.json({
      hints: [
        { food: { label: "Mock Apple", nutrients: { ENERC_KCAL: 95, PROCNT: 0.5, CHOCDF: 25, FAT: 0.3 } } },
        { food: { label: "Mock Chicken", nutrients: { ENERC_KCAL: 165, PROCNT: 31, CHOCDF: 0, FAT: 3.6 } } },
      ]
    });
  }

  const res = await fetch(
    `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&ingr=${q}`
  );
  const data = await res.json();
  return NextResponse.json(data);
}