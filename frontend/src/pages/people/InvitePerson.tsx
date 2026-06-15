import { useState } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPerson, type PersonRole } from "../../lib/personsApi";

const roleMap: Record<string, PersonRole> = {
  "Family editor": "family_editor",
  "Family viewer": "family_viewer",
  Caregiver: "caregiver",
  "Care recipient": "care_recipient",
};

export default function InvitePerson() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("Family editor");
  const [organization, setOrganization] = useState("My family");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendInvite = async () => {
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !role) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await createPerson({
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        display_name: `${firstName.trim()} ${lastName.trim()}`,
        role: roleMap[role] || "family_viewer",
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error sending invite");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <InviteSuccessCard
          email={email}
          role={role}
          onBack={() => navigate("/people")}
        />
      </div>
    );
  }

  const roleDescription =
    role === "Family editor"
      ? "manage care plans, schedule visits, and invite others."
      : role === "Family viewer"
        ? "view care information and messages."
        : role === "Caregiver"
          ? "see assigned visits, complete tasks, and send updates."
          : "view public information only.";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/people")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-8 transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">Invite Person</h1>
            <p className="text-slate-500 mt-2">Add someone to your care circle.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendInvite();
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Organization</label>
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
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

            <RoleField role={role} setRole={setRole} />

            <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
              <p className="text-sm text-orange-900">
                <strong>{role}</strong> can {roleDescription}
              </p>
            </div>

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
                {loading ? "Saving..." : "Add Person"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function InviteSuccessCard({
  email,
  role,
  onBack,
}: {
  email: string;
  role: string;
  onBack: () => void;
}) {
  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Person Added</h2>
      <p className="text-slate-600">
        <strong>{email}</strong> was added with intended role <strong>{role}</strong>.
        Their organization membership was created with this role.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-smooth"
      >
        Back to People
      </button>
    </div>
  );
}

function RoleField({
  role,
  setRole,
}: {
  role: string;
  setRole: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
      >
        <option>Family editor</option>
        <option>Family viewer</option>
        <option>Caregiver</option>
        <option>Care recipient</option>
      </select>
    </div>
  );
}
