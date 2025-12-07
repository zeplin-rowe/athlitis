import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Params unwrap helper
async function getIdFromParams(context: {
  params: Promise<{ routineId: string }>;
}) {
  const { routineId } = await context.params;
  const id = Number(routineId);
  if (isNaN(id)) return null;
  return id;
}

// GET all exercises for a routine
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  try {
    const routineId = await getIdFromParams(context);
    if (!routineId)
      return NextResponse.json(
        { error: "Invalid routine ID" },
        { status: 400 }
      );

    const exercises = await prisma.routineExercise.findMany({
      where: { routineId },
      orderBy: { orderIndex: "asc" },
      include: {
        exercise: true,
      },
    });

    return NextResponse.json(exercises, { status: 200 });
  } catch (err: any) {
    console.error("GET exercises error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

// Add an exercise to a routine
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  try {
    const routineId = await getIdFromParams(context);
    if (!routineId)
      return NextResponse.json(
        { error: "Invalid routine ID" },
        { status: 400 }
      );

    const { exerciseId, orderIndex, sets, reps } = await req.json();

    if (!exerciseId)
      return NextResponse.json(
        { error: "exerciseId is required" },
        { status: 400 }
      );

    // Optional validation: verify routine exists
    const exists = await prisma.routine.findUnique({
      where: { id: routineId },
    });
    if (!exists)
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });

    const added = await prisma.routineExercise.create({
      data: {
        routineId,
        exerciseId,
        orderIndex: orderIndex ?? 0,
        sets: sets ?? null,
        reps: reps ?? null,
      },
    });

    return NextResponse.json(added, { status: 201 });
  } catch (err: any) {
    console.error("POST exercises error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
