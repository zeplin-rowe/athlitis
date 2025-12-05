import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { routineId: string } }
) {
  try {
    const data = await req.json(); // expected { exerciseId, sets?, reps?, orderIndex? }
    const routineId = Number(params.routineId);
    const { exerciseId, sets, reps, orderIndex } = data;

    // Basic validation
    if (!exerciseId || isNaN(Number(exerciseId))) {
      return NextResponse.json(
        { error: "exerciseId is required and must be a number" },
        { status: 400 }
      );
    }

    if (!routineId || isNaN(routineId)) {
      return NextResponse.json(
        { error: "Invalid routineId in URL" },
        { status: 400 }
      );
    }

    // Ensure routine exists
    const routineExists = await prisma.routine.findUnique({
      where: { id: routineId },
    });
    if (!routineExists) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    // Ensure exercise exists
    const exerciseExists = await prisma.exercise.findUnique({
      where: { id: Number(exerciseId) },
    });
    if (!exerciseExists) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const routineExercise = await prisma.routineExercise.create({
      data: {
        routineId,
        exerciseId: Number(exerciseId),
        sets: sets ?? 3,
        reps: reps ?? 10,
        orderIndex: orderIndex ?? 1,
      },
    });

    return NextResponse.json(routineExercise, { status: 201 });
  } catch (error) {
    console.error("POST routineExercise error:", error);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}
