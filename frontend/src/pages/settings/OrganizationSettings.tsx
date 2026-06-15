import { useEffect, useState } from "react";
import { ArrowLeft, Building, Phone, MapPin, Mail, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  getOrganization,
  updateOrganization,
  listLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  type Location,
} from "../../lib/organizationsApi";

export default function OrganizationSettings() {
  const navigate = useNavigate();
  const orgId = localStorage.getItem("organization_id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    primary_email: "",
    primary_phone: "",
    address_street: "",
    address_city: "",
    address_region: "",
    address_postal_code: "",
    timezone: "UTC",
  });

  const [locationForm, setLocationForm] = useState({
    name: "",
    address_street: "",
    address_city: "",
    address_region: "",
    address_postal_code: "",
    timezone: "UTC",
    is_default: false,
  });

  const loadData = async () => {
    if (!orgId) {
      setError("No organization selected");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [org, locs] = await Promise.all([getOrganization(orgId), listLocations()]);
      setFormData({
        name: org.name,
        primary_email: org.primary_email ?? "",
        primary_phone: org.primary_phone ?? "",
        address_street: org.address_street ?? "",
        address_city: org.address_city ?? "",
        address_region: org.address_region ?? "",
        address_postal_code: org.address_postal_code ?? "",
        timezone: org.timezone || "UTC",
      });
      setLocations(locs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load organization");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orgId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!orgId) return;
    setSaving(true);
    setError(null);
    try {
      await updateOrganization(orgId, {
        name: formData.name.trim(),
        primary_email: formData.primary_email.trim() || undefined,
        primary_phone: formData.primary_phone.trim() || undefined,
        address_street: formData.address_street.trim() || undefined,
        address_city: formData.address_city.trim() || undefined,
        address_region: formData.address_region.trim() || undefined,
        address_postal_code: formData.address_postal_code.trim() || undefined,
        timezone: formData.timezone,
      });
      alert("Organization settings updated!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const resetLocationForm = () => {
    setLocationForm({
      name: "",
      address_street: "",
      address_city: "",
      address_region: "",
      address_postal_code: "",
      timezone: formData.timezone,
      is_default: false,
    });
    setEditingLocationId(null);
    setShowLocationForm(false);
  };

  const handleSaveLocation = async () => {
    if (!orgId || !locationForm.name.trim()) {
      alert("Location name is required");
      return;
    }
    setSaving(true);
    try {
      if (editingLocationId) {
        await updateLocation(editingLocationId, {
          name: locationForm.name.trim(),
          address_street: locationForm.address_street.trim() || undefined,
          address_city: locationForm.address_city.trim() || undefined,
          address_region: locationForm.address_region.trim() || undefined,
          address_postal_code: locationForm.address_postal_code.trim() || undefined,
          timezone: locationForm.timezone,
          is_default: locationForm.is_default,
        });
      } else {
        await createLocation({
          organization_id: orgId,
          name: locationForm.name.trim(),
          address_street: locationForm.address_street.trim() || undefined,
          address_city: locationForm.address_city.trim() || undefined,
          address_region: locationForm.address_region.trim() || undefined,
          address_postal_code: locationForm.address_postal_code.trim() || undefined,
          timezone: locationForm.timezone,
          is_default: locationForm.is_default,
        });
      }
      resetLocationForm();
      const locs = await listLocations();
      setLocations(locs);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  const handleEditLocation = (loc: Location) => {
    setEditingLocationId(loc.id);
    setLocationForm({
      name: loc.name,
      address_street: loc.address_street ?? "",
      address_city: loc.address_city ?? "",
      address_region: loc.address_region ?? "",
      address_postal_code: loc.address_postal_code ?? "",
      timezone: loc.timezone ?? "UTC",
      is_default: loc.is_default,
    });
    setShowLocationForm(true);
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("Remove this location?")) return;
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete location");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading organization...</div>;
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

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg max-w-2xl">{error}</div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">Organization Settings</h1>
          <p className="text-slate-500 mt-2">Manage your organization's profile and locations.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Information
          </h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Organization Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  name="primary_email"
                  value={formData.primary_email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  name="primary_phone"
                  value={formData.primary_phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Street Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="address_street"
                value={formData.address_street}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
              <input
                type="text"
                name="address_city"
                value={formData.address_city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">State/Region</label>
              <input
                type="text"
                name="address_region"
                value={formData.address_region}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ZIP</label>
              <input
                type="text"
                name="address_postal_code"
                value={formData.address_postal_code}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Timezone</label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-orange-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern (US)</option>
              <option value="America/Chicago">Central (US)</option>
              <option value="America/Denver">Mountain (US)</option>
              <option value="America/Los_Angeles">Pacific (US)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-500 to-orange-600">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Locations</h2>
          <Button
            size="sm"
            onClick={() => { resetLocationForm(); setShowLocationForm(true); }}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Location
          </Button>
        </div>

        {showLocationForm && (
          <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
            <h3 className="font-semibold text-slate-900">{editingLocationId ? "Edit Location" : "New Location"}</h3>
            <input
              type="text"
              placeholder="Location name"
              value={locationForm.name}
              onChange={(e) => setLocationForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
            <input
              type="text"
              placeholder="Street address"
              value={locationForm.address_street}
              onChange={(e) => setLocationForm((f) => ({ ...f, address_street: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                value={locationForm.address_city}
                onChange={(e) => setLocationForm((f) => ({ ...f, address_city: e.target.value }))}
                className="px-3 py-2 border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Region"
                value={locationForm.address_region}
                onChange={(e) => setLocationForm((f) => ({ ...f, address_region: e.target.value }))}
                className="px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={locationForm.is_default}
                onChange={(e) => setLocationForm((f) => ({ ...f, is_default: e.target.checked }))}
              />
              Default location
            </label>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveLocation} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={resetLocationForm}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {locations.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No locations configured yet.</p>
          ) : (
            locations.map((loc) => (
              <div key={loc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">
                    {loc.name}
                    {loc.is_default && <span className="ml-2 text-xs text-orange-600">(Default)</span>}
                  </p>
                  <p className="text-sm text-slate-500">
                    {[loc.address_street, loc.address_city].filter(Boolean).join(", ") || "No address"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditLocation(loc)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteLocation(loc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
