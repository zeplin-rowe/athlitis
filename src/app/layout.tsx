import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { RoutineProvider } from "@/context/RoutineContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <RoutineProvider>
            <Navbar />
            {children}
          </RoutineProvider>
        </UserProvider>
      </body>
    </html>
  );
}
