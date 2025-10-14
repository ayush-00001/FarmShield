"use client";

import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Shield,
  BarChart3,
  AlertTriangle,
  ClipboardList,
  TrendingUp,
  Activity,
  Bell,
} from "lucide-react";
import { RiskTrendChart } from "../components/charts/risk-trend-chart";
import { RiskDistributionChart } from "../components/charts/risk-distribution-chart";
import { ActivityChart } from "../components/charts/activity-chart";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Quick Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Risk Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Low</div>
            <p className="text-xs text-muted-foreground">Last updated 2 hours ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities This Week</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <p className="text-xs text-muted-foreground">Regional notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <p className="text-xs text-muted-foreground">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Trend</CardTitle>
            <CardDescription>Your farm's risk level over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskTrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest farm management activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { activity: "Cleaning & Disinfection", time: "2 hours ago", status: "completed" },
                { activity: "Vaccination - Batch A", time: "1 day ago", status: "completed" },
                { activity: "Feed Quality Check", time: "2 days ago", status: "completed" },
                { activity: "Equipment Maintenance", time: "3 days ago", status: "pending" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.activity}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Overview of risk levels across all farms</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Activities</CardTitle>
            <CardDescription>Activity breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              asChild
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
            >
              <Link href="/RiskAssesment">
                <ClipboardList className="h-6 w-6 mb-2" />
                Take Risk Assessment
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
            >
              <Link href="/FarmRecords">
                <Activity className="h-6 w-6 mb-2" />
                Log Activity
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
            >
              <Link href="/AlertCenter">
                <Bell className="h-6 w-6 mb-2" />
                View Alerts
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}