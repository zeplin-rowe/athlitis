"use client";

import { useEffect, useState } from "react";
import ExerciseResultCard from "./ExerciseResultCard";
import ExercisePreviewModal from "./ExercisePreviewModal";

export interface Exercise {
  id: string;
  name: string;
  bodyPart?: string;
  equipment?: string;
  targetMuscle?: string;
  gifUrl?: string;
  thumbnailUrl?: string;
  description?: string;
}

interface ExerciseSearchProps {
  onSelect?: (exercise: Exercise) => void;
}

export default function ExerciseSearch({ onSelect }: ExerciseSearchProps) {
  const [name, setName] = useState("");
  const [equipmentOptions, setEquipmentOptions] = useState<string[]>([]);
  const [bodyPartOptions, setBodyPartOptions] = useState<string[]>([]);
  const [muscleOptions, setMuscleOptions] = useState<string[]>([]);

  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");

  const [results, setResults] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedExercises, setAddedExercises] = useState<Exercise[]>([]);

  const [hasSearched, setHasSearched] = useState(false);

  // ✅ NEW: modal state
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  const API_BASE = "/api";

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [equipRes, bodyRes, muscleRes] = await Promise.all([
          fetch("/api/equipments").then((r) => r.json()),
          fetch("/api/bodyparts").then((r) => r.json()),
          fetch("/api/muscles").then((r) => r.json()),
        ]);

        setEquipmentOptions(equipRes);
        setBodyPartOptions(bodyRes);
        setMuscleOptions(muscleRes);
      } catch (err) {
        console.error("Failed to fetch dropdowns:", err);
      }
    }
    fetchOptions();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (name) params.append("search", name);
      if (selectedEquipment) params.append("equipment", selectedEquipment);
      if (selectedBodyPart) params.append("bodyPart", selectedBodyPart);
      if (selectedMuscle) params.append("target", selectedMuscle);

      const res = await fetch(
        `${API_BASE}/exercises/search?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch exercises");

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch exercises");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExercises();
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />

        <select
          value={selectedEquipment}
          onChange={(e) => setSelectedEquipment(e.target.value)}
        >
          <option value="">All Equipments</option>
          {equipmentOptions.map((eq) => (
            <option key={eq} value={eq}>
              {eq}
            </option>
          ))}
        </select>

        <select
          value={selectedBodyPart}
          onChange={(e) => setSelectedBodyPart(e.target.value)}
        >
          <option value="">All Body Parts</option>
          {bodyPartOptions.map((bp) => (
            <option key={bp} value={bp}>
              {bp}
            </option>
          ))}
        </select>

        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value)}
        >
          <option value="">All Muscles</option>
          {muscleOptions.map((muscle) => (
            <option key={muscle} value={muscle}>
              {muscle}
            </option>
          ))}
        </select>

        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && hasSearched && results.length === 0 && (
        <p>No exercises found.</p>
      )}

      {/* ✅ RESULTS AS CARDS */}
      {results.map((exercise) => (
        <ExerciseResultCard
          key={exercise.id}
          exercise={exercise}
          onPreview={() => setPreviewExercise(exercise)}
          onSelect={() => {
            setAddedExercises((prev) => [...prev, exercise]);
            console.log("Added exercise:", exercise);
          }}
        />
      ))}

      {/* ✅ MODAL */}
      <ExercisePreviewModal
        exercise={previewExercise}
        onClose={() => setPreviewExercise(null)}
      />
    </div>
  );
}
