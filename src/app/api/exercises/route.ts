import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );
    const bodyPart = searchParams.get("bodyPart");
    const equipment = searchParams.get("equipment");
    const target = searchParams.get("target");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (bodyPart) where.bodyPart = { contains: bodyPart, mode: "insensitive" };
    if (equipment)
      where.equipment = { contains: equipment, mode: "insensitive" };
    if (target) where.targetMuscle = { contains: target, mode: "insensitive" };
    if (search) where.name = { contains: search, mode: "insensitive" };

    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "asc" },
      }),
      prisma.exercise.count({ where }),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results: exercises,
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
