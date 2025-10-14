"use client";

import { DiseaseAlerts } from "../components/alerts/disease-alerts";

export default function AlertCenterPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Disease Alerts</h1>
        <p className="text-muted-foreground">
          Stay informed about regional disease outbreaks and biosecurity threats in your area.
        </p>
      </div>
      
      <DiseaseAlerts />
    </div>
  );
}