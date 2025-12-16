"use client";

type RoutineExerciseCardProps = {
  exercise: {
    id: number;
    sets: number | null;
    reps: number | null;
    weight: number | null;
    exercise: {
      id: number;
      name: string;
    };
  };
  onEdit: () => void;
  onDelete: () => void;
};

export default function RoutineExerciseCard({
  exercise,
  onEdit,
  onDelete,
}: RoutineExerciseCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "0.75rem",
        marginBottom: "0.75rem",
      }}
    >
      <h3 style={{ marginBottom: "0.25rem" }}>{exercise.exercise.name}</h3>

      <p style={{ fontSize: "0.9rem" }}>
        {exercise.sets !== null && `Sets: ${exercise.sets} `}
        {exercise.reps !== null && `Reps: ${exercise.reps} `}
        {exercise.weight !== null && `Weight: ${exercise.weight}`}
      </p>

      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete} style={{ color: "red" }}>
          Delete
        </button>
      </div>
    </div>
  );
}
