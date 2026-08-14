"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children, title }: { children: React.ReactNode, title: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Sidebar role={user.role} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center px-8 border-b border-gray-200/60 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h1>
        </header>
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
