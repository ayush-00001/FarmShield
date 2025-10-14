"use client";

import { motion } from "framer-motion";
import { Button } from "./button";
import { 
  Home, 
  BarChart3, 
  ClipboardList, 
  AlertTriangle, 
  LogOut,
  Menu,
  X,
  Shield,
  TrendingUp,
  Activity,
  Bell
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout, isCollapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      description: "Overview & Analytics"
    },
    {
      id: "assessment",
      label: "Risk Assessment",
      icon: BarChart3,
      description: "Farm Risk Quiz"
    },
    {
      id: "records",
      label: "Farm Records",
      icon: ClipboardList,
      description: "Animal Records"
    },
    {
      id: "alerts",
      label: "Disease Alerts",
      icon: AlertTriangle,
      description: "Health Alerts"
    }
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 border-r border-green-200 dark:border-gray-700 shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-green-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <div className="bg-primary/10 rounded-lg p-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">FarmShield</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Farm Management</p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="hover:bg-green-200/50 dark:hover:bg-gray-700/50"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-12 transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-white shadow-md" 
                    : "hover:bg-green-200/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                } ${isCollapsed ? "px-2" : "px-4"}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && (
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                )}
              </Button>
            </motion.div>
          );
        })}
      </nav>

      {/* Quick Stats */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-t border-green-200 dark:border-gray-700"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</span>
              </div>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                Low
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Alerts</span>
              </div>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                2
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-green-200 dark:border-gray-700 mt-auto">
        <Button
          variant="ghost"
          className={`w-full justify-start h-12 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 ${
            isCollapsed ? "px-2" : "px-4"
          }`}
          onClick={onLogout}
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </motion.div>
  );
}

