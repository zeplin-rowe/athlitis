import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      page = "1",
      limit = "10",
      bodyPart,
      equipment,
      target,
      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));

    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (bodyPart) {
      where.bodyPart = { contains: String(bodyPart), mode: "insensitive" };
    }

    if (equipment) {
      where.equipment = { contains: String(equipment), mode: "insensitive" };
    }

    if (target) {
      where.targetMuscle = { contains: String(target), mode: "insensitive" };
    }

    if (search) {
      where.name = { contains: String(search), mode: "insensitive" };
    }

    // Fetch data
    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { id: "asc" },
      }),
      prisma.exercise.count({ where }),
    ]);

    return res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      results: exercises,
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
