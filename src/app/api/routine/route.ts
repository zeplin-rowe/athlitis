import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all routines
export async function GET() {
  try {
    const routines = await prisma.routine.findMany({
      include: { exercises: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(routines);
  } catch (error) {
    console.error("GET /api/routine error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CREATE a routine
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, difficulty, category, thumbnailUrl, userId } =
      body;

    if (!name || !userId) {
      return NextResponse.json(
        { error: "Name and userId are required" },
        { status: 400 }
      );
    }

    const routine = await prisma.routine.create({
      data: { name, description, difficulty, category, thumbnailUrl, userId },
    });

    return NextResponse.json(routine, { status: 201 });
  } catch (error) {
    console.error("POST /api/routine error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
