import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET logs for a specific user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        { error: "userId is required and must be a number" },
        { status: 400 }
      );
    }

    const logs = await prisma.userExerciseLog.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
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

// CREATE a log
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("RAW BODY RECEIVED:", body);

    const { userId, exerciseId, sets, reps, weight } = body;

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        { error: "userId is required and must be a number" },
        { status: 400 }
      );
    }

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

    const exerciseExists = await prisma.exercise.findUnique({
      where: { id: Number(exerciseId) },
    });
    if (!exerciseExists) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const log = await prisma.userExerciseLog.create({
      data: {
        userId: Number(userId),
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
