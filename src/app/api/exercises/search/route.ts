import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("search");
  const equipment = searchParams.get("equipment");
  const bodyPart = searchParams.get("bodyPart");
  const target = searchParams.get("target");

  const where: any = {};

  if (name) where.name = { contains: name, mode: "insensitive" };
  if (equipment) where.equipment = { contains: equipment, mode: "insensitive" };
  if (bodyPart) where.bodyPart = { contains: bodyPart, mode: "insensitive" };
  if (target) where.targetMuscle = { contains: target, mode: "insensitive" };

  try {
    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: "asc" },
      take: 50,
    });

    return NextResponse.json({ results: exercises });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
