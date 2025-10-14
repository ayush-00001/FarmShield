"use client";

import { MainLayout } from "../components/layout/main-layout";
import { useRouter } from "next/navigation";
import { useToast } from "../hooks/use-toast";

export default function AlertCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    router.push("/");
  };

  return (
    <MainLayout onLogout={handleLogout}>
      <div className="p-6">
        {children}
      </div>
    </MainLayout>
  );
}


