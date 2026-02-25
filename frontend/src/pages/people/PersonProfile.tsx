import { ArrowLeft, Edit, Calendar, Heart, FileText, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/badge";

interface CarePerson {
  name: string;
  role: string;
  badge?: string;
  actions?: string[];
}

export default function PersonProfile() {
  const navigate = useNavigate();

  const careCircle: CarePerson[] = [
    { name: "John Smith", role: "Primary contact", actions: ["Edit", "Remove"] },
    { name: "Jane Doe", role: "Aide · 24/7", badge: "24/7", actions: ["Edit", "Remove"] },
  ];

  return (
    <div className="space-y-6">

      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/people")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-smooth">
          <Edit className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
            👤
          </div>

          {/* Profile Info */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
              Mary Smith
            </h1>
            <p className="text-slate-500 mt-1">Care Recipient</p>
          </div>
        </div>

        {/* Care Arrangement Section */}
        <div className="grid md:grid-cols-2 gap-8 pb-8 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
              Care Arrangement
            </h3>
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg font-semibold text-slate-900">Visits Only</p>
              <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex-shrink-0">
                Change
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-3">From: Feb 1, 2025</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
              24/7 Caregiver
            </h3>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">Jane Doe</p>
                <p className="text-sm text-slate-500 mt-1">(Current)</p>
              </div>
              <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex-shrink-0">
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Care Circle */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Care Circle
          </h2>
          <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>

        <div className="space-y-4">
          {careCircle.map((person, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-smooth">
              <div>
                <p className="font-semibold text-slate-900">{person.name}</p>
                <p className="text-sm text-slate-500">{person.role}</p>
              </div>
              <div className="flex items-center gap-3">
                {person.badge && (
                  <Badge className="bg-purple-100 text-purple-700 border-0">
                    {person.badge}
                  </Badge>
                )}
                <button className="text-slate-400 hover:text-slate-600 transition-smooth">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-slate-400 hover:text-red-600 transition-smooth">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Care Plan & Next Visit */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Care Plan */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-400" />
              <h3 className="font-semibold text-slate-900">Care Plan</h3>
            </div>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              Edit
            </button>
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-2">Post-hospital recovery</p>
          <p className="text-sm text-slate-500">Effective from Feb 1, 2025 · Status: Active</p>
          <button className="mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm">
            View Full Plan →
          </button>
        </div>

        {/* Next Visit */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-400" />
              <h3 className="font-semibold text-slate-900">Next Visit</h3>
            </div>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              Schedule
            </button>
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-2">Wed Feb 5, 10:00 AM</p>
          <p className="text-sm text-slate-500">Personal care · Jane Doe</p>
        </div>
      </div>
    </div>
  );
}
