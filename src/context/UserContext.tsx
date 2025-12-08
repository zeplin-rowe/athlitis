"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface UserContextType {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

const UserContext = createContext<UserContextType>({
  isLoggedIn: false,
  setLoggedIn: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
