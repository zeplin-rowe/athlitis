import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

// Helper to unwrap routineId safely
async function getRoutineId(context: {
  params: Promise<{ routineId: string }>;
}) {
  const { routineId } = await context.params;
  const id = Number(routineId);
  if (isNaN(id)) return null;
  return id;
}

// GET all exercises for a routine (protected, owner-only)
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

// Add an exercise to a routine (protected, owner-only)
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

// App Router handlers
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const routineId = await getRoutineId(context);
  if (!routineId)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });
  return authMiddleware(req, (r: NextRequest) => getExercises(r, routineId));
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const routineId = await getRoutineId(context);
  if (!routineId)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });
  return authMiddleware(req, (r: NextRequest) => addExercise(r, routineId));
}
