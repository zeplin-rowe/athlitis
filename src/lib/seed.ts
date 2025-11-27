import { prisma } from "./prisma";
import { fetchAllExercises } from "./exerciseApi";

export async function seedDatabaseIfEmpty() {
  console.log("Checking if database needs seeding...");

  const count = await prisma.exercise.count();

  if (count > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  console.log("Database empty — seeding now...");

  const exercises = await fetchAllExercises();

  if (!exercises || exercises.length === 0) {
    console.error("❌ No exercises fetched — seeding aborted.");
    return;
  }

  const batchSize = 50;

  for (let i = 0; i < exercises.length; i += batchSize) {
    const batch = exercises.slice(i, i + batchSize);

    await prisma.exercise.createMany({
      data: batch.map((ex: any) => ({
        apiId: ex.id,
        name: ex.name,
        bodyPart: ex.bodyPart,
        equipment: ex.equipment,
        targetMuscle: ex.target,
        gifUrl: ex.gifUrl,
      })),
      skipDuplicates: true,
    });

    console.log(`Inserted ${i + batch.length}/${exercises.length}`);
  }

  console.log("🎉 Database seeding complete!");
}
