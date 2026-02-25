import { useNavigate } from "react-router-dom";
import { CalendarPlus, Clock, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../components/ui/badge";

interface Visit {
  id: number;
  time: string;
  name: string;
  caregiver: string;
  type: string;
  location: string;
  status: "scheduled" | "in-progress" | "unassigned";
}

export default function Schedule() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  const visits: Visit[] = [
    {
      id: 1,
      time: "10:00 AM - 12:00 PM",
      name: "Mary Smith",
      caregiver: "Jane Doe",
      type: "Personal care",
      location: "123 Oak St",
      status: "scheduled",
    },
    {
      id: 2,
      time: "2:00 PM - 4:00 PM",
      name: "John K",
      caregiver: "Unassigned",
      type: "Companionship",
      location: "456 Elm Ave",
      status: "unassigned",
    },
    {
      id: 3,
      time: "4:00 PM - 6:00 PM",
      name: "Alice Brown",
      caregiver: "Mike Johnson",
      type: "Nursing",
      location: "789 Maple Dr",
      status: "scheduled",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unassigned":
        return "bg-red-100 text-red-700 border-red-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unassigned":
        return <AlertCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
            Schedule
          </h1>
          <p className="text-slate-500 mt-1">
            Manage visits and caregiver assignments.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/schedule/assign24x7")}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-50 font-medium transition-smooth"
          >
            <Clock className="h-4 w-4" />
            Assign 24/7
          </button>

          <button
            onClick={() => navigate("/schedule/new")}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-lg font-medium transition-smooth"
          >
            <CalendarPlus className="h-4 w-4" />
            New Visit
          </button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex gap-2 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        {["day", "week", "month"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as any)}
            className={`px-4 py-2 rounded font-medium text-sm transition-smooth capitalize ${
              viewMode === mode
                ? "bg-orange-100 text-orange-700"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Visits Grid */}
      <div className="space-y-3">
        {visits.map((visit) => (
          <div
            key={visit.id}
            onClick={() => navigate(`/visit/${visit.id}`)}
            className="cursor-pointer bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-slate-300 transition-smooth group"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              {/* Left Section */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <p className="font-semibold text-slate-900">{visit.time}</p>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-smooth">
                  {visit.name}
                </h3>
              </div>

              {/* Status Badge */}
              <Badge className={`border flex items-center gap-1 ${getStatusColor(visit.status)}`}>
                {getStatusIcon(visit.status)}
                {visit.status === "unassigned" ? "Unassigned" : "Assigned"}
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Type</p>
                <p className="text-sm font-medium text-slate-900">{visit.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Caregiver</p>
                <p className={`text-sm font-medium ${
                  visit.caregiver === "Unassigned" ? "text-red-600" : "text-emerald-600"
                }`}>
                  {visit.caregiver}
                </p>
              </div>
              <div className="flex items-end gap-2">
                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <p className="text-sm font-medium text-slate-600">{visit.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
