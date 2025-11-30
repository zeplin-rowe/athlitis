import { NextResponse } from "next/server";
import { fetchAllExercises } from "@/lib/exerciseApi";

export async function GET() {
  try {
    const exercises = await fetchAllExercises();
    const firstFive = exercises.slice(0, 5);

    return NextResponse.json(firstFive);
  } catch (err: any) {
    console.error("ERROR in test API:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
