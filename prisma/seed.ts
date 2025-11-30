import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const BODY_PARTS = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeDifficulty(d: unknown): any {
  if (!d) return null;
  const val = String(d).toLowerCase().trim();
  if (["beginner", "intermediate", "advanced"].includes(val)) return val;
  return null;
}

function normalizeCategory(c: unknown): any {
  if (!c) return null;
  const clean = String(c).trim().toLowerCase();
  if (
    [
      "strength",
      "cardio",
      "mobility",
      "balance",
      "stretching",
      "plyometrics",
      "rehabilitation",
      "other",
    ].includes(clean)
  ) {
    return clean;
  }
  return null;
}

async function fetchExercisesByBodyPart(bodyPart: string, retries = 0) {
  try {
    const API_URL = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(
      bodyPart
    )}`;

    const API_HEADERS = {
      "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
    };

    const resp = await fetch(API_URL, { headers: API_HEADERS });

    if (!resp.ok)
      throw new Error(`Failed to fetch ${bodyPart}: ${resp.status}`);

    const data = await resp.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response format");
    return data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(
        `Fetch failed for ${bodyPart} (attempt ${
          retries + 1
        }), retrying in ${RETRY_DELAY_MS}ms...`,
        error
      );
      await sleep(RETRY_DELAY_MS);
      return fetchExercisesByBodyPart(bodyPart, retries + 1);
    } else {
      throw error;
    }
  }
}

async function seed() {
  console.log("Starting seed...");
  let totalInserted = 0;
  let totalFailed = 0;
  const seenApiIds = new Set<string>();

  for (const part of BODY_PARTS) {
    console.log(`Fetching exercises for bodyPart: ${part}...`);
    const exercises = await fetchExercisesByBodyPart(part);
    console.log(`Fetched ${exercises.length} exercises for ${part}`);

    for (const ex of exercises) {
      if (seenApiIds.has(ex.id)) continue;
      seenApiIds.add(ex.id);

      const createData = {
        apiId: ex.id,
        name: ex.name,
        bodyPart: ex.bodyPart ?? null,
        equipment: ex.equipment ?? null,
        targetMuscle: ex.target ?? null,
        gifUrl: ex.gifUrl ?? null,
        thumbnailUrl: ex.thumbnailUrl ?? ex.gifUrl ?? null,
        description: ex.description ?? null,
        instructions: Array.isArray(ex.instructions) ? ex.instructions : [],
        secondaryMuscles: Array.isArray(ex.secondaryMuscles)
          ? ex.secondaryMuscles
          : [],
        difficulty: normalizeDifficulty(ex.difficulty),
        category: normalizeCategory(ex.category),
        images: Array.isArray(ex.images) ? ex.images : [],
      };

      try {
        await prisma.exercise.upsert({
          where: { apiId: ex.id },
          update: createData,
          create: createData,
        });
        totalInserted++;
      } catch (err) {
        console.error(`Failed to upsert ${ex.name} (${ex.id})`, err);
        totalFailed++;
      }
    }
  }

  console.log(
    `Seed complete! Inserted/updated: ${totalInserted}, Failed: ${totalFailed}`
  );
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
