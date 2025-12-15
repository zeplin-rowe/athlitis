"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type RoutineExercise = {
  id: number;
  sets: number | null;
  reps: number | null;
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

  const [exerciseId, setExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  useEffect(() => {
    if (!routineId) return;

    async function fetchExercises() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/routine/${routineId}/exercises`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  async function handleAddExercise(e: React.FormEvent) {
    e.preventDefault();

    if (!exerciseId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/routine/${routineId}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exerciseId: Number(exerciseId),
          sets: sets ? Number(sets) : null,
          reps: reps ? Number(reps) : null,
        }),
      });

      if (!res.ok) throw new Error();

      const newExercise = await res.json();
      setExercises((prev) => [...prev, newExercise]);

      setExerciseId("");
      setSets("");
      setReps("");
    } catch {
      alert("Failed to add exercise");
    }
  }

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Routine Exercises</h1>

      <form onSubmit={handleAddExercise}>
        <input
          placeholder="Exercise ID"
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
        />
        <input
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />
        <input
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <button type="submit">Add Exercise</button>
      </form>

      {exercises.length === 0 && <p>No exercises yet.</p>}

      <ul>
        {exercises.map((item) => (
          <li key={item.id}>
            {item.exercise?.name ?? "Exercise"} —
            {item.sets && ` Sets: ${item.sets}`}
            {item.reps && ` Reps: ${item.reps}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
