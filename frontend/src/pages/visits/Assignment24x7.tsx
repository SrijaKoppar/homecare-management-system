import { ArrowLeft, Calendar, CheckCircle2, Circle, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

interface DailyTask {
  id: number;
  task: string;
  completed: boolean;
  time?: string;
}

export default function Assignment24x7() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<DailyTask[]>([
    { id: 1, task: "Morning routine & hygiene", completed: true, time: "8:00 AM" },
    { id: 2, task: "Medication round (7am, 12pm, 6pm)", completed: true, time: "8:30 AM" },
    { id: 3, task: "Breakfast & nutrition", completed: true, time: "9:00 AM" },
    { id: 4, task: "Light exercise/mobility", completed: false },
    { id: 5, task: "Lunch assistance", completed: false },
    { id: 6, task: "Afternoon check-in", completed: false },
  ]);

  const [dailyNote, setDailyNote] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed, time: !t.completed ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined } : t
    ));
  };

  const handleSaveNote = () => {
    alert("Daily note saved!");
    setDailyNote("");
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/schedule")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-smooth mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
          Mary Smith · 24/7 Assignment
        </h1>
        <p className="text-slate-500 mt-1">
          Caregiver: Jane Doe · Active since Feb 1, 2025
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Today's Progress</h2>
          <span className="text-sm font-medium text-slate-500">
            {completedTasks}/{totalTasks} completed
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          />
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Daily Tasks</h2>
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
                {task.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-300 hover:text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-900"}`}>
                  {task.task}
                </p>
              </div>

              {task.time && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {task.time}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Notes */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Daily Note
        </h2>
        
        <textarea
          value={dailyNote}
          onChange={(e) => setDailyNote(e.target.value)}
          placeholder="Add observations, notes, or important information for the next shift..."
          rows={4}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth resize-none"
        />

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
          <Button variant="outline">Clear</Button>
          <Button onClick={handleSaveNote} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            Save Note
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">Days Assigned</p>
          <p className="text-3xl font-bold text-slate-900">34</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">Tasks Completed</p>
          <p className="text-3xl font-bold text-emerald-600">{completedTasks}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">Rating</p>
          <p className="text-3xl font-bold text-amber-600">4.8★</p>
        </div>
      </div>
    </div>
  );
}
