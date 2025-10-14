"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertTriangle, MapPin, Calendar, Bell, BellOff, ExternalLink, Filter, Loader2, Brain } from "lucide-react";
import { getCombinedAlerts } from "../../actions/disease-prediction";
import { markAlertAsRead, markAllAlertsAsRead } from "../../actions/alerts";
import { supabase } from "../../lib/supabase-client";

interface DiseaseAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  date: string | Date;
  source: string;
  affectedSpecies: string[];
  recommendations: string[];
  isRead: boolean;
  isPredicted?: boolean;
  confidence?: number;
  basedOnRecords?: number;
}

export function DiseaseAlerts() {
  const [alerts, setAlerts] = useState<DiseaseAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "critical" | "high">("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [readAlerts, setReadAlerts] = useState<Set<string>>(new Set());

  // Get user ID on component mount
  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);
        loadAlerts(user?.id || null);
      } catch (error) {
        console.error('Error getting user:', error);
        loadAlerts(null);
      }
    }
    getUser();
  }, []);

  // Load alerts from localStorage (for predicted alerts read status)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('readPredictedAlerts');
      if (stored) {
        try {
          setReadAlerts(new Set(JSON.parse(stored)));
        } catch (error) {
          console.error('Error loading read alerts from localStorage:', error);
        }
      }
    }
  }, []);

  const loadAlerts = async (userId: string | null) => {
    try {
      setLoading(true);
      const { allAlerts } = await getCombinedAlerts(userId, {
        severity: filter === "all" ? undefined : filter,
        unreadOnly: filter === "unread"
      });

      // Format alerts for display
      const formattedAlerts: DiseaseAlert[] = allAlerts.map(alert => ({
        id: alert.id,
        title: alert.title,
        description: alert.description,
        severity: alert.severity as "low" | "medium" | "high" | "critical",
        location: alert.location,
        date: alert.date || alert.createdAt,
        source: alert.source,
        affectedSpecies: alert.affectedSpecies || [],
        recommendations: alert.recommendations || [],
        isRead: alert.isRead || (alert.isPredicted && readAlerts.has(alert.id)) || false,
        isPredicted: alert.isPredicted || false,
        confidence: (alert as any).confidence,
        basedOnRecords: (alert as any).basedOnRecords
      }));

      setAlerts(formattedAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return "🔴";
      case "high":
        return "🟠";
      case "medium":
        return "🟡";
      case "low":
        return "🔵";
      default:
        return "⚪";
    }
  };

  // Reload alerts when filter changes
  useEffect(() => {
    loadAlerts(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true;
    if (filter === "unread") return !alert.isRead;
    if (filter === "critical") return alert.severity === "critical";
    if (filter === "high") return alert.severity === "high";
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      // Mark as read in server
      await markAlertAsRead(id, userId || undefined);
      
      // If it's a predicted alert, also mark in localStorage
      if (id.startsWith('predicted-')) {
        const newReadAlerts = new Set(readAlerts);
        newReadAlerts.add(id);
        setReadAlerts(newReadAlerts);
        if (typeof window !== 'undefined') {
          localStorage.setItem('readPredictedAlerts', JSON.stringify(Array.from(newReadAlerts)));
        }
      }
      
      // Update local state
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, isRead: true } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all as read in server
      await markAllAlertsAsRead(userId || undefined);
      
      // Mark all predicted alerts as read in localStorage
      const newReadAlerts = new Set(readAlerts);
      alerts.forEach(alert => {
        if (alert.isPredicted && !alert.isRead) {
          newReadAlerts.add(alert.id);
        }
      });
      setReadAlerts(newReadAlerts);
      if (typeof window !== 'undefined') {
        localStorage.setItem('readPredictedAlerts', JSON.stringify(Array.from(newReadAlerts)));
      }
      
      // Update local state
      setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const predictedCount = alerts.filter(alert => alert.isPredicted && !alert.isRead).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-6 w-6 text-primary" />
                  <span>Disease Alerts</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount} New
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  AI-powered disease predictions based on your farm records and regional alerts
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleMarkAllAsRead} disabled={loading}>
                  <BellOff className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => loadAlerts(userId)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <div className="flex space-x-2">
                {[
                  { key: "all", label: "All Alerts" },
                  { key: "unread", label: "Unread" },
                  { key: "critical", label: "Critical" },
                  { key: "high", label: "High Priority" }
                ].map((filterOption) => (
                  <Button
                    key={filterOption.key}
                    variant={filter === filterOption.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterOption.key as any)}
                  >
                    {filterOption.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Analyzing farm records and loading alerts...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      {!loading && (
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`${!alert.isRead ? 'border-l-4 border-l-primary' : ''} ${alert.isPredicted ? 'border-l-4 border-l-blue-500' : ''} hover:shadow-md transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3 flex-wrap">
                        <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                        <h3 className="text-lg font-semibold">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.isPredicted && (
                          <Badge variant="outline" className="border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Predicted
                            {alert.confidence && (
                              <span className="ml-1">({alert.confidence}%)</span>
                            )}
                          </Badge>
                        )}
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{alert.description}</p>
                      
                      {alert.isPredicted && (alert.confidence || alert.basedOnRecords) && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center space-x-4 text-sm">
                            {alert.confidence && (
                              <div>
                                <span className="text-muted-foreground">Confidence: </span>
                                <span className="font-medium text-blue-700">{alert.confidence}%</span>
                              </div>
                            )}
                            {alert.basedOnRecords && (
                              <div>
                                <span className="text-muted-foreground">Based on: </span>
                                <span className="font-medium">{alert.basedOnRecords} record(s)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(alert.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Source:</span>
                          <span>{alert.source}</span>
                        </div>
                      </div>

                    <div className="mb-4">
                      <span className="text-sm font-medium text-muted-foreground">Affected Species: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {alert.affectedSpecies.map((species, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {species}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        <span>Recommendations</span>
                      </h4>
                      <ul className="space-y-1">
                        {alert.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm flex items-start space-x-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {!alert.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        <BellOff className="h-4 w-4 mr-2" />
                        Mark Read
                      </Button>
                    )}
                    {alert.isPredicted && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = '/FarmRecords'}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Records
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </div>
      )}

      {filteredAlerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No alerts found
          </h3>
          <p className="text-muted-foreground">
            {filter === "all" 
              ? "No disease alerts available at the moment."
              : `No ${filter} alerts found.`
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}
