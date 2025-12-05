import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { routineExerciseId: string } }
) {
  try {
    const data = await req.json(); // { sets?, reps?, orderIndex? }
    const id = Number(params.routineExerciseId);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid routineExerciseId" },
        { status: 400 }
      );
    }

    const updated = await prisma.routineExercise.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH routineExercise error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { routineExerciseId: string } }
) {
  try {
    const id = Number(params.routineExerciseId);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid routineExerciseId" },
        { status: 400 }
      );
    }

    // Optionally: check exists first to provide a 404 instead of generic error
    const exists = await prisma.routineExercise.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json(
        { error: "RoutineExercise not found" },
        { status: 404 }
      );
    }

    await prisma.routineExercise.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Routine exercise deleted" });
  } catch (error) {
    console.error("DELETE routineExercise error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
