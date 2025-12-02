import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Add an exercise to routine
export async function POST(
  req: NextRequest,
  { params }: { params: { routineId: string } }
) {
  try {
    const data = await req.json(); // { exerciseId, sets, reps, orderIndex }

    const routineExercise = await prisma.routineExercise.create({
      data: {
        routineId: Number(params.routineId),
        exerciseId: data.exerciseId,
        sets: data.sets || 3,
        reps: data.reps || 10,
        orderIndex: data.orderIndex || 1,
      },
    });

    return NextResponse.json(routineExercise, { status: 201 });
  } catch (error) {
    console.error("POST routineExercise error:", error);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}

// Remove exercise using ID in request body
export async function DELETE(
  req: NextRequest,
  { params }: { params: { routineId: string } }
) {
  try {
    const data = await req.json(); // { routineExerciseId }

    await prisma.routineExercise.delete({
      where: { id: data.routineExerciseId },
    });

    return NextResponse.json({ message: "Exercise removed" });
  } catch (error) {
    console.error("DELETE routineExercise error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
