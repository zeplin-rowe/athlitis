"use client";

import { useEffect, useState } from "react";

type Log = {
  id: number;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  performedAt: string;
  exercise: {
    id: number;
    name: string;
  };
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [exerciseId, setExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setLogs(data);
      } catch {
        setError("Failed to load logs");
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  async function handleAddLog(e: React.FormEvent) {
    e.preventDefault();

    if (!exerciseId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exerciseId: Number(exerciseId),
          sets: sets ? Number(sets) : null,
          reps: reps ? Number(reps) : null,
          weight: weight ? Number(weight) : null,
        }),
      });

      if (!res.ok) throw new Error();

      const newLog = await res.json();
      setLogs((prev) => [newLog, ...prev]);

      setExerciseId("");
      setSets("");
      setReps("");
      setWeight("");
    } catch {
      alert("Failed to create log");
    }
  }

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Workout Logs</h1>

      <form onSubmit={handleAddLog}>
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
        <input
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button type="submit">Add Log</button>
      </form>

      {logs.length === 0 && <p>No logs yet.</p>}

      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <strong>{log.exercise?.name ?? "Exercise"}</strong>
            {log.sets !== null && ` | Sets: ${log.sets}`}
            {log.reps !== null && ` | Reps: ${log.reps}`}
            {log.weight !== null && ` | Weight: ${log.weight}`}
            <div>{new Date(log.performedAt).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
