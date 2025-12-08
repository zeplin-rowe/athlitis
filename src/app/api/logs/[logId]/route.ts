import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

// HELPER
async function getLogId(context: { params: Promise<{ logId: string }> }) {
  const { logId } = await context.params;
  const id = Number(logId);

  return isNaN(id) ? null : id;
}

// GET a single log
async function getLog(req: NextRequest, logId: number) {
  try {
    const userId = (req as any).userId;

    const log = await prisma.userExerciseLog.findUnique({
      where: { id: logId },
    });

    if (!log || log.userId !== userId)
      return NextResponse.json({ error: "Log not found" }, { status: 404 });

    return NextResponse.json(log);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH update
async function updateLog(req: NextRequest, logId: number) {
  try {
    const userId = (req as any).userId;

    const log = await prisma.userExerciseLog.findUnique({
      where: { id: logId },
    });
    if (!log || log.userId !== userId)
      return NextResponse.json({ error: "Log not found" }, { status: 404 });

    const body = await req.json();

    const { sets, reps, weight } = body;

    const updated = await prisma.userExerciseLog.update({
      where: { id: logId },
      data: { sets, reps, weight },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE log
async function deleteLog(req: NextRequest, logId: number) {
  try {
    const userId = (req as any).userId;

    const log = await prisma.userExerciseLog.findUnique({
      where: { id: logId },
    });
    if (!log || log.userId !== userId)
      return NextResponse.json({ error: "Log not found" }, { status: 404 });

    await prisma.userExerciseLog.delete({ where: { id: logId } });

    return NextResponse.json({ message: "Log deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// HANDLERS
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ logId: string }> }
) {
  const id = await getLogId(context);
  if (id === null)
    return NextResponse.json({ error: "Invalid log ID" }, { status: 400 });

  return authMiddleware(req, (r) => getLog(r, id));
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ logId: string }> }
) {
  const id = await getLogId(context);
  if (id === null)
    return NextResponse.json({ error: "Invalid log ID" }, { status: 400 });

  return authMiddleware(req, (r) => updateLog(r, id));
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ logId: string }> }
) {
  const id = await getLogId(context);
  if (id === null)
    return NextResponse.json({ error: "Invalid log ID" }, { status: 400 });

  return authMiddleware(req, (r) => deleteLog(r, id));
}
