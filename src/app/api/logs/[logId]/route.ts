import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET a log
export async function GET(
  request: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  try {
    const { logId } = await params;
    const id = Number(logId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid log ID" }, { status: 400 });
    }

    const log = await prisma.userExerciseLog.findUnique({
      where: { id },
    });

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error("GET LOG ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch log" }, { status: 500 });
  }
}

// UPDATE a log
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  try {
    const { logId } = await params;
    const id = Number(logId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid log ID" }, { status: 400 });
    }

    const body = await request.json();
    const { sets, reps, weight } = body;

    const updated = await prisma.userExerciseLog.update({
      where: { id },
      data: { sets, reps, weight },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("PUT LOG ERROR:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update log" },
      { status: 500 }
    );
  }
}

// DELETE log by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ logId: string }> }
) {
  try {
    const resolved = await params;
    const id = Number(resolved.logId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "logId must be a number" },
        { status: 400 }
      );
    }

    const existing = await prisma.userExerciseLog.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    await prisma.userExerciseLog.delete({ where: { id } });

    return NextResponse.json(
      { message: "Log deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE LOG ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
