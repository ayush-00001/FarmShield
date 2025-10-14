"use client";

import { FarmRecordsForm } from "../components/forms/farm-records-form";

export default function FarmRecordsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Farm Records</h1>
        <p className="text-muted-foreground">
          Track and manage your farm activities, compliance records, and daily operations.
        </p>
      </div>
      
      <FarmRecordsForm />
    </div>
  );
}