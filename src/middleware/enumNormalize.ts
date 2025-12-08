export function enumNormalizeValue(
  value: any,
  type: "difficulty" | "category"
): string {
  if (!value) return "";

  if (typeof value !== "string") {
    throw new Error(`${type} must be a string`);
  }

  const lower = value.toLowerCase();

  if (type === "difficulty") {
    const allowed = ["beginner", "intermediate", "advanced"];
    if (!allowed.includes(lower))
      throw new Error(`Invalid difficulty: ${value}`);
    return lower;
  }

  if (type === "category") {
    const allowed = [
      "strength",
      "cardio",
      "mobility",
      "balance",
      "stretching",
      "plyometrics",
      "rehabilitation",
      "other",
    ];
    if (!allowed.includes(lower)) throw new Error(`Invalid category: ${value}`);
    return lower;
  }

  throw new Error(`Unknown enum type: ${type}`);
}

export function enumNormalize(body: any) {
  const normalized = { ...body };

  if (!normalized.difficulty) normalized.difficulty = "beginner";
  if (!normalized.category) normalized.category = "other";

  normalized.difficulty = enumNormalizeValue(
    normalized.difficulty,
    "difficulty"
  );
  normalized.category = enumNormalizeValue(normalized.category, "category");

  return normalized;
}
