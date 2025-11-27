// src/app/api/test-api/route.ts
import axios from "axios";

export async function GET() {
  try {
    const res = await axios.get(
      "https://exercisedb-api1.p.rapidapi.com/api/v1/exercises",
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
          "X-RapidAPI-Host": "exercisedb-api1.p.rapidapi.com",
        },
      }
    );

    console.log(res.data);
    return new Response(JSON.stringify(res.data.slice(0, 5))); // just first 5 for testing
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as any).message }), {
      status: 500,
    });
  }
}
