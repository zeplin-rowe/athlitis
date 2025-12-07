import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Unwrap params safely
async function getIdFromParams(context: {
  params: Promise<{ routineId: string }>;
}) {
  const { routineId } = await context.params;
  const id = Number(routineId);
  if (isNaN(id)) return null;
  return id;
}

// GET a routine
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  try {
    const id = await getIdFromParams(context);
    if (!id)
      return NextResponse.json(
        { error: "Invalid routine ID" },
        { status: 400 }
      );

    const routine = await prisma.routine.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
        user: true,
      },
    });

    if (!routine)
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });

    return NextResponse.json(routine);
  } catch (err: any) {
    console.error("GET routine error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

// UPDATE a routine
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  try {
    const id = await getIdFromParams(context);
    if (!id)
      return NextResponse.json(
        { error: "Invalid routine ID" },
        { status: 400 }
      );

    const body = await req.json();

    const { name, description, difficulty, category, thumbnailUrl } = body;

    const updated = await prisma.routine.update({
      where: { id },
      data: {
        name,
        description,
        difficulty,
        category,
        thumbnailUrl,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("PUT routine error:", err);

    if (err.code === "P2025")
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });

    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

// DELETE a routine
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ routineId: string }> }
) {
  try {
    const id = await getIdFromParams(context);
    if (!id)
      return NextResponse.json(
        { error: "Invalid routine ID" },
        { status: 400 }
      );

    await prisma.routine.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Routine deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE routine error:", err);

    if (err.code === "P2025")
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });

    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
