import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { routineExerciseId: string } }
) {
  try {
    const data = await req.json(); // { sets?, reps?, orderIndex? }

    const updated = await prisma.routineExercise.update({
      where: { id: Number(params.routineExerciseId) },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH routineExercise error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
