"use client";

import { useState } from "react";
import ExerciseSearch from "@/components/ExerciseSearch";

interface Exercise {
  id: string;
  name: string;
  bodyPart?: string;
  equipment?: string;
  targetMuscle?: string;
  gifUrl?: string;
  thumbnailUrl?: string;
  description?: string;
}

export default function ExercisePage() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );

  return (
    <div>
      <h1>Exercises</h1>

      {/* Exercise Search Component */}
      <ExerciseSearch onSelect={setSelectedExercise} />

      {/* Selected Exercise Details */}
      {selectedExercise && (
        <div
          style={{
            marginTop: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          <h2>{selectedExercise.name}</h2>
          <p>
            <strong>Body Part:</strong> {selectedExercise.bodyPart || "N/A"}
          </p>
          <p>
            <strong>Equipment:</strong> {selectedExercise.equipment || "N/A"}
          </p>
          <p>
            <strong>Target Muscle:</strong>{" "}
            {selectedExercise.targetMuscle || "N/A"}
          </p>
          {selectedExercise.gifUrl && (
            <img
              src={selectedExercise.gifUrl}
              alt={selectedExercise.name}
              style={{ width: "200px", marginTop: "1rem" }}
            />
          )}
          {selectedExercise.description && (
            <p>{selectedExercise.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
