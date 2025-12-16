import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

async function getRoutineId(paramsPromise: Promise<{ routineId: string }>) {
  const { routineId } = await paramsPromise;
  const id = Number(routineId);
  return Number.isNaN(id) ? null : id;
}

// GET exercises
async function getExercises(req: NextRequest, routineId: number) {
  const userId = (req as any).userId;

  const routine = await prisma.routine.findUnique({ where: { id: routineId } });
  if (!routine)
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });

  if (routine.userId !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const exercises = await prisma.routineExercise.findMany({
    where: { routineId },
    orderBy: { orderIndex: "asc" },
    include: { exercise: true },
  });

  return NextResponse.json(exercises, { status: 200 });
}

// POST exercise
async function addExercise(req: NextRequest, routineId: number) {
  const userId = (req as any).userId;

  const routine = await prisma.routine.findUnique({ where: { id: routineId } });
  if (!routine)
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });

  if (routine.userId !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  console.log("POST /routine/:id/exercises body:", body);

  const { exerciseId, sets, reps, weight } = body;

  if (!exerciseId)
    return NextResponse.json(
      { error: "exerciseId is required" },
      { status: 400 }
    );

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });
  if (!exercise)
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });

  const lastExercise = await prisma.routineExercise.findFirst({
    where: { routineId },
    orderBy: { orderIndex: "desc" },
  });

  const nextOrderIndex = lastExercise ? lastExercise.orderIndex + 1 : 0;

  const added = await prisma.routineExercise.create({
    data: {
      routineId,
      exerciseId,
      orderIndex: nextOrderIndex,
      sets: sets ?? null,
      reps: reps ?? null,
      weight: weight ?? null,
    },
    include: {
      exercise: true,
    },
  });

  return NextResponse.json(added, { status: 201 });
}

// ROUTE HANDLERS
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const routineId = await getRoutineId(context.params);
  if (!routineId)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });

  return authMiddleware(req, (r) => getExercises(r, routineId));
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const routineId = await getRoutineId(context.params);
  if (!routineId)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });

  return authMiddleware(req, (r) => addExercise(r, routineId));
}
