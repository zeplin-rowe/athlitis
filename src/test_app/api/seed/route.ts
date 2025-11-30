import { seedDatabaseIfEmpty } from "@/lib/seed";

export async function GET() {
  await seedDatabaseIfEmpty();

  return Response.json({ status: "done" });
}
