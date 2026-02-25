import { useState } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InvitePerson() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Family editor");
  const [organization, setOrganization] = useState("My family");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendInvite = async () => {
    if (!email || !role) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  if (sent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Invite Sent!</h2>
            <p className="text-slate-600">
              An invitation has been sent to <strong>{email}</strong> to join as a <strong>{role}</strong>.
            </p>
            <button
              onClick={() => navigate("/people")}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-smooth"
            >
              Back to People
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/people")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-8 transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
              Invite Person
            </h1>
            <p className="text-slate-500 mt-2">
              Send an invitation to someone to join your care circle.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendInvite();
            }}
            className="space-y-6"
          >
            {/* Organization Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Organization
              </label>
              <select
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
              >
                <option>My family</option>
                <option>Sunrise Agency</option>
                <option>Community Health</option>
              </select>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="person@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
              >
                <option>Family editor</option>
                <option>Family viewer</option>
                <option>Caregiver</option>
                <option>Viewer</option>
              </select>
            </div>

            {/* Role Description */}
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
              <p className="text-sm text-orange-900">
                <strong>{role}</strong> can {
                  role === "Family editor"
                    ? "manage care plans, schedule visits, and invite others."
                    : role === "Family viewer"
                    ? "view care information and messages."
                    : role === "Caregiver"
                    ? "see assigned visits, complete tasks, and send updates."
                    : "view public information only."
                }
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/people")}
                className="px-6 py-2.5 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-lg font-medium transition-smooth"
              >
                {loading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
