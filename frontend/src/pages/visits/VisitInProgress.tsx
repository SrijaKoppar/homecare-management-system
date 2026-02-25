import { useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, MapPin, Clock, MessageSquare, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

interface Task {
  id: number;
  name: string;
  done: boolean;
  completedTime?: string;
}

export default function VisitInProgress() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Morning hygiene", done: true, completedTime: "10:15 AM" },
    { id: 2, name: "Medication - 9 AM dose", done: false },
    { id: 3, name: "Light exercise", done: false },
  ]);

  const [visitNote, setVisitNote] = useState({
    summary: "",
    mood: "Good",
    nextSteps: "",
  });

  const [showEndDialog, setShowEndDialog] = useState(false);

  const toggleTask = (id: number) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done, completedTime: !t.done ? now : undefined } : t
    ));
  };

  const handleEndVisit = () => {
    alert("Visit ended successfully!");
    navigate("/schedule");
  };

  const completedTasks = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;

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

        <h1 className="text-3xl font-bold text-slate-900 text-balance-heading mb-3">
          Visit · Mary Smith
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            123 Oak St
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Personal care · 10:00 AM – 12:00 PM
          </div>
        </div>
      </div>

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
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-smooth"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex-shrink-0 focus:outline-none"
                >
                  {task.done ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-slate-300 hover:text-slate-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${task.done ? "line-through text-slate-500" : "text-slate-900"}`}>
                    {task.name}
                  </p>
                  {task.completedTime && (
                    <p className="text-xs text-emerald-600">Completed {task.completedTime}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition-smooth">
                    Note
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
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth resize-none"
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
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 transition-smooth"
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
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer with End Visit Button */}
      <div className="bg-white border-t border-slate-200 p-6">
        {showEndDialog ? (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>Note:</strong> All task notes are required to end this visit.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEndDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEndVisit}
                className="bg-red-600 hover:bg-red-700"
              >
                End Visit
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
    </div>
  );
}
