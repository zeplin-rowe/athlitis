"use client";

import { useState } from "react";

type ExerciseEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  initialSets: number | null;
  initialReps: number | null;
  initialWeight: number | null;
  onSave: (values: {
    sets: number | null;
    reps: number | null;
    weight: number | null;
  }) => void;
  onDelete: () => void;
};

export default function ExerciseEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  exerciseName,
  initialSets,
  initialReps,
  initialWeight,
}: ExerciseEditModalProps) {
  const [sets, setSets] = useState(initialSets?.toString() ?? "");
  const [reps, setReps] = useState(initialReps?.toString() ?? "");
  const [weight, setWeight] = useState(initialWeight?.toString() ?? "");

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <h2>{exerciseName}</h2>

        <input
          type="number"
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />

        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />

        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{ width: "100%", marginBottom: "0.75rem" }}
        />

        <button
          onClick={() =>
            onSave({
              sets: sets ? Number(sets) : null,
              reps: reps ? Number(reps) : null,
              weight: weight ? Number(weight) : null,
            })
          }
          style={{ width: "100%", marginBottom: "0.5rem" }}
        >
          Save
        </button>

        <button
          onClick={onDelete}
          style={{ width: "100%", marginBottom: "0.5rem" }}
          className="delete-btn"
        >
          Delete Exercise
        </button>

        <button onClick={onClose} style={{ width: "100%" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
