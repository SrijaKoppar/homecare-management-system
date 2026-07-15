import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Users, Clock, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { listPersons, Person } from "../../lib/personsApi";
import { createVisit, getVisit, updateVisit } from "../../lib/visitsApi";

export default function NewVisit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipients, setRecipients] = useState<Person[]>([]);
  const [caregivers, setCaregivers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    care_recipient_id: "",
    assigned_caregiver_id: "",
    visit_type: "personal_care",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    address: "",
    recurrence: "",
  });

  useEffect(() => {
    const fetchPersons = async () => {
      setLoading(true);
      try {
        const [recipientData, caregiverData] = await Promise.all([
          listPersons({ role: "care_recipient" }),
          listPersons({ role: "caregiver" }),
        ]);
        setRecipients(recipientData);
        setCaregivers(caregiverData);
        if (id) {
          const visit = await getVisit(id);
          const start = new Date(visit.scheduled_start);
          const end = new Date(visit.scheduled_end);
          setFormData({
            care_recipient_id: visit.care_recipient_id,
            assigned_caregiver_id: visit.assigned_caregiver_id || "",
            visit_type: visit.visit_type,
            startDate: start.toISOString().slice(0, 10),
            startTime: start.toISOString().slice(11, 16),
            endDate: end.toISOString().slice(0, 10),
            endTime: end.toISOString().slice(11, 16),
            address: visit.address_street || "",
            recurrence: visit.recurrence_rule || "",
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load persons");
      } finally {
        setLoading(false);
      }
    };
    fetchPersons();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.care_recipient_id) {
      setError("Please select a care recipient");
      return;
    }
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      setError("Please fill in start and end times");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();

      const payload = {
        organization_id: localStorage.getItem("organization_id") || "00000000-0000-0000-0000-000000000000",
        care_recipient_id: formData.care_recipient_id,
        assigned_caregiver_id: formData.assigned_caregiver_id || undefined,
        visit_type: formData.visit_type as any,
        scheduled_start: startDateTime,
        scheduled_end: endDateTime,
        address_street: formData.address,
        recurrence_rule: formData.recurrence.trim() || undefined,
      };
      if (id) {
        await updateVisit(id, payload);
      } else {
        await createVisit(payload);
      }

      navigate("/schedule");
    } catch (err: any) {
      setError(err.message || "Failed to save visit");
    } finally {
      setSaving(false);
    }
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
              {id ? "Edit Visit" : "New Visit"}
            </h1>
            <p className="text-slate-500 mt-2">
              Schedule a visit with a care recipient.
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
                  name="care_recipient_id"
                  value={formData.care_recipient_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  disabled={loading}
                >
                  <option value="">Select recipient...</option>
                  {recipients.map(p => (
                    <option key={p.id} value={p.id}>{p.display_name || `${p.first_name} ${p.last_name}`}</option>
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
                  name="assigned_caregiver_id"
                  value={formData.assigned_caregiver_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  disabled={loading}
                >
                  <option value="">Unassigned</option>
                  {caregivers.map(p => (
                    <option key={p.id} value={p.id}>{p.display_name || `${p.first_name} ${p.last_name}`}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visit Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Visit Type
              </label>
              <select
                name="visit_type"
                value={formData.visit_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
              >
                <option value="personal_care">Personal care</option>
                <option value="nursing">Nursing</option>
                <option value="companionship">Companionship</option>
                <option value="respite">Respite</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Start Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>
            </div>

            {/* End Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  placeholder="123 Oak St (optional)"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>

            {/* Repeats - stored as free text only. This does not generate
                additional visit instances; recurring visits must still be
                scheduled individually for MVP-1. */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Repeats <span className="font-normal text-slate-400">(note only, doesn't auto-schedule)</span>
              </label>
              <input
                type="text"
                name="recurrence"
                placeholder="e.g. Every Tuesday and Thursday (optional)"
                value={formData.recurrence}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                This is stored as a plain note for staff to read. It will not
                create additional visits automatically - schedule each
                occurrence separately.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/schedule")}
                className="px-6 py-2.5 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-smooth"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-smooth disabled:opacity-50"
              >
                {saving ? "Saving..." : id ? "Update Visit" : "Save Visit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
