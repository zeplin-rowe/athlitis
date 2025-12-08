import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

// GET a single log (authenticated user only)
async function getLog(req: NextRequest, logId: string) {
  const userId = (req as any).userId;
  const id = Number(logId);

  if (isNaN(id))
    return NextResponse.json({ error: "Invalid log ID" }, { status: 400 });

  const log = await prisma.userExerciseLog.findUnique({ where: { id } });

  if (!log || log.userId !== userId)
    return NextResponse.json({ error: "Log not found" }, { status: 404 });

  return NextResponse.json(log, { status: 200 });
}

// UPDATE a log (authenticated user only)
async function updateLog(req: NextRequest, logId: string) {
  const userId = (req as any).userId;
  const id = Number(logId);

  if (isNaN(id))
    return NextResponse.json({ error: "Invalid log ID" }, { status: 400 });

  const log = await prisma.userExerciseLog.findUnique({ where: { id } });
  if (!log || log.userId !== userId)
    return NextResponse.json({ error: "Log not found" }, { status: 404 });

  const body = await req.json();
  const { sets, reps, weight } = body;

  if (sets !== undefined && isNaN(Number(sets)))
    return NextResponse.json(
      { error: "sets must be a number" },
      { status: 400 }
    );
  if (reps !== undefined && isNaN(Number(reps)))
    return NextResponse.json(
      { error: "reps must be a number" },
      { status: 400 }
    );
  if (weight !== undefined && isNaN(Number(weight)))
    return NextResponse.json(
      { error: "weight must be a number" },
      { status: 400 }
    );

  const updated = await prisma.userExerciseLog.update({
    where: { id },
    data: { sets, reps, weight },
  });

  return NextResponse.json(updated, { status: 200 });
}

// DELETE a log (authenticated user only)
async function deleteLog(req: NextRequest, logId: string) {
  const userId = (req as any).userId;
  const id = Number(logId);

  if (isNaN(id))
    return NextResponse.json({ error: "Invalid log ID" }, { status: 400 });

  const log = await prisma.userExerciseLog.findUnique({ where: { id } });
  if (!log || log.userId !== userId)
    return NextResponse.json({ error: "Log not found" }, { status: 404 });

  await prisma.userExerciseLog.delete({ where: { id } });

  return NextResponse.json(
    { message: "Log deleted successfully" },
    { status: 200 }
  );
}

// Export handlers wrapped in authMiddleware
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ logId: string }> }
) {
  const { params } = context;
  const unwrappedParams = await params;
  return authMiddleware(req, (r: NextRequest) =>
    getLog(r, unwrappedParams.logId)
  );
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ logId: string }> }
) {
  const { params } = context;
  const unwrappedParams = await params;
  return authMiddleware(req, (r: NextRequest) =>
    updateLog(r, unwrappedParams.logId)
  );
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ logId: string }> }
) {
  const { params } = context;
  const unwrappedParams = await params; // unwrap the promise
  return authMiddleware(req, (r: NextRequest) =>
    deleteLog(r, unwrappedParams.logId)
  );
}
