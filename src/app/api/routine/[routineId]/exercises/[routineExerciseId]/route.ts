import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Params unwrap helper
async function getIds(context: {
  params: Promise<{ routineId: string; routineExerciseId: string }>;
}) {
  const { routineId, routineExerciseId } = await context.params;

  const rid = Number(routineId);
  const reid = Number(routineExerciseId);

  if (isNaN(rid) || isNaN(reid)) return { rid: null, reid: null };

  return { rid, reid };
}

// GET an exercise
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ routineId: string; routineExerciseId: string }> }
) {
  try {
    const { rid, reid } = await getIds(context);
    if (!rid || !reid)
      return NextResponse.json(
        { error: "Invalid routine or exercise ID" },
        { status: 400 }
      );

    const record = await prisma.routineExercise.findUnique({
      where: { id: reid },
      include: { exercise: true, routine: true },
    });

    if (!record)
      return NextResponse.json(
        { error: "Routine exercise not found" },
        { status: 404 }
      );

    return NextResponse.json(record, { status: 200 });
  } catch (err: any) {
    console.error("GET routineExercise error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

// UPDATE an exercise
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ routineId: string; routineExerciseId: string }> }
) {
  try {
    const { rid, reid } = await getIds(context);
    if (!rid || !reid)
      return NextResponse.json(
        { error: "Invalid routine or exercise ID" },
        { status: 400 }
      );

    const body = await req.json();
    const { sets, reps, orderIndex } = body;

    const updated = await prisma.routineExercise.update({
      where: { id: reid },
      data: {
        sets: sets ?? undefined,
        reps: reps ?? undefined,
        orderIndex: orderIndex ?? undefined,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("PUT routineExercise error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

// DELETE an exercise from a routine
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ routineId: string; routineExerciseId: string }> }
) {
  try {
    const { rid, reid } = await getIds(context);
    if (!rid || !reid)
      return NextResponse.json(
        { error: "Invalid routine or exercise ID" },
        { status: 400 }
      );

    await prisma.routineExercise.delete({ where: { id: reid } });

    return NextResponse.json(
      { message: "Exercise removed from routine" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE routineExercise error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
