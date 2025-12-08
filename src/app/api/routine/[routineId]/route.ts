import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";
import { enumNormalize } from "@/middleware/enumNormalize";

async function getRoutineId(paramsPromise: Promise<{ routineId: string }>) {
  const { routineId } = await paramsPromise;
  const id = Number(routineId);
  return Number.isNaN(id) ? null : id;
}

// GET routine
async function getRoutine(req: NextRequest, id: number) {
  const userId = (req as any).userId;

  const routine = await prisma.routine.findUnique({
    where: { id },
    include: {
      exercises: { include: { exercise: true } },
      user: true,
    },
  });

  if (!routine)
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });

  if (routine.userId !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(routine);
}

// PUT routine
async function updateRoutine(req: NextRequest, id: number) {
  const userId = (req as any).userId;

  const routine = await prisma.routine.findUnique({ where: { id } });
  if (!routine)
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });

  if (routine.userId !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body = await req.json();

  try {
    body = enumNormalize(body);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { name, description, difficulty, category, thumbnailUrl } = body;

  const updated = await prisma.routine.update({
    where: { id },
    data: { name, description, difficulty, category, thumbnailUrl },
  });

  return NextResponse.json(updated, { status: 200 });
}

// DELETE routine
async function deleteRoutine(req: NextRequest, id: number) {
  const userId = (req as any).userId;

  const routine = await prisma.routine.findUnique({ where: { id } });
  if (!routine)
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });

  if (routine.userId !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.routine.delete({ where: { id } });
  return NextResponse.json({ message: "Routine deleted successfully" });
}

// HANDLERS
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const id = await getRoutineId(context.params);
  if (!id)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });

  return authMiddleware(req, (r) => getRoutine(r, id));
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const id = await getRoutineId(context.params);
  if (!id)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });

  return authMiddleware(req, (r) => updateRoutine(r, id));
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const id = await getRoutineId(context.params);
  if (!id)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });

  return authMiddleware(req, (r) => deleteRoutine(r, id));
}
