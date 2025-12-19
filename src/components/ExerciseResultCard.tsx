"use client";

import type { Exercise } from "./ExerciseSearch";

type Props = {
  exercise: Exercise;
  onPreview: () => void;
  onSelect: () => void;
};

export default function ExerciseResultCard({
  exercise,
  onPreview,
  onSelect,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "0.75rem",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <strong>{exercise.name}</strong>
        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          {exercise.bodyPart} · {exercise.equipment}
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={onPreview}>View</button>
        <button onClick={onSelect}>Add</button>
      </div>
    </div>
  );
}
