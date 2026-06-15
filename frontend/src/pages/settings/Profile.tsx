import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { getPerson, updatePerson, roleLabel } from "../../lib/personsApi";

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const storedRole = localStorage.getItem("role");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phone: "",
    timezone: "UTC",
    avatarUrl: "",
  });

  useEffect(() => {
    if (!userId) {
      setError("Not logged in");
      setLoading(false);
      return;
    }
    getPerson(userId)
      .then((person) => {
        setFormData({
          firstName: person.first_name,
          lastName: person.last_name,
          displayName: person.display_name ?? "",
          email: person.email,
          phone: person.phone ?? "",
          timezone: localStorage.getItem("timezone") || "UTC",
          avatarUrl: localStorage.getItem("avatar_url") || "",
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("First and last name are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await updatePerson(userId, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        display_name: formData.displayName.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      });
      localStorage.setItem("display_name", updated.display_name || `${updated.first_name} ${updated.last_name}`);
      localStorage.setItem("timezone", formData.timezone);
      if (formData.avatarUrl.trim()) {
        localStorage.setItem("avatar_url", formData.avatarUrl.trim());
      }
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-smooth"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">Profile Settings</h1>
          <p className="text-slate-500 mt-2">Manage your personal account information.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
        )}

        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-3xl">
            {formData.firstName.charAt(0) || "👤"}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {formData.displayName || `${formData.firstName} ${formData.lastName}`}
            </p>
            <p className="text-sm text-slate-500">{roleLabel(storedRole)}</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Contact support to change your email.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Timezone</label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 transition-smooth"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern (US)</option>
              <option value="America/Chicago">Central (US)</option>
              <option value="America/Denver">Mountain (US)</option>
              <option value="America/Los_Angeles">Pacific (US)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Avatar URL (placeholder)</label>
            <input
              type="url"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
