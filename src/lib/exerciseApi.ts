// src/lib/exerciseApi.ts
import axios from "axios";

const API_BASE = "https://exercisedb-api1.p.rapidapi.com/api/v1/exercises";

const headers = {
  "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!, // from your .env
  "X-RapidAPI-Host": "exercisedb-api1.p.rapidapi.com",
};

// Fetch a single exercise by apiId
export async function fetchExercise(apiId: string) {
  const res = await axios.get(`${API_BASE}/${apiId}`, { headers });
  return res.data;
}

// Fetch all exercises from API (for seeding)
export async function fetchAllExercises() {
  const res = await axios.get(API_BASE, { headers });
  const exercises = res.data.data; // <-- this is the array
  return exercises;
}
