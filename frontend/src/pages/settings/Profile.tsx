import { useState } from "react";
import { ArrowLeft, Mail, Phone, User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

export default function Profile() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@homecare.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    joinDate: "Jan 15, 2025",
  });

  const [changePassword, setChangePassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-8 transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
              Profile Settings
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your personal account information.
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{formData.firstName} {formData.lastName}</p>
              <p className="text-sm text-slate-500">{formData.role}</p>
              <p className="text-xs text-slate-400 mt-1">Member since {formData.joinDate}</p>
            </div>
          </div>

          {/* Personal Info Form */}
          <form className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  First Name
                </label>
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Last Name
                </label>
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 focus:outline-none cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Contact support to change your email.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
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

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Change Password</h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  name="current"
                  value={changePassword.current}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="new"
                  value={changePassword.new}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  name="confirm"
                  value={changePassword.confirm}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
