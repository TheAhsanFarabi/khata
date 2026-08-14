"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Teacher" | "Student";
  classId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    // Simple route guarding
    if (!user && pathname !== "/login") {
      router.push("/login");
    } else if (user) {
      if (pathname === "/login" || pathname === "/") {
        if (user.role === "Admin") router.push("/admin");
        else if (user.role === "Teacher") router.push("/teacher");
        else router.push("/student");
      } else {
        // Enforce role-based access
        if (pathname.startsWith("/admin") && user.role !== "Admin") router.push("/");
        if (pathname.startsWith("/teacher") && user.role !== "Teacher") router.push("/");
        if (pathname.startsWith("/student") && user.role !== "Student") router.push("/");
      }
    }
  }, [user, pathname, isInitialized, router]);

  const login = (newUser: User, newToken: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  if (!isInitialized) return null; // Avoid hydration mismatch

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
