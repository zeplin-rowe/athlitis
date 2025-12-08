import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

// GET logs (protected)
async function getLogs(req: NextRequest) {
  try {
    const userId = (req as any).userId;

    const logs = await prisma.userExerciseLog.findMany({
      where: { userId },
      orderBy: { performedAt: "desc" },
      include: { exercise: true },
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CREATE a new log (protected)
async function createLog(req: NextRequest) {
  try {
    const userId = (req as any).userId;

    let body;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { exerciseId, sets, reps, weight } = body;

    if (!exerciseId || isNaN(Number(exerciseId))) {
      return NextResponse.json(
        { error: "exerciseId is required and must be a number" },
        { status: 400 }
      );
    }

    if (sets !== undefined && isNaN(Number(sets))) {
      return NextResponse.json(
        { error: "sets must be a number" },
        { status: 400 }
      );
    }

    if (reps !== undefined && isNaN(Number(reps))) {
      return NextResponse.json(
        { error: "reps must be a number" },
        { status: 400 }
      );
    }

    if (weight !== undefined && isNaN(Number(weight))) {
      return NextResponse.json(
        { error: "weight must be a number" },
        { status: 400 }
      );
    }

    const exerciseExists = await prisma.exercise.findUnique({
      where: { id: Number(exerciseId) },
    });

    if (!exerciseExists) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const log = await prisma.userExerciseLog.create({
      data: {
        userId,
        exerciseId: Number(exerciseId),
        sets: sets ?? null,
        reps: reps ?? null,
        weight: weight ?? 0,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// HANDLERS
export async function GET(req: NextRequest) {
  return authMiddleware(req, getLogs);
}

export async function POST(req: NextRequest) {
  return authMiddleware(req, createLog);
}

export async function PUT(req: NextRequest) {
  return authMiddleware(req, createLog);
}
