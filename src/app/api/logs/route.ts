import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

// GET logs for the authenticated user
async function getLogs(req: NextRequest) {
  try {
    const userId = (req as any).userId;
    const logs = await prisma.userExerciseLog.findMany({
      where: { userId },
      orderBy: { performedAt: "desc" },
      include: { exercise: true },
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/logs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CREATE a new log
async function createLog(req: NextRequest) {
  try {
    const userId = (req as any).userId;
    const body = await req.json();
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
    if (!exerciseExists)
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );

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
    console.error("POST /api/logs error:", error);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}

// Wrap handlers with authMiddleware
export async function GET(req: NextRequest) {
  return authMiddleware(req, getLogs);
}

export async function POST(req: NextRequest) {
  return authMiddleware(req, createLog);
}
