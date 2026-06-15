import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Circle, MapPin, Clock, MessageSquare, MoreVertical, XCircle, MinusCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { getVisit, startVisit, endVisit, Visit } from "../../lib/visitsApi";
import { getPerson, Person } from "../../lib/personsApi";
import { listTasks, updateTask, Task } from "../../lib/tasksApi";
import { createVisitNote } from "../../lib/notesApi";
import { format } from "date-fns";

export default function VisitInProgress() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [visit, setVisit] = useState<Visit | null>(null);
  const [recipient, setRecipient] = useState<Person | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [visitNote, setVisitNote] = useState({
    summary: "",
    mood: "Good",
    nextSteps: "",
  });

  const [showEndDialog, setShowEndDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [v, t] = await Promise.all([
          getVisit(id),
          listTasks({ visit_id: id })
        ]);
        setVisit(v);
        setTasks(t);
        const r = await getPerson(v.care_recipient_id);
        setRecipient(r);
      } catch (err: any) {
        setError(err.message || "Failed to load visit");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const updateTaskStatus = async (task: Task, status: Task["status"]) => {
    const note = status === "pending" ? task.notes : window.prompt("Optional task note", task.notes || "") ?? task.notes;
    try {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status, notes: note || null } : t));
      await updateTask(task.id, { status, notes: note || null });
    } catch (err: any) {
      alert("Failed to update task status: " + err.message);
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: task.status } : t));
    }
  };

  const handleStartVisit = async () => {
    if (!id) return;
    try {
      setActionLoading(true);
      const updated = await startVisit(id);
      setVisit(updated);
    } catch (err: any) {
      setError(err.message || "Failed to start visit");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndVisit = async () => {
    if (!id) return;
    try {
      setActionLoading(true);
      // Create visit note
      await createVisitNote({
        visit_id: id,
        author_id: localStorage.getItem("user_id") || "00000000-0000-0000-0000-000000000000",
        summary: visitNote.summary,
        mood: visitNote.mood,
        next_steps: visitNote.nextSteps,
      });

      const updated = await endVisit(id);
      setVisit(updated);
      alert("Visit ended successfully!");
      navigate("/schedule");
    } catch (err: any) {
      setError(err.message || "Failed to end visit");
    } finally {
      setActionLoading(false);
      setShowEndDialog(false);
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    try {
      return `${format(new Date(start), 'h:mm a')} – ${format(new Date(end), 'h:mm a')}`;
    } catch {
      return "Invalid time";
    }
  };

  const formatVisitType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading visit...</div>;
  }

  if (!visit) {
    return <div className="p-8 text-center text-slate-500">Visit not found.</div>;
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const locationString = [visit.address_street, visit.address_city].filter(Boolean).join(', ') || 'No location set';

  return (
    <div className="h-full flex flex-col bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/schedule")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-smooth"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-smooth">
            <MoreVertical className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <h1 className="text-3xl font-bold text-slate-900 text-balance-heading mb-3">
          Visit · {recipient?.display_name || "Unknown"}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {locationString}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {formatVisitType(visit.visit_type)} · {formatTimeRange(visit.scheduled_start, visit.scheduled_end)}
          </div>
        </div>
      </div>

      {visit.status === "scheduled" && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Visit Scheduled</h2>
            <p className="text-slate-500 mb-8">This visit is ready to start. Make sure you are at the correct location.</p>
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
              onClick={handleStartVisit}
              disabled={actionLoading}
            >
              {actionLoading ? "Starting..." : "Start Visit Now"}
            </Button>
          </div>
        </div>
      )}

      {(visit.status === "in_progress" || visit.status === "completed") && (
      <>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Tasks Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Tasks</h2>
              <span className="text-sm font-medium text-slate-500">
                {completedTasks}/{totalTasks} completed
              </span>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-slate-500 italic p-4">No tasks found for this visit.</div>
              ) : tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-smooth"
                >
                  <button
                    onClick={() => visit.status === "in_progress" && updateTaskStatus(task, task.status === "completed" ? "pending" : "completed")}
                    disabled={visit.status !== "in_progress"}
                    className="flex-shrink-0 focus:outline-none disabled:opacity-50"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-300 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${task.status === 'completed' ? "line-through text-slate-500" : "text-slate-900"}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-slate-500">{task.description}</p>
                    )}
                    {task.notes && (
                      <p className="text-sm text-slate-500 mt-1">Note: {task.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateTaskStatus(task, "completed")}
                      disabled={visit.status !== "in_progress"}
                      className="px-3 py-1.5 text-sm border border-emerald-200 rounded-lg text-emerald-700 hover:bg-white transition-smooth disabled:opacity-50"
                    >
                      <CheckCircle2 className="inline h-4 w-4 mr-1" /> Complete
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task, "skipped")}
                      disabled={visit.status !== "in_progress"}
                      className="px-3 py-1.5 text-sm border border-amber-200 rounded-lg text-amber-700 hover:bg-white transition-smooth disabled:opacity-50"
                    >
                      <MinusCircle className="inline h-4 w-4 mr-1" /> Skip
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task, "declined")}
                      disabled={visit.status !== "in_progress"}
                      className="px-3 py-1.5 text-sm border border-red-200 rounded-lg text-red-700 hover:bg-white transition-smooth disabled:opacity-50"
                    >
                      <XCircle className="inline h-4 w-4 mr-1" /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visit Note Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Visit Note
            </h2>

            <div className="space-y-4">
              {/* Summary */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Summary
                </label>
                <textarea
                  value={visitNote.summary}
                  onChange={(e) => setVisitNote({ ...visitNote, summary: e.target.value })}
                  placeholder="Describe what was accomplished during this visit..."
                  rows={3}
                  disabled={visit.status !== "in_progress"}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth resize-none disabled:opacity-50"
                />
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mood
                </label>
                <select
                  value={visitNote.mood}
                  onChange={(e) => setVisitNote({ ...visitNote, mood: e.target.value })}
                  disabled={visit.status !== "in_progress"}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 transition-smooth disabled:opacity-50"
                >
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Needs attention</option>
                </select>
              </div>

              {/* Next Steps */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Next Steps
                </label>
                <textarea
                  value={visitNote.nextSteps}
                  onChange={(e) => setVisitNote({ ...visitNote, nextSteps: e.target.value })}
                  placeholder="Any follow-up actions or notes for next visit..."
                  rows={2}
                  disabled={visit.status !== "in_progress"}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth resize-none disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with End Visit Button */}
        {visit.status === "in_progress" && (
          <div className="bg-white border-t border-slate-200 p-6">
            {showEndDialog ? (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> Summary is optional for MVP, but adding one helps family and agency teams review care.
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowEndDialog(false)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEndVisit}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Ending..." : "End Visit"}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowEndDialog(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-smooth"
              >
                End Visit
              </button>
            )}
          </div>
        )}
      </>
      )}
    </div>
  );
}
