import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { logId: string } }
) {
  try {
    const id = Number(params.logId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "logId must be a number" },
        { status: 400 }
      );
    }

    const log = await prisma.exerciseLog.findUnique({
      where: { id },
      include: { exercise: true, user: true, routine: true },
    });

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error("GET /api/logs/[logId] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE a log
export async function PATCH(
  req: NextRequest,
  { params }: { params: { logId: string } }
) {
  try {
    const data = await req.json();

    const updated = await prisma.exerciseLog.update({
      where: { id: Number(params.logId) },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/logs/[logId] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

// DELETE a log
export async function DELETE(
  req: NextRequest,
  { params }: { params: { logId: string } }
) {
  try {
    await prisma.exerciseLog.delete({
      where: { id: Number(params.logId) },
    });

    return NextResponse.json({ message: "Log deleted" });
  } catch (error) {
    console.error("DELETE /api/logs/[logId] error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
