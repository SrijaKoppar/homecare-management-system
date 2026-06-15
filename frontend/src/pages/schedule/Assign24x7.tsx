import { useEffect, useState } from "react";
import { ArrowLeft, Users, Calendar, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createAssignment24x7, deleteAssignment24x7, listAssignments24x7, type Assignment24x7 } from "../../lib/assignments24x7Api";
import { listPersons, type Person } from "../../lib/personsApi";

export default function Assign24x7() {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Person[]>([]);
  const [caregivers, setCaregivers] = useState<Person[]>([]);
  const [assignments, setAssignments] = useState<Assignment24x7[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    recipient: "",
    caregiver: "",
    type: "primary",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [recipientData, caregiverData, assignmentData] = await Promise.all([
        listPersons({ role: "care_recipient" }),
        listPersons({ role: "caregiver" }),
        listAssignments24x7(),
      ]);
      setRecipients(recipientData);
      setCaregivers(caregiverData);
      setAssignments(assignmentData.filter((item) => item.status === "active"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assignment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.recipient || !formData.caregiver || !formData.startDate) {
      setError("Select a recipient, caregiver, and start date.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createAssignment24x7({
        organization_id: localStorage.getItem("organization_id") || "00000000-0000-0000-0000-000000000000",
        care_recipient_id: formData.recipient,
        caregiver_id: formData.caregiver,
        start_date: formData.startDate,
        end_date: formData.endDate || null,
        type: formData.type as "primary" | "relief",
        notes: formData.notes || undefined,
        status: "active",
      });
      await loadData();
      setFormData({ recipient: "", caregiver: "", type: "primary", startDate: "", endDate: "", notes: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save assignment");
    } finally {
      setLoading(false);
    }
  };

  const personName = (id: string) => {
    const person = [...recipients, ...caregivers].find((p) => p.id === id);
    return person?.display_name || (person ? `${person.first_name} ${person.last_name}` : "Unknown");
  };

  const handleCancelAssignment = async (id: string) => {
    if (!confirm("Cancel this assignment?")) return;
    await deleteAssignment24x7(id);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/schedule")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-8 transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
              Assign 24/7 Caregiver
            </h1>
            <p className="text-slate-500 mt-2">
              Set up continuous care for a recipient.
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8 flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              A 24/7 assignment means one caregiver is primarily responsible for this recipient during the specified period.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form className="space-y-6">
            {/* Care Recipient */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Care Recipient
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                >
                  <option value="">Select recipient...</option>
                  {recipients.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.display_name || `${person.first_name} ${person.last_name}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Caregiver */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Caregiver
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  name="caregiver"
                  value={formData.caregiver}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                >
                  <option value="">Select caregiver...</option>
                  {caregivers.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.display_name || `${person.first_name} ${person.last_name}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assignment Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Assignment Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
              >
                <option value="primary">Primary</option>
                <option value="relief">Relief</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>

            {/* End Date (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                End Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  placeholder="Leave blank for ongoing"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Leave blank if this assignment is ongoing.</p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions or notes..."
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/schedule")}
                className="px-6 py-2.5 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-smooth"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-smooth"
              >
                {loading ? "Saving..." : "Save Assignment"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Current 24/7 Assignments</h2>
          {assignments.length === 0 ? (
            <p className="text-sm text-slate-500">No active 24/7 assignments.</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{personName(assignment.care_recipient_id)}</p>
                    <p className="text-sm text-slate-500">
                      {personName(assignment.caregiver_id)} · {assignment.type} · {assignment.start_date}
                      {assignment.end_date ? ` to ${assignment.end_date}` : " onward"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCancelAssignment(assignment.id)}
                    className="px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
