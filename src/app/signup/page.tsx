"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SignupPage() {
  const router = useRouter();
  const { setLoggedIn } = useUser();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Signup failed");
        return;
      }

      const data = await res.json();
      const token = data?.token;
      const userId = data?.user?.id;

      if (token && userId) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId.toString());

        setLoggedIn(true);
        router.push("/user");
        return;
      } else {
        setError("Signup succeeded but no token or userId returned by API.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  }

  return (
    <div>
      <h1>Signup</h1>

      <form onSubmit={handleSignup}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
