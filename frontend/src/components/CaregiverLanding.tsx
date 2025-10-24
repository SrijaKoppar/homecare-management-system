import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { UserPlus, ClipboardList } from 'lucide-react';

export function CaregiverLanding() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50/20 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10">
      <div className="max-w-5xl w-full grid gap-8 sm:grid-cols-2">
        {/* New Caregiver Registration */}
        <Card className="p-8 flex flex-col items-center text-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
              New Caregiver Registration
            </CardTitle>
            <CardContent className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Register a new caregiver with personal details, skills, and availability.</p>
            </CardContent>
          </div>
          <Button
            onClick={() => navigate('/caregivers/new')}
            className="mt-6 w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Register Caregiver
          </Button>
        </Card>

        {/* View / Modify Caregivers */}
        <Card className="p-8 flex flex-col items-center text-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <ClipboardList className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
              View & Manage Caregivers
            </CardTitle>
            <CardContent className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>View caregiver profiles, modify details, or manage assigned patients.</p>
            </CardContent>
          </div>
          <Button
            onClick={() => navigate('/caregivers/view')}
            className="mt-6 w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Manage Caregivers
          </Button>
        </Card>
      </div>
    </div>
  );
}
