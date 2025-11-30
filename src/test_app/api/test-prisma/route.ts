import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany();
    return Response.json({ ok: true, exercises });
  } catch (error) {
    console.error("Prisma error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
