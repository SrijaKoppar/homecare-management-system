import { useState } from "react";
import { ArrowLeft, Users, Calendar, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Assign24x7() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipient: "",
    caregiver: "",
    type: "Primary",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("24/7 assignment saved!");
    navigate("/schedule");
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
                  <option>Select recipient...</option>
                  <option>Mary Smith</option>
                  <option>John K</option>
                  <option>Alice Brown</option>
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
                  <option>Select caregiver...</option>
                  <option>Jane Doe</option>
                  <option>Mike Johnson</option>
                  <option>Sarah Wilson</option>
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
                <option>Primary</option>
                <option>Relief</option>
                <option>Backup</option>
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
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-smooth"
              >
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
