"use client";

import { useEffect } from "react";
import type { Exercise } from "./ExerciseSearch";

type Props = {
  exercise: Exercise | null;
  onClose: () => void;
};

export default function ExercisePreviewModal({ exercise, onClose }: Props) {
  // ✅ ESC key handling
  useEffect(() => {
    if (!exercise) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [exercise, onClose]);

  // ✅ Lock background scroll
  useEffect(() => {
    if (!exercise) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [exercise]);

  // ✅ Safe early return AFTER hooks
  if (!exercise) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <h3>{exercise.name}</h3>

        {exercise.gifUrl && (
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
        )}

        <p>
          <strong>Body Part:</strong> {exercise.bodyPart}
        </p>
        <p>
          <strong>Target:</strong> {exercise.targetMuscle}
        </p>
        <p>
          <strong>Equipment:</strong> {exercise.equipment}
        </p>

        {exercise.description && <p>{exercise.description}</p>}

        <button onClick={onClose} style={{ marginTop: "0.5rem" }}>
          Close
        </button>
      </div>
    </div>
  );
}
