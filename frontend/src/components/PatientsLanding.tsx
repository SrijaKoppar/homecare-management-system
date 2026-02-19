import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FilePlus, Users } from 'lucide-react';

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
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Patients
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Manage patient registrations and existing records.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          title="New Patient Registration"
          description="Register a new patient with personal, medical, and support details."
          icon={<FilePlus className="h-6 w-6 text-white" />}
          ctaLabel="Register Patient"
          onClick={() => navigate('/patients/new')}
        />

        <ActionCard
          title="View & Manage Patients"
          description="View, edit, and manage existing patient profiles."
          icon={<Users className="h-6 w-6 text-white" />}
          ctaLabel="View Patients"
          onClick={() => navigate('/patients/view')}
        />
      </div>
    </div>
  );
}

export default PatientsLanding;
