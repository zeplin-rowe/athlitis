"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { isLoggedIn, setLoggedIn } = useUser();

  // Pages visible to everyone
  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Exercises", href: "/exercises" },
  ];

  // Additional pages shown only to logged-in users
  const userLinks = [
    { name: "Routines", href: "/routine" },
    { name: "User", href: "/user" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedIn(false);
  };

  return (
    <nav>
      {baseLinks.map((link) => (
        <span key={link.href}>
          <Link href={link.href}>{link.name}</Link>
          {" | "}
        </span>
      ))}

      {isLoggedIn ? (
        <>
          {userLinks.map((link) => (
            <span key={link.href}>
              <Link href={link.href}>{link.name}</Link>
              {" | "}
            </span>
          ))}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
