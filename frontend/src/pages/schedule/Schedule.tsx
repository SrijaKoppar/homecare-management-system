import { useNavigate } from "react-router-dom";
import { CalendarPlus, Clock } from "lucide-react";

export default function Schedule() {
  const navigate = useNavigate();

  const visits = [
    {
      id: 1,
      time: "10:00 AM - 12:00 PM",
      name: "Mary Smith",
      caregiver: "Jane Doe",
    },
    {
      id: 2,
      time: "2:00 PM - 4:00 PM",
      name: "John K",
      caregiver: "Unassigned",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Schedule
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage visits and caregiver assignments.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/schedule/assign24x7")}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
          >
            <Clock className="h-4 w-4" />
            Assign 24/7
          </button>

          <button
            onClick={() => navigate("/schedule/new")}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            <CalendarPlus className="h-4 w-4" />
            New Visit
          </button>
        </div>
      </div>

      {/* Visit List */}
      <div className="space-y-3">
        {visits.map((visit) => (
          <div
            key={visit.id}
            onClick={() => navigate(`/visit/${visit.id}`)}
            className="cursor-pointer border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-xl hover:shadow-md transition"
          >
            <p className="font-medium text-slate-900 dark:text-white">
              {visit.time}
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Patient: {visit.name}
            </p>

            <p
              className={`text-sm ${
                visit.caregiver === "Unassigned"
                  ? "text-rose-500"
                  : "text-emerald-600"
              }`}
            >
              Caregiver: {visit.caregiver}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}