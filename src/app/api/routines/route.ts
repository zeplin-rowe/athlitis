import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all routines
export async function GET() {
  try {
    const routines = await prisma.routine.findMany({
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(routines);
  } catch (error) {
    console.error("GET /api/routines error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CREATE new routine
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const routine = await prisma.routine.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description || null,
        difficulty: data.difficulty || "beginner",
        category: data.category || "other",
        thumbnailUrl: data.thumbnailUrl || null,
      },
    });

    return NextResponse.json(routine, { status: 201 });
  } catch (error) {
    console.error("POST /api/routines error:", error);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}
