import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";
import { enumNormalize } from "@/middleware/enumNormalize";

// GET routines for logged-in user only (protected)
async function getUserRoutines(req: NextRequest) {
  try {
    const userId = (req as any).userId;

    const routines = await prisma.routine.findMany({
      where: { userId },
      include: { exercises: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(routines);
  } catch (error) {
    console.error("GET /api/routine error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CREATE routine (protected)
async function createRoutine(req: NextRequest) {
  const userId = (req as any).userId;

  let body = await req.json();

  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    body = enumNormalize(body);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { name, description, difficulty, category, thumbnailUrl } = body;

  const routine = await prisma.routine.create({
    data: {
      name,
      description,
      difficulty,
      category,
      thumbnailUrl,
      userId,
    },
  });

  return NextResponse.json(routine, { status: 201 });
}

// HANDLERS
export async function GET(req: NextRequest) {
  return authMiddleware(req, getUserRoutines);
}

export async function POST(req: NextRequest) {
  return authMiddleware(req, createRoutine);
}
