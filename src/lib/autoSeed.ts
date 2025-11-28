import { prisma } from "@/lib/prisma";

export async function autoSeed() {
  try {
    const count = await prisma.exercise.count();

    if (count === 0) {
      console.log("Database empty — running auto seed...");
      await fetch("http://localhost:3000/api/seed");
      console.log("Auto seed complete!");
    }
  } catch (err) {
    console.error("Auto seed error:", err);
  }
}
