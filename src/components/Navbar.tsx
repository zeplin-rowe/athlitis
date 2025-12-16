"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useUser();

  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Exercises", href: "/exercises" },
  ];

  const userLinks = [
    { name: "Routines", href: "/routine" },
    { name: "User", href: "/user" },
  ];

  return (
    <nav>
      {baseLinks.map((link) => (
        <span key={link.href}>
          <Link href={link.href}>{link.name}</Link> |{" "}
        </span>
      ))}

      {isLoggedIn ? (
        <>
          {userLinks.map((link) => (
            <span key={link.href}>
              <Link href={link.href}>{link.name}</Link> |{" "}
            </span>
          ))}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
