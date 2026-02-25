import { ArrowLeft, FileText, Target, CheckCircle2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CarePlanDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/people")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-4 transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
          Care Plan · Mary Smith
        </h1>
        <p className="text-slate-500 mt-1">
          Post-hospital recovery – Effective from Feb 1, 2025
        </p>
      </div>

      {/* Plan Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-slate-400" />
            <h2 className="font-semibold text-slate-900">Plan Details</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Type</p>
              <p className="text-sm font-medium text-slate-900">Post-hospital recovery</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status</p>
              <p className="text-sm font-medium text-emerald-600">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-slate-400" />
            <h2 className="font-semibold text-slate-900">Timeline</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Start Date</p>
              <p className="text-sm font-medium text-slate-900">Feb 1, 2025</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Duration</p>
              <p className="text-sm font-medium text-slate-900">4 weeks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-slate-400" />
          <h2 className="font-semibold text-slate-900">Care Goals</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Support mobility</p>
              <p className="text-sm text-slate-500 mt-1">Assist with light exercise and movement to regain strength</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Medication adherence</p>
              <p className="text-sm text-slate-500 mt-1">Ensure medications are taken on schedule as prescribed</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Nutrition monitoring</p>
              <p className="text-sm text-slate-500 mt-1">Monitor diet and meal preparation as recovery progresses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks & Instructions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-900 mb-6">Daily Care Tasks</h2>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-slate-300 flex-shrink-0" />
            <span className="text-sm text-slate-600">Morning hygiene and exercises</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-slate-300 flex-shrink-0" />
            <span className="text-sm text-slate-600">Medication rounds (9 AM, 1 PM, 6 PM)</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-slate-300 flex-shrink-0" />
            <span className="text-sm text-slate-600">Meals and nutrition tracking</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-slate-300 flex-shrink-0" />
            <span className="text-sm text-slate-600">Afternoon rest and monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}
