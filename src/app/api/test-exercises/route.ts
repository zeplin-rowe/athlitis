// src/app/api/test-exercises/route.ts
import { prisma } from "@/lib/prisma";

export async function GET() {
  const exercises = await prisma.exercise.findMany({
    take: 5, // first 5 exercises
  });
  return new Response(JSON.stringify(exercises, null, 2));
}
