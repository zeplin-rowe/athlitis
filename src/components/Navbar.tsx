"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleClick = (id: string) => {
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
        {/* Home Button */}
        <div className="flex items-center">
          <div className="bg-red-500 text-white p-4">Tailwind Test</div>

          <button
            className="bg-transparent border-0 p-0 text-current text-lg font-bold"
            onClick={() => handleClick("home")}
          >
            Athlitis
          </button>
        </div>

        {/* Right buttons */}
        <div className="flex items-center space-x-4 overflow-x-auto">
          <button
            className="bg-transparent border-0 p-0 text-current"
            onClick={() => handleClick("features")}
          >
            Features
          </button>
          <button
            className="bg-transparent border-0 p-0 text-current"
            onClick={() => handleClick("about")}
          >
            About
          </button>
          <Link href="/exercises" className="px-2 py-1 border rounded">
            Exercises
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/routine" className="px-2 py-1 border rounded">
                Routines
              </Link>
              <button onClick={logout} className="px-2 py-1 border rounded">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="px-2 py-1 border rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
