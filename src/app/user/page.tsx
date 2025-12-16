"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  routines?: any[];
  logs?: any[];
}

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, logout, isLoggedIn } = useUser();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [updateUsername, setUpdateUsername] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout();
          }
          const data = await res.json();
          setError(data.error || "Failed to fetch user");
          return;
        }

        const data: User = await res.json();
        setUser(data);
        setUpdateUsername(data.username);
        setUpdateEmail(data.email);
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, userId, router, logout]);

  const handleUpdate = async () => {
    if (!user) return;
    if (!currentPassword) {
      setError("Please enter your current password to update profile.");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: updateUsername,
          email: updateEmail,
          password: updatePassword || undefined,
          currentPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update user");
        return;
      }

      const updatedUser: User = await res.json();
      setUser(updatedUser);
      setUpdatePassword("");
      setCurrentPassword("");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!deletePassword) {
      setError("Please enter your password to delete your account.");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: deletePassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete user");
        return;
      }

      alert("Account deleted successfully");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Page</h1>
      {user && (
        <>
          <p>ID: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

          {/* SETTINGS TOGGLE */}
          <button
            onClick={() => {
              setSettingsOpen(!settingsOpen);
              setError(null);
            }}
          >
            {settingsOpen ? "Close Settings" : "Open Settings"}
          </button>

          {settingsOpen && (
            <div style={{ marginTop: "1rem" }}>
              <h2>Edit Profile</h2>
              <div>
                <label>
                  Username:
                  <input
                    type="text"
                    value={updateUsername}
                    onChange={(e) => setUpdateUsername(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Email:
                  <input
                    type="email"
                    value={updateEmail}
                    onChange={(e) => setUpdateEmail(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  New Password:
                  <input
                    type="password"
                    value={updatePassword}
                    onChange={(e) => setUpdatePassword(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Current Password (required):
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </label>
              </div>
              <button onClick={handleUpdate}>Update Profile</button>

              <hr />

              <h3>Danger Zone</h3>
              <div>
                <label>
                  Password (required to delete account):
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </label>
              </div>
              <button onClick={handleDelete} style={{ color: "red" }}>
                Delete Account
              </button>
            </div>
          )}

          <hr />
          <button onClick={logout}>Sign Out</button>
        </>
      )}
    </div>
  );
}
