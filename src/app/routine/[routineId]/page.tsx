"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ExerciseSearch from "@/components/ExerciseSearch";
import RoutineExerciseCard from "@/components/RoutineExerciseCard";
import ExerciseEditModal from "@/components/ExerciseEditModal";

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

  const [editingExercise, setEditingExercise] =
    useState<RoutineExercise | null>(null);

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

  const handleDeleteExercise = async (id: number) => {
    if (!confirm("Remove this exercise from the routine?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/routine/${routineId}/exercises/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      setExercises((prev) => prev.filter((ex) => ex.id !== id));
      setEditingExercise(null);
    } catch {
      alert("Failed to delete exercise");
    }
  };

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Routine Exercises</h1>

      {/* Search (adding flow will be finalized later) */}
      <ExerciseSearch />

      {exercises.length === 0 && <p>No exercises in this routine yet.</p>}

      {exercises.map((item) => (
        <RoutineExerciseCard
          key={item.id}
          exercise={item}
          onEdit={() => setEditingExercise(item)}
          onDelete={() => handleDeleteExercise(item.id)}
        />
      ))}

      {/* Edit Modal */}
      <ExerciseEditModal
        isOpen={!!editingExercise}
        onClose={() => setEditingExercise(null)}
        exerciseName={editingExercise?.exercise.name ?? ""}
        initialSets={editingExercise?.sets ?? null}
        initialReps={editingExercise?.reps ?? null}
        initialWeight={editingExercise?.weight ?? null}
        onSave={async (values) => {
          if (!editingExercise) return;

          try {
            const token = localStorage.getItem("token");

            const res = await fetch(
              `/api/routine/${routineId}/exercises/${editingExercise.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
              }
            );

            if (!res.ok) throw new Error();

            const updated = await res.json();

            setExercises((prev) =>
              prev.map((ex) => (ex.id === updated.id ? updated : ex))
            );

            setEditingExercise(null);
          } catch {
            alert("Failed to update exercise");
          }
        }}
        onDelete={() => {
          if (!editingExercise) return;
          handleDeleteExercise(editingExercise.id);
        }}
      />
    </div>
  );
}
