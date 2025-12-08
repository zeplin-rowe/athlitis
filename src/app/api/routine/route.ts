import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

// GET all routines (public)
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

// CREATE a routine (protected)
async function createRoutine(req: NextRequest) {
  try {
    const userId = (req as any).userId;
    const body = await req.json();
    const { name, description, difficulty, category, thumbnailUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const allowedDifficulties = ["beginner", "intermediate", "advanced"];
    let difficultyEnum: "beginner" | "intermediate" | "advanced" | undefined;
    if (difficulty) {
      const normalizedDifficulty = difficulty.toLowerCase();
      if (!allowedDifficulties.includes(normalizedDifficulty)) {
        return NextResponse.json(
          { error: "Invalid difficulty" },
          { status: 400 }
        );
      }
      difficultyEnum = normalizedDifficulty as
        | "beginner"
        | "intermediate"
        | "advanced";
    }

    const allowedCategories = [
      "strength",
      "cardio",
      "mobility",
      "balance",
      "stretching",
      "plyometrics",
      "rehabilitation",
      "other",
    ];
    let categoryEnum:
      | "strength"
      | "cardio"
      | "mobility"
      | "balance"
      | "stretching"
      | "plyometrics"
      | "rehabilitation"
      | "other"
      | undefined;

    if (category) {
      const normalizedCategory = category.toLowerCase();
      if (!allowedCategories.includes(normalizedCategory)) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 }
        );
      }
      categoryEnum = normalizedCategory as (typeof allowedCategories)[number];
    }

    const routine = await prisma.routine.create({
      data: {
        name,
        description,
        difficulty: difficultyEnum,
        category: categoryEnum,
        thumbnailUrl,
        userId,
      },
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

export async function POST(req: NextRequest) {
  return authMiddleware(req, createRoutine);
}
