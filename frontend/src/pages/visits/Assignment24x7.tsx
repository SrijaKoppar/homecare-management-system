import { ArrowLeft, CheckCircle2, Circle, MessageSquare, Clock, ShieldAlert, MinusCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { listAssignments24x7, type Assignment24x7 } from "../../lib/assignments24x7Api";
import { getPerson, listPersons, type Person } from "../../lib/personsApi";
import { listTasks, updateTask, type Task } from "../../lib/tasksApi";
import { createCareNote, listCareNotes, type CareNote } from "../../lib/notesApi";
import { format } from "date-fns";

export default function Assignment24x7Page() {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("user_id") || "00000000-0000-0000-0000-000000000000";
  const currentUserRole = localStorage.getItem("role") || "caregiver";

  const [activeAssignment, setActiveAssignment] = useState<Assignment24x7 | null>(null);
  const [recipient, setRecipient] = useState<Person | null>(null);
  const [caregiver, setCaregiver] = useState<Person | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<CareNote[]>([]);
  
  const [allAssignments, setAllAssignments] = useState<Assignment24x7[]>([]);
  const [allPersons, setAllPersons] = useState<Person[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [dailyNote, setDailyNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const persons = await listPersons();
        setAllPersons(persons);
        
        let assignments: Assignment24x7[] = [];
        if (currentUserRole === "caregiver") {
          // Caregiver: find assignments assigned to them
          assignments = await listAssignments24x7({ caregiver_id: currentUserId });
        } else {
          // Admin/Supervisor: find all assignments
          assignments = await listAssignments24x7();
          setAllAssignments(assignments);
        }

        const active = assignments.find(a => a.status === 'active') || null;
        setActiveAssignment(active);

        if (active) {
          const [recData, cgData, taskData, noteData] = await Promise.all([
            getPerson(active.care_recipient_id),
            getPerson(active.caregiver_id),
            listTasks({ assignment_24x7_id: active.id }),
            listCareNotes({ assignment_24x7_id: active.id })
          ]);
          setRecipient(recData);
          setCaregiver(cgData);
          setTasks(taskData);
          setNotes(noteData);
        }
      } catch (err) {
        console.error("Failed to load 24/7 assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUserId, currentUserRole]);

  const updateTaskStatus = async (task: Task, status: Task["status"]) => {
    if (!activeAssignment) return;
    const note = status === "pending" ? task.notes : window.prompt("Optional task note", task.notes || "") ?? task.notes;
    try {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status, notes: note || null } : t));
      await updateTask(task.id, { status, notes: note || null });
    } catch (err: any) {
      alert("Failed to update task: " + err.message);
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t));
    }
  };

  const handleSaveNote = async () => {
    if (!activeAssignment || !dailyNote.trim()) {
      alert("Daily note summary cannot be empty");
      return;
    }
    setSavingNote(true);
    try {
      await createCareNote({
        care_recipient_id: activeAssignment.care_recipient_id,
        organization_id: activeAssignment.organization_id,
        assignment_24x7_id: activeAssignment.id,
        author_id: currentUserId,
        note_date: format(new Date(), 'yyyy-MM-dd'),
        summary: dailyNote.trim(),
        mood: "Good",
      });
      alert("Daily care note saved successfully!");
      setDailyNote("");
      setNotes(await listCareNotes({ assignment_24x7_id: activeAssignment.id }));
    } catch (err: any) {
      alert("Failed to save note: " + err.message);
    } finally {
      setSavingNote(false);
    }
  };

  const handleSelectAssignment = async (assg: Assignment24x7) => {
    setLoading(true);
    try {
      setActiveAssignment(assg);
      const [recData, cgData, taskData, noteData] = await Promise.all([
        getPerson(assg.care_recipient_id),
        getPerson(assg.caregiver_id),
        listTasks({ assignment_24x7_id: assg.id }),
        listCareNotes({ assignment_24x7_id: assg.id })
      ]);
      setRecipient(recData);
      setCaregiver(cgData);
      setTasks(taskData);
      setNotes(noteData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading assignment details...</div>;
  }

  // If no active assignment is set (or we are in admin view with no selected assignment)
  if (!activeAssignment) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => navigate("/schedule")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-smooth mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">24/7 Caregiver Assignments</h1>
          <p className="text-slate-500 mt-1">No active assignment found for you.</p>
        </div>

        {currentUserRole !== "caregiver" && allAssignments.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Active Assignments in Organization</h2>
            <div className="divide-y divide-slate-100">
              {allAssignments.map(assg => {
                const rec = allPersons.find(p => p.id === assg.care_recipient_id);
                const cg = allPersons.find(p => p.id === assg.caregiver_id);
                return (
                  <div
                    key={assg.id}
                    onClick={() => handleSelectAssignment(assg)}
                    className="flex justify-between items-center py-4 cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-smooth"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">Recipient: {rec?.display_name || "Unknown"}</p>
                      <p className="text-sm text-slate-500">Caregiver: {cg?.display_name || "Unknown"} ({assg.type})</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Since: {format(new Date(assg.start_date), 'MMM d, yyyy')}</span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl max-w-md mx-auto">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-medium text-slate-600">No Assignments Configured</p>
            <p className="text-sm text-slate-500 mt-1">Contact your care coordinator to assign a caregiver context.</p>
          </div>
        )}
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      {/* Back to List for Supervisor/Admin */}
      {currentUserRole !== "caregiver" && (
        <button
          onClick={() => {
            setActiveAssignment(null);
            setRecipient(null);
            setCaregiver(null);
          }}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          View All Assignments
        </button>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
          {recipient?.display_name || "Recipient Profile"} · 24/7 Assignment
        </h1>
        <p className="text-slate-500 mt-1">
          Caregiver: {caregiver?.display_name || "Unknown Caregiver"} · Active since {format(new Date(activeAssignment.start_date), 'MMMM d, yyyy')}
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
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Daily Tasks</h2>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-smooth"
              >
                <button
                  onClick={() => updateTaskStatus(task, task.status === "completed" ? "pending" : "completed")}
                  className="flex-shrink-0 focus:outline-none"
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
                  {task.notes && <p className="text-sm text-slate-500 mt-1">Note: {task.notes}</p>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateTaskStatus(task, "completed")}
                    className="px-3 py-1.5 text-sm border border-emerald-200 rounded-lg text-emerald-700"
                  >
                    <CheckCircle2 className="inline h-4 w-4 mr-1" /> Complete
                  </button>
                  <button
                    onClick={() => updateTaskStatus(task, "skipped")}
                    className="px-3 py-1.5 text-sm border border-amber-200 rounded-lg text-amber-700"
                  >
                    <MinusCircle className="inline h-4 w-4 mr-1" /> Skip
                  </button>
                  <button
                    onClick={() => updateTaskStatus(task, "declined")}
                    className="px-3 py-1.5 text-sm border border-red-200 rounded-lg text-red-700"
                  >
                    <XCircle className="inline h-4 w-4 mr-1" /> Decline
                  </button>
                </div>

                {task.completed_at && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600 flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    {format(new Date(task.completed_at), 'h:mm a')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-center italic text-sm">
              No daily tasks configured. Add tasks through the patient's Care Plan.
            </div>
          )}
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
          <Button variant="outline" onClick={() => setDailyNote("")} disabled={savingNote}>Clear</Button>
          <Button onClick={handleSaveNote} disabled={savingNote} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            {savingNote ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Daily Notes Timeline</h2>
        {notes.length === 0 ? (
          <p className="text-sm text-slate-500">No daily notes yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-900">{note.note_date} · {note.mood || "No mood set"}</p>
                <p className="text-sm text-slate-600 mt-1">{note.summary}</p>
                {note.next_steps && <p className="text-sm text-slate-500 mt-1">Next: {note.next_steps}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
