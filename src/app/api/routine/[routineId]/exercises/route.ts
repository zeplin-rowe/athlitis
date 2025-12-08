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

  const { exerciseId, orderIndex, sets, reps } = await req.json();

  if (!exerciseId)
    return NextResponse.json(
      { error: "exerciseId is required" },
      { status: 400 }
    );

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
}

// HANDLERS
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
