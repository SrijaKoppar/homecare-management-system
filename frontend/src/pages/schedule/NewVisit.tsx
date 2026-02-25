import { useState } from "react";
import { ArrowLeft, Calendar, Users, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewVisit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipient: "",
    caregiver: "",
    visitType: "Personal care",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    address: "123 Oak St (default)",
    repeats: "No",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Visit saved!");
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
              New Visit
            </h1>
            <p className="text-slate-500 mt-2">
              Schedule a visit with a care recipient.
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
                  <option>Unassigned</option>
                  <option>Jane Doe</option>
                  <option>Mike Johnson</option>
                  <option>Sarah Wilson</option>
                </select>
              </div>
            </div>

            {/* Visit Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Visit Type
              </label>
              <select
                name="visitType"
                value={formData.visitType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
              >
                <option>Personal care</option>
                <option>Nursing</option>
                <option>Companionship</option>
                <option>Physical therapy</option>
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
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>

            {/* Repeats */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Repeats?
              </label>
              <select
                name="repeats"
                value={formData.repeats}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
              >
                <option>No</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
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
                Save Visit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
