import { useNavigate } from "react-router-dom";
import { CalendarPlus, Clock, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { listVisits, Visit as ApiVisit } from "../../lib/visitsApi";
import { listPersons, Person } from "../../lib/personsApi";
import { listAssignments24x7, type Assignment24x7 } from "../../lib/assignments24x7Api";
import { format } from "date-fns";

export default function Schedule() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  
  const [visits, setVisits] = useState<ApiVisit[]>([]);
  const [assignments, setAssignments] = useState<Assignment24x7[]>([]);
  const [persons, setPersons] = useState<Record<string, Person>>({});
  const [recipientFilter, setRecipientFilter] = useState("");
  const [caregiverFilter, setCaregiverFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [visitsData, personsData, assignmentData] = await Promise.all([
          listVisits(),
          listPersons(),
          listAssignments24x7()
        ]);
        
        const personMap: Record<string, Person> = {};
        personsData.forEach(p => {
          personMap[p.id] = p;
        });
        
        setPersons(personMap);
        setVisits(visitsData);
        setAssignments(assignmentData.filter((assignment) => assignment.status === "active"));
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unassigned":
        return "bg-red-100 text-red-700 border-red-200";
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unassigned":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
    } catch {
      return "Invalid time";
    }
  };

  const formatVisitType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const isInSelectedRange = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    if (viewMode === "day") {
      return date.toDateString() === now.toDateString();
    }
    if (viewMode === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return date >= start && date < end;
    }
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  const filteredVisits = visits.filter((visit) => {
    return (
      isInSelectedRange(visit.scheduled_start) &&
      (!recipientFilter || visit.care_recipient_id === recipientFilter) &&
      (!caregiverFilter || visit.assigned_caregiver_id === caregiverFilter)
    );
  });

  const filteredAssignments = assignments.filter((assignment) => {
    const start = new Date(`${assignment.start_date}T00:00:00`);
    const end = assignment.end_date ? new Date(`${assignment.end_date}T23:59:59`) : new Date();
    const rangeMatch = viewMode === "day"
      ? start <= new Date() && end >= new Date()
      : isInSelectedRange(`${assignment.start_date}T00:00:00`) || !assignment.end_date;
    return (
      rangeMatch &&
      (!recipientFilter || assignment.care_recipient_id === recipientFilter) &&
      (!caregiverFilter || assignment.caregiver_id === caregiverFilter)
    );
  });

  const recipients = Object.values(persons).filter((person) => person.role === "care_recipient");
  const caregivers = Object.values(persons).filter((person) => person.role === "caregiver");

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

      <div className="flex flex-col md:flex-row gap-3">
        <select
          value={recipientFilter}
          onChange={(e) => setRecipientFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900"
        >
          <option value="">All recipients</option>
          {recipients.map((person) => (
            <option key={person.id} value={person.id}>{person.display_name || `${person.first_name} ${person.last_name}`}</option>
          ))}
        </select>
        <select
          value={caregiverFilter}
          onChange={(e) => setCaregiverFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900"
        >
          <option value="">All caregivers</option>
          {caregivers.map((person) => (
            <option key={person.id} value={person.id}>{person.display_name || `${person.first_name} ${person.last_name}`}</option>
          ))}
        </select>
      </div>

      {filteredAssignments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">24/7 Assignments</h2>
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900">
                  {persons[assignment.care_recipient_id]?.display_name || "Unknown Recipient"}
                </p>
                <p className="text-sm text-slate-600">
                  24/7 {assignment.type} care with {persons[assignment.caregiver_id]?.display_name || "Unknown Caregiver"} · {assignment.start_date}
                  {assignment.end_date ? ` to ${assignment.end_date}` : " onward"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/assignment24x7")}
                className="px-4 py-2 bg-white border border-orange-200 text-orange-700 rounded-lg font-medium"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Visits Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading schedule...</div>
        ) : filteredVisits.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No visits scheduled.</div>
        ) : (
          filteredVisits.map((visit) => {
            const recipient = persons[visit.care_recipient_id];
            const caregiver = visit.assigned_caregiver_id ? persons[visit.assigned_caregiver_id] : null;
            const recipientName = recipient?.display_name || "Unknown Recipient";
            const caregiverName = caregiver?.display_name || "Unassigned";
            const isUnassigned = !visit.assigned_caregiver_id;
            
            const displayStatus = isUnassigned && visit.status === 'scheduled' ? 'unassigned' : visit.status;
            const locationString = [visit.address_street, visit.address_city].filter(Boolean).join(', ') || 'No location set';

            return (
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
                      <p className="font-semibold text-slate-900">{formatTimeRange(visit.scheduled_start, visit.scheduled_end)}</p>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-smooth">
                      {recipientName}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <Badge className={`border flex items-center gap-1 ${getStatusColor(displayStatus)}`}>
                    {getStatusIcon(displayStatus)}
                    <span className="capitalize">{displayStatus.replace('_', ' ')}</span>
                  </Badge>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Type</p>
                    <p className="text-sm font-medium text-slate-900">{formatVisitType(visit.visit_type)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Caregiver</p>
                    <p className={`text-sm font-medium ${
                      isUnassigned ? "text-red-600" : "text-emerald-600"
                    }`}>
                      {caregiverName}
                    </p>
                  </div>
                  <div className="flex items-end gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-slate-600 truncate" title={locationString}>{locationString}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
