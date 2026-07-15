import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Target, CheckCircle2, Calendar, Plus, Users, Search } from "lucide-react";
import { listPersons, type Person } from "../../lib/personsApi";
import { listCarePlans, createCarePlan, updateCarePlan, type CarePlan } from "../../lib/carePlansApi";
import { listTasks, createTask, type Task } from "../../lib/tasksApi";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import { notifyError } from "../../lib/notify";

export default function CarePlanDetail() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const recipientId = searchParams.get("recipient_id");

  const [recipients, setRecipients] = useState<Person[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Person | null>(null);
  
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [activePlan, setActivePlan] = useState<CarePlan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Create Plan Form State
  const [createMode, setCreateMode] = useState(false);
  const [formName, setFormName] = useState("");
  const [formGoals, setFormGoals] = useState("");
  const [formFocusAreas, setFormFocusAreas] = useState<string[]>([]);
  const [formEffectiveFrom, setFormEffectiveFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [submitting, setSubmitting] = useState(false);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("adl");

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", goals: "", focusAreas: [] as string[] });

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const persons = await listPersons({ role: "care_recipient" });
        setRecipients(persons);
      } catch (err) {
        console.error("Failed to fetch recipients:", err);
      }
    };
    fetchRecipients();
  }, []);

  useEffect(() => {
    if (recipientId && recipients.length > 0) {
      const match = recipients.find(r => r.id === recipientId);
      if (match) {
        setSelectedRecipient(match);
      }
    }
  }, [recipientId, recipients]);

  useEffect(() => {
    const fetchPlanData = async () => {
      if (!selectedRecipient) return;
      setLoading(true);
      setCreateMode(false);
      try {
        const plans = await listCarePlans(selectedRecipient.id);
        setCarePlans(plans);
        const active = plans.find(p => p.status === 'active') || null;
        setActivePlan(active);
        if (active) {
          setEditForm({
            name: active.name,
            goals: active.goals ?? "",
            focusAreas: active.focus_areas ?? [],
          });
          const planTasks = await listTasks({ care_recipient_id: selectedRecipient.id });
          // Filter tasks belonging to care plan (either directly or via date range)
          setTasks(planTasks.filter(t => t.care_plan_id === active.id));
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Failed to load care plan data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanData();
  }, [selectedRecipient]);

  const handleSelectRecipient = (rec: Person) => {
    setSelectedRecipient(rec);
    setSearchParams({ recipient_id: rec.id });
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient) return;
    if (!formName.trim()) {
      notifyError("Plan name is required");
      return;
    }
    setSubmitting(true);
    try {
      const plan = await createCarePlan({
        care_recipient_id: selectedRecipient.id,
        organization_id: localStorage.getItem("organization_id") || "00000000-0000-0000-0000-000000000000",
        name: formName,
        goals: formGoals,
        focus_areas: formFocusAreas,
        effective_from: formEffectiveFrom,
        status: "active",
      });
      setActivePlan(plan);
      setCreateMode(false);
      // Refresh plans
      const plans = await listCarePlans(selectedRecipient.id);
      setCarePlans(plans);
    } catch (err: any) {
      notifyError("Failed to create plan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !activePlan || !newTaskTitle.trim()) return;
    try {
      const task = await createTask({
        organization_id: localStorage.getItem("organization_id") || "00000000-0000-0000-0000-000000000000",
        care_recipient_id: selectedRecipient.id,
        care_plan_id: activePlan.id,
        task_date: format(new Date(), 'yyyy-MM-dd'),
        title: newTaskTitle.trim(),
        category: newTaskCategory,
        status: 'pending',
      });
      setTasks(prev => [...prev, task]);
      setNewTaskTitle("");
    } catch (err: any) {
      notifyError("Failed to add task: " + err.message);
    }
  };

  const toggleFocusArea = (area: string) => {
    setFormFocusAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleSaveEdit = async () => {
    if (!activePlan || !selectedRecipient) return;
    setSubmitting(true);
    try {
      const updated = await updateCarePlan(activePlan.id, {
        name: editForm.name.trim(),
        goals: editForm.goals,
        focus_areas: editForm.focusAreas,
      });
      setActivePlan(updated);
      setEditMode(false);
      const plans = await listCarePlans(selectedRecipient.id);
      setCarePlans(plans);
    } catch (err: unknown) {
      notifyError("Failed to update plan: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  const archivedPlans = carePlans.filter((p) => p.status !== "active");

  const toggleEditFocusArea = (area: string) => {
    setEditForm((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }));
  };

  const filteredRecipients = recipients.filter(r => {
    const name = r.display_name || `${r.first_name} ${r.last_name}`;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || r.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => {
            if (selectedRecipient) {
              setSelectedRecipient(null);
              setSearchParams({});
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-4 transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          {selectedRecipient ? "Select Another Patient" : "Back"}
        </button>
      </div>

      {!selectedRecipient ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
              Care Plans
            </h1>
            <p className="text-slate-500 mt-1">
              Select a patient to manage their care plan goals, focus areas, and tasks.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
            />
          </div>

          {/* List recipients */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipients.length > 0 ? (
              filteredRecipients.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => handleSelectRecipient(rec)}
                  className="cursor-pointer bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-smooth flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    👤
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-smooth truncate">
                      {rec.display_name || `${rec.first_name} ${rec.last_name}`}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{rec.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-12 text-center bg-slate-50 border border-slate-200 rounded-xl">
                <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-slate-600">No patients found</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
              Care Plan · {selectedRecipient.display_name || `${selectedRecipient.first_name} ${selectedRecipient.last_name}`}
            </h1>
            <p className="text-slate-500 mt-1">
              Configure recovery goals, focus areas, and daily ADL tasks.
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading plan...</div>
          ) : !activePlan && !createMode ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl max-w-xl mx-auto">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-slate-900 mb-2">No Active Care Plan</h2>
              <p className="text-slate-500 mb-6">This patient does not have an active care plan configuration.</p>
              <Button onClick={() => setCreateMode(true)} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <Plus className="w-4 h-4 mr-2" /> Create Care Plan
              </Button>
            </div>
          ) : createMode ? (
            /* Create Plan Form */
            <form onSubmit={handleCreatePlan} className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl mx-auto space-y-5">
              <h2 className="text-xl font-bold text-slate-900">New Care Plan</h2>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Post-hospital physical recovery"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Care Goals</label>
                <textarea
                  placeholder="What are the key goals for this plan?"
                  value={formGoals}
                  onChange={(e) => setFormGoals(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Focus Areas</label>
                <div className="flex flex-wrap gap-2">
                  {["mobility", "medication", "nutrition", "hygiene", "companionship"].map(area => (
                    <button
                      type="button"
                      key={area}
                      onClick={() => toggleFocusArea(area)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth capitalize ${
                        formFocusAreas.includes(area)
                          ? "bg-orange-100 text-orange-700 border-orange-200"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Effective From</label>
                <input
                  type="date"
                  required
                  value={formEffectiveFrom}
                  onChange={(e) => setFormEffectiveFrom(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setCreateMode(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-orange-500 to-orange-600">
                  {submitting ? "Saving..." : "Save Care Plan"}
                </Button>
              </div>
            </form>
          ) : (
            /* Active Plan Detail View */
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setEditMode(!editMode)}>
                  {editMode ? "Cancel Edit" : "Edit Plan"}
                </Button>
              </div>

              {editMode ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Care Goals</label>
                    <textarea
                      value={editForm.goals}
                      onChange={(e) => setEditForm((f) => ({ ...f, goals: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Focus Areas</label>
                    <div className="flex flex-wrap gap-2">
                      {["mobility", "medication", "nutrition", "hygiene", "companionship"].map((area) => (
                        <button
                          type="button"
                          key={area}
                          onClick={() => toggleEditFocusArea(area)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize ${
                            editForm.focusAreas.includes(area)
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" disabled={submitting} className="bg-orange-500 hover:bg-orange-600">
                    {submitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              ) : (
              <>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Plan Info */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 md:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <h2 className="font-semibold text-slate-900">Plan Details</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Plan Name</p>
                      <p className="text-lg font-semibold text-slate-900">{activePlan?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Focus Areas</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {activePlan?.focus_areas?.map(area => (
                          <span key={area} className="px-2.5 py-1 bg-slate-100 border text-slate-750 text-xs font-semibold rounded-full capitalize">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <h2 className="font-semibold text-slate-900">Timeline</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Start Date</p>
                      <p className="text-sm font-medium text-slate-900">
                        {activePlan?.effective_from ? format(new Date(activePlan.effective_from), 'MMMM d, yyyy') : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">End Date</p>
                      <p className="text-sm font-medium text-slate-900">
                        {activePlan?.effective_to ? format(new Date(activePlan.effective_to), 'MMMM d, yyyy') : "Ongoing"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-slate-400" />
                  <h2 className="font-semibold text-slate-900">Care Goals</h2>
                </div>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {activePlan?.goals || "No care goals defined yet."}
                </p>
              </div>

              {/* Daily Tasks */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="font-semibold text-slate-900">Daily Care Tasks ({tasks.length})</h2>

                {/* Task Input Form */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter new task description..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
                  />
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm bg-white"
                  >
                    <option value="adl">ADL</option>
                    <option value="medication">Medication</option>
                    <option value="exercise">Exercise</option>
                    <option value="household">Household</option>
                    <option value="other">Other</option>
                  </select>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm">
                    <Plus className="w-4 h-4 mr-1" /> Add Task
                  </Button>
                </form>

                {/* Task List */}
                <div className="space-y-2 pt-2">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100/50 transition-smooth">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-700">{task.title}</span>
                        </div>
                        <span className="px-2.5 py-0.5 border bg-white text-slate-500 text-xs font-semibold rounded-full capitalize">
                          {task.category}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-center italic text-sm">
                      No daily care tasks configured yet.
                    </div>
                  )}
                </div>
              </div>

              {archivedPlans.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">Archived Plans ({archivedPlans.length})</h2>
                  <div className="space-y-2">
                    {archivedPlans.map((plan) => (
                      <div key={plan.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="font-medium text-slate-800">{plan.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{plan.status} · {plan.effective_from}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
