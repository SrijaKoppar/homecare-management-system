import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FilePlus, Users } from 'lucide-react';

export function PatientsLanding() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50/20 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10">
      <div className="max-w-5xl w-full grid gap-8 sm:grid-cols-2">
        {/* New Patient Registration */}
        <Card className="p-8 flex flex-col items-center text-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
              <FilePlus className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
              New Patient Registration
            </CardTitle>
            <CardContent className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Register a new patient with complete personal, medical, and support details.</p>
            </CardContent>
          </div>
          <Button
            onClick={() => navigate('/patients/new')}
            className="mt-6 w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Go to Registration
          </Button>
        </Card>

        {/* View / Modify Patients */}
        <Card className="p-8 flex flex-col items-center text-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/30">
              <Users className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
              View & Modify Patients
            </CardTitle>
            <CardContent className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Access existing patients, update their details, or review assigned caregivers.</p>
            </CardContent>
          </div>
          <Button
            onClick={() => navigate('/patients/view')}
            className="mt-6 w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            View Patients
          </Button>
        </Card>
      </div>
    </div>
  );
}
