import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

async function getIds(
  paramsPromise: Promise<{ routineId: string; routineExerciseId: string }>
) {
  const { routineId, routineExerciseId } = await paramsPromise;
  const rid = Number(routineId);
  const reid = Number(routineExerciseId);
  return {
    rid: Number.isNaN(rid) ? null : rid,
    reid: Number.isNaN(reid) ? null : reid,
  };
}

// GET routineExercise
async function getExercise(req: NextRequest, rid: number, reid: number) {
  const userId = (req as any).userId;

  const record = await prisma.routineExercise.findUnique({
    where: { id: reid },
    include: { exercise: true, routine: true },
  });

  if (!record)
    return NextResponse.json(
      { error: "Routine exercise not found" },
      { status: 404 }
    );

  if (record.routine.userId !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(record, { status: 200 });
}

// UPDATE routineExercise
async function updateExercise(req: NextRequest, rid: number, reid: number) {
  const userId = (req as any).userId;

  const record = await prisma.routineExercise.findUnique({
    where: { id: reid },
    include: { routine: true },
  });

  if (!record)
    return NextResponse.json(
      { error: "Routine exercise not found" },
      { status: 404 }
    );

  if (record.routine.userId !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sets, reps, orderIndex } = await req.json();

  const updated = await prisma.routineExercise.update({
    where: { id: reid },
    data: {
      sets: sets ?? undefined,
      reps: reps ?? undefined,
      orderIndex: orderIndex ?? undefined,
    },
  });

  return NextResponse.json(updated, { status: 200 });
}

// DELETE routineExercise
async function deleteExercise(req: NextRequest, rid: number, reid: number) {
  const userId = (req as any).userId;

  const record = await prisma.routineExercise.findUnique({
    where: { id: reid },
    include: { routine: true },
  });

  if (!record)
    return NextResponse.json(
      { error: "Routine exercise not found" },
      { status: 404 }
    );

  if (record.routine.userId !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.routineExercise.delete({ where: { id: reid } });

  return NextResponse.json(
    { message: "Exercise removed from routine" },
    { status: 200 }
  );
}

// HANDLERS
export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ routineId: string; routineExerciseId: string }>;
  }
) {
  const { rid, reid } = await getIds(context.params);

  if (!rid || !reid)
    return NextResponse.json(
      { error: "Invalid routine or exercise ID" },
      { status: 400 }
    );

  return authMiddleware(req, (r) => getExercise(r, rid, reid));
}

export async function PUT(
  req: NextRequest,
  context: {
    params: Promise<{ routineId: string; routineExerciseId: string }>;
  }
) {
  const { rid, reid } = await getIds(context.params);

  if (!rid || !reid)
    return NextResponse.json(
      { error: "Invalid routine or exercise ID" },
      { status: 400 }
    );

  return authMiddleware(req, (r) => updateExercise(r, rid, reid));
}

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ routineId: string; routineExerciseId: string }>;
  }
) {
  const { rid, reid } = await getIds(context.params);

  if (!rid || !reid)
    return NextResponse.json(
      { error: "Invalid routine or exercise ID" },
      { status: 400 }
    );

  return authMiddleware(req, (r) => deleteExercise(r, rid, reid));
}
