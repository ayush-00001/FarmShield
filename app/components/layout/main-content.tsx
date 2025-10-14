"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";

type Page = "landing" | "dashboard" | "assessment" | "records" | "alerts" | "login" | "signup";

interface MainContentProps {
  currentPage: Page;
  children: React.ReactNode;
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
}

export function MainContent({ currentPage, children, onNavigate, isAuthenticated }: MainContentProps) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  if (!isAuthenticated) {
    return <div className="min-h-screen">{children}</div>;
  }

  const pageTitles = {
    dashboard: "Dashboard",
    assessment: "Risk Assessment",
    records: "Farm Records",
    alerts: "Disease Alerts"
  };

  const pageTitle = pageTitles[currentPage] || "FarmShield";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileSidebar(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {/* Mobile navigation items would go here */}
          </motion.div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-600 mt-1">
                {currentPage === "dashboard" && "Monitor your farm's biosecurity metrics and trends"}
                {currentPage === "assessment" && "Evaluate your farm's current risk level"}
                {currentPage === "records" && "Track and manage your farm activities"}
                {currentPage === "alerts" && "Stay informed about regional disease outbreaks"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("landing")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>
        </div>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

