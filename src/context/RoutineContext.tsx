"use client";

import { useUser } from "@/context/UserContext";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface Routine {
  id: number;
  name: string;
  description?: string | null;
  difficulty?: string | null;
  category?: string | null;
  thumbnailUrl?: string | null;
}

interface RoutineContextType {
  routines: Routine[];
  loading: boolean;
  fetchRoutines: () => Promise<void>;
  createRoutine: (data: Partial<Routine>) => Promise<void>;
  deleteRoutine: (id: number) => Promise<void>;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export function RoutineProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useUser();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutines = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setRoutines([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/routine", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch routines");
      }

      const data = await res.json();

      setRoutines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch routines", err);
      setRoutines([]);
    } finally {
      setLoading(false);
    }
  };

  const createRoutine = async (data: Partial<Routine>) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!token) return;

      if (!res.ok) throw new Error("Failed to create routine");

      const newRoutine = await res.json();
      setRoutines((prev) => [...prev, newRoutine]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRoutine = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/routine/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!token) return;

      if (!res.ok) throw new Error("Failed to delete routine");

      setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setRoutines([]);
      setLoading(false);
      return;
    }

    fetchRoutines();
  }, [isLoggedIn]);

  return (
    <RoutineContext.Provider
      value={{ routines, loading, fetchRoutines, createRoutine, deleteRoutine }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutines() {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error("useRoutines must be used within RoutineProvider");
  }
  return context;
}
