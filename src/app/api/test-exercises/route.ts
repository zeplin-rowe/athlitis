import { autoSeed } from "@/lib/autoSeed";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await autoSeed();
  const exercises = await prisma.exercise.findMany({
    take: 5,
  });
  return new Response(JSON.stringify(exercises, null, 2));
}
