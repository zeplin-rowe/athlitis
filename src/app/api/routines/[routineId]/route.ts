import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET a specific routine
export async function GET(
  req: NextRequest,
  { params }: { params: { routineId: string } }
) {
  try {
    const routine = await prisma.routine.findUnique({
      where: { id: Number(params.routineId) },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    return NextResponse.json(routine);
  } catch (error) {
    console.error("GET /api/routines/[routineId] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE routine
export async function PATCH(
  req: NextRequest,
  { params }: { params: { routineId: string } }
) {
  try {
    const data = await req.json();

    const routine = await prisma.routine.update({
      where: { id: Number(params.routineId) },
      data,
    });

    return NextResponse.json(routine);
  } catch (error) {
    console.error("PATCH /api/routines/[routineId] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

// DELETE routine
export async function DELETE(
  req: NextRequest,
  { params }: { params: { routineId: string } }
) {
  try {
    await prisma.routine.delete({
      where: { id: Number(params.routineId) },
    });

    return NextResponse.json({ message: "Routine deleted" });
  } catch (error) {
    console.error("DELETE /api/routines/[routineId] error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
