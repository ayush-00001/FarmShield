"use client";

import { Sidebar } from "./sidebar";
import { Toaster } from "../ui/toaster";

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export function MainLayout({ children, onLogout }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar onLogout={onLogout} />
      
      {/* Main content area */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
