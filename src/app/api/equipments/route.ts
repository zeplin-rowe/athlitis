import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(
      "https://exercisedb.p.rapidapi.com/exercises/equipmentList",
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );

    console.log("RapidAPI status:", res.status);
    const text = await res.text();
    console.log("RapidAPI response text:", text);

    if (!res.ok) throw new Error("Failed to fetch equipments");

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch equipments" },
      { status: 500 }
    );
  }
}
