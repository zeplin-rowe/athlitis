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

// GET routine (protected)
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

// UPDATE routine (protected, only owner)
async function updateRoutine(req: NextRequest, id: number) {
  const userId = (req as any).userId;

  const routine = await prisma.routine.findUnique({ where: { id } });
  if (!routine)
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });
  if (routine.userId !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, difficulty, category, thumbnailUrl } = body;

  const updated = await prisma.routine.update({
    where: { id },
    data: { name, description, difficulty, category, thumbnailUrl },
  });

  return NextResponse.json(updated, { status: 200 });
}

// DELETE routine (protected, only owner)
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

// App Router handlers
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const id = await getRoutineId(context);
  if (!id)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });
  return authMiddleware(req, (r: NextRequest) => getRoutine(r, id));
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const id = await getRoutineId(context);
  if (!id)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });
  return authMiddleware(req, (r: NextRequest) => updateRoutine(r, id));
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  const id = await getRoutineId(context);
  if (!id)
    return NextResponse.json({ error: "Invalid routine ID" }, { status: 400 });
  return authMiddleware(req, (r: NextRequest) => deleteRoutine(r, id));
}
