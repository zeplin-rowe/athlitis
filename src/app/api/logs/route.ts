import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET logs for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    const logs = await prisma.exerciseLog.findMany({
      where: { userId },
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

// POST create new log
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const log = await prisma.exerciseLog.create({
      data: {
        userId: data.userId,
        exerciseId: data.exerciseId,
        routineId: data.routineId || null,
        sets: data.sets,
        reps: data.reps,
        weight: data.weight || 0,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("POST /api/logs error:", error);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}
