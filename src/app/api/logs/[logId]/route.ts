import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
