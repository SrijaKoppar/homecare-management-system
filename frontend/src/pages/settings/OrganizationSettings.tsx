import { useState } from "react";
import { ArrowLeft, Building, Phone, MapPin, Mail, Users, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

export default function OrganizationSettings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Sunrise Home Care",
    email: "admin@sunrisehomecare.com",
    phone: "+1 (555) 987-6543",
    address: "456 Healthcare Ave, Medical City, MC 12345",
    city: "Medical City",
    state: "MC",
    zip: "12345",
    type: "Agency",
    licenseNumber: "HCA-2024-001",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Organization settings updated!");
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

        {/* Organization Settings Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
              Organization Settings
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your organization's profile and settings.
            </p>
          </div>

          {/* Organization Info Section */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organization Information
            </h2>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Organization Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Organization Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 transition-smooth"
                >
                  <option>Agency</option>
                  <option>Family-based</option>
                  <option>Independent</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone
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

              {/* City, State, Zip */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  License Number
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </h2>

          <div className="space-y-3 mb-6">
            {[
              { name: "Admin User", role: "Organization Admin", email: "admin@sunrisehomecare.com" },
              { name: "Jane Doe", role: "Manager", email: "jane@sunrisehomecare.com" },
              { name: "Mike Johnson", role: "Caregiver", email: "mike@sunrisehomecare.com" },
            ].map((member, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-smooth">
                <div>
                  <p className="font-medium text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
                <p className="text-sm text-slate-600">{member.email}</p>
              </div>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            Invite Team Member
          </Button>
        </div>
      </div>
    </div>
  );
}
