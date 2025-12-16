import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

async function getIds(
  paramsPromise: Promise<{ routineId: string; routineExerciseId: string }>
) {
  const { routineId, routineExerciseId } = await paramsPromise;

  const rid = Number(routineId);
  const reid = Number(routineExerciseId);

  if (Number.isNaN(rid) || Number.isNaN(reid)) {
    return { rid: null, reid: null };
  }

  return { rid, reid };
}

async function assertOwnership(userId: number, routineExerciseId: number) {
  const record = await prisma.routineExercise.findUnique({
    where: { id: routineExerciseId },
    include: { routine: true, exercise: true },
  });

  if (!record) {
    return {
      error: NextResponse.json(
        { error: "Routine exercise not found" },
        { status: 404 }
      ),
    };
  }

  if (record.routine.userId !== userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { record };
}

// GET exercise
async function getExercise(req: NextRequest, reid: number) {
  const userId = (req as any).userId;

  const { record, error } = await assertOwnership(userId, reid);
  if (error) return error;

  return NextResponse.json(record, { status: 200 });
}

// UPDATE exercise
async function updateExercise(req: NextRequest, reid: number) {
  const userId = (req as any).userId;

  const { error } = await assertOwnership(userId, reid);
  if (error) return error;

  const body = await req.json();
  const { sets, reps, weight, orderIndex } = body;

  const updated = await prisma.routineExercise.update({
    where: { id: reid },
    data: {
      sets: sets ?? null,
      reps: reps ?? null,
      weight: weight ?? null,
      orderIndex: orderIndex ?? undefined,
    },
    include: { exercise: true },
  });

  return NextResponse.json(updated, { status: 200 });
}

// DELETE exercise
async function deleteExercise(req: NextRequest, reid: number) {
  const userId = (req as any).userId;

  const { error } = await assertOwnership(userId, reid);
  if (error) return error;

  await prisma.routineExercise.delete({
    where: { id: reid },
  });

  return NextResponse.json(
    { message: "Exercise removed from routine" },
    { status: 200 }
  );
}

// ROUTE HANDLERS
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ routineId: string; routineExerciseId: string }> }
) {
  const { reid } = await getIds(context.params);
  if (!reid) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return authMiddleware(req, (r) => getExercise(r, reid));
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ routineId: string; routineExerciseId: string }> }
) {
  const { reid } = await getIds(context.params);
  if (!reid) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return authMiddleware(req, (r) => updateExercise(r, reid));
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ routineId: string; routineExerciseId: string }> }
) {
  const { reid } = await getIds(context.params);
  if (!reid) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return authMiddleware(req, (r) => deleteExercise(r, reid));
}
