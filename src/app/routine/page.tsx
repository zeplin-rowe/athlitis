"use client";

import { useState } from "react";
import { useRoutines } from "@/context/RoutineContext";
import Link from "next/link";

export default function RoutinePage() {
  const { routines, loading, createRoutine, deleteRoutine } = useRoutines();
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createRoutine({ name });
    setName("");
  };

  if (loading) return <p>Loading routines...</p>;

  return (
    <div>
      <h1>Routines</h1>

      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Routine name"
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <ul>
        {Array.isArray(routines) &&
          routines.map((routine) => (
            <li key={routine.id}>
              <Link href={`/routine/${routine.id}`}>{routine.name}</Link>
              <button onClick={() => deleteRoutine(routine.id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
