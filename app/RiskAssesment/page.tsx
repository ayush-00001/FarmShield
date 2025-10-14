"use client";

import { RiskAssessmentForm } from "../components/forms/risk-assessment-form";

export default function RiskAssessmentPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Risk Assessment</h1>
        <p className="text-muted-foreground">
          Evaluate your farm's current biosecurity measures and identify areas for improvement.
        </p>
      </div>
      
      <RiskAssessmentForm />
    </div>
  );
}