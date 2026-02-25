import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  FilePlus,
  Users,
  Calendar,
  FileText,
} from "lucide-react";

function ActionCard({
  title,
  description,
  icon,
  ctaLabel,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaLabel: string;
  onClick: () => void;
}) {
  return (
    <Card className="p-8 flex flex-col items-center text-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-emerald-500 rounded-xl">
          {icon}
        </div>

        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
          {title}
        </CardTitle>

        <CardContent className="text-slate-600 dark:text-slate-400 text-sm">
          {description}
        </CardContent>
      </div>

      <Button
        onClick={onClick}
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {ctaLabel}
      </Button>
    </Card>
  );
}

export function PatientsLanding() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Patient Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Manage patient registrations, care plans, schedules, and assignments.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">

        {/* Register */}
        <ActionCard
          title="New Patient Registration"
          description="Register a new patient with personal, medical, and support details."
          icon={<FilePlus className="h-6 w-6 text-white" />}
          ctaLabel="Register Patient"
          onClick={() => navigate("/patients/new")}
        />

        {/* View */}
        <ActionCard
          title="View & Manage Patients"
          description="View, edit, and manage existing patient profiles."
          icon={<Users className="h-6 w-6 text-white" />}
          ctaLabel="View Patients"
          onClick={() => navigate("/patients/view")}
        />

        {/* Schedule */}
        <ActionCard
          title="Patient Schedules"
          description="View and manage visit schedules and assignments."
          icon={<Calendar className="h-6 w-6 text-white" />}
          ctaLabel="View Schedule"
          onClick={() => navigate("/schedule")}
        />

        {/* Care Plan */}
        <ActionCard
          title="Care Plans"
          description="View and manage patient care plans and tasks."
          icon={<FileText className="h-6 w-6 text-white" />}
          ctaLabel="Open Care Plans"
          onClick={() => navigate("/careplan")}
        />
      </div>
    </div>
  );
}
