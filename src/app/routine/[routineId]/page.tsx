"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

type RoutineExercise = {
  id: number;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  exercise: {
    id: number;
    name: string;
  };
};

export default function RoutineDetailPage() {
  const { routineId } = useParams<{ routineId: string }>();

  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [modalSets, setModalSets] = useState("");
  const [modalReps, setModalReps] = useState("");
  const [modalWeight, setModalWeight] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch routine exercises
  useEffect(() => {
    if (!routineId) return;

    async function fetchExercises() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/routine/${routineId}/exercises`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();
        const data = await res.json();
        setExercises(data);
      } catch {
        setError("Could not load exercises");
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [routineId]);

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  // Add exercise to routine
  const handleAddExercise = async () => {
    if (!selectedExercise) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/routine/${routineId}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exerciseId: Number(selectedExercise.id),
          sets: modalSets ? Number(modalSets) : null,
          reps: modalReps ? Number(modalReps) : null,
          weight: modalWeight ? Number(modalWeight) : null,
        }),
      });

      if (!res.ok) throw new Error();
      const newExercise = await res.json();

      setExercises((prev) => [...prev, newExercise]);
      setIsModalOpen(false);
      setSelectedExercise(null);
      setModalSets("");
      setModalReps("");
      setModalWeight("");
    } catch {
      alert("Failed to add exercise");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Routine Exercises</h1>

      {/* === Exercise Search === */}
      <ExerciseSearch
        onSelect={(exercise) => {
          setSelectedExercise(exercise);
          setModalSets("");
          setModalReps("");
          setModalWeight("");
          setIsModalOpen(true);
        }}
      />

      {/* === Exercises List === */}
      {exercises.length === 0 && <p>No exercises yet.</p>}
      <ul>
        {exercises.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.5rem" }}>
            {item.exercise?.name ?? "Exercise"} —
            {item.sets !== null && ` Sets: ${item.sets}`}
            {item.reps !== null && ` Reps: ${item.reps}`}
            {item.weight !== null && ` Weight: ${item.weight}`}
          </li>
        ))}
      </ul>

      {/* === Modal === */}
      {isModalOpen && selectedExercise && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2>{selectedExercise.name}</h2>
            {selectedExercise.gifUrl && (
              <img
                src={selectedExercise.gifUrl}
                alt={selectedExercise.name}
                width={200}
                style={{ display: "block", marginBottom: "0.5rem" }}
              />
            )}
            {selectedExercise.description && (
              <p style={{ marginBottom: "0.5rem" }}>
                {selectedExercise.description}
              </p>
            )}

            <input
              placeholder="Sets"
              type="number"
              value={modalSets}
              onChange={(e) => setModalSets(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <input
              placeholder="Reps"
              type="number"
              value={modalReps}
              onChange={(e) => setModalReps(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <input
              placeholder="Weight"
              type="number"
              value={modalWeight}
              onChange={(e) => setModalWeight(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />

            <button
              onClick={handleAddExercise}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                background: "green",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add to Routine
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                width: "100%",
                padding: "0.5rem",
                background: "#ccc",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
