import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit, Calendar, Heart, FileText, Plus } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { getPerson, updatePerson, listPersons, roleLabel, type Person, type PersonRole } from "../../lib/personsApi";
import { listCareRelationships, createCareRelationship, updateCareRelationship, listCareArrangements, type CareRelationship, type CareArrangement } from "../../lib/careApi";
import { listTasks, type Task } from "../../lib/tasksApi";
import { format } from "date-fns";

function SideCard({
  icon,
  title,
  body,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  sub: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <SideCardHeader icon={icon} title={title} />
      <p className="text-lg font-semibold text-slate-900 mb-2">{body}</p>
      <p className="text-sm text-slate-500">{sub}</p>
    </div>
  );
}
function SideCardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
  );
}

export default function PersonProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [relationships, setRelationships] = useState<(CareRelationship & { related_person?: Person })[]>([]);
  const [arrangements, setArrangements] = useState<CareArrangement[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addMemberForm, setAddMemberForm] = useState({
    related_user_id: "",
    role: "family_viewer",
    is_24x7_caregiver: false,
  });

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    phone: "",
    role: "" as PersonRole | "",
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [personData, relsData, allPersons, arrsData, tasksData] = await Promise.all([
          getPerson(id),
          listCareRelationships(id),
          listPersons(),
          listCareArrangements(id),
          listTasks({ care_recipient_id: id })
        ]);
        setPerson(personData);
        setEditForm({
          first_name: personData.first_name,
          last_name: personData.last_name,
          display_name: personData.display_name ?? "",
          phone: personData.phone ?? "",
          role: personData.role ?? "",
        });

        const mappedRels = relsData.map(rel => {
          const related = allPersons.find(p => p.id === rel.related_user_id);
          return { ...rel, related_person: related };
        });
        setRelationships(mappedRels);
        setAllPersons(allPersons);
        setArrangements(arrsData);
        setTasks(tasksData);
      } catch (err) {
        console.error(err);
        setPerson(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSaveProfile = async () => {
    if (!id || !editForm.first_name.trim() || !editForm.last_name.trim()) {
      alert("First and last name are required");
      return;
    }
    setSaving(true);
    try {
      const updated = await updatePerson(id, {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        display_name: editForm.display_name.trim() || undefined,
        phone: editForm.phone.trim() || undefined,
        ...(editForm.role ? { role: editForm.role as PersonRole } : {}),
      });
      setPerson(updated);
      setEditOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!id || !addMemberForm.related_user_id) {
      alert("Please select a person to add");
      return;
    }
    setSaving(true);
    try {
      const rel = await createCareRelationship({
        care_recipient_id: id,
        related_user_id: addMemberForm.related_user_id,
        organization_id: localStorage.getItem("organization_id") || "00000000-0000-0000-0000-000000000000",
        role: addMemberForm.role,
        is_24x7_caregiver: addMemberForm.is_24x7_caregiver,
        status: 'active'
      });
      
      const related = allPersons.find(p => p.id === rel.related_user_id);
      
      if (addMemberForm.is_24x7_caregiver) {
        setRelationships(prev => [
          ...prev.map(r => ({ ...r, is_24x7_caregiver: false })),
          { ...rel, related_person: related }
        ]);
      } else {
        setRelationships(prev => [...prev, { ...rel, related_person: related }]);
      }
      
      setAddMemberOpen(false);
      setAddMemberForm({ related_user_id: "", role: "family_viewer", is_24x7_caregiver: false });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateRelationship = async (relId: string) => {
    if (!confirm("Remove this care circle member?")) return;
    setSaving(true);
    try {
      await updateCareRelationship(relId, { status: "ended" });
      setRelationships((prev) => prev.filter((r) => r.id !== relId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setSaving(false);
    }
  };

  const get24x7Caregiver = () => {
    const cg = relationships.find(r => r.is_24x7_caregiver && r.status === 'active');
    if (!cg) return "None";
    return cg.related_person?.display_name || "Unknown Caregiver";
  };

  const formatRole = (role: string) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  }

  if (!person) {
    return <div className="p-8 text-center text-red-500">Person not found.</div>;
  }

  const activeRels = relationships.filter(r => r.status === 'active');
  const activeArrangement = arrangements.find(a => !a.effective_to);
  const modeDisplay = activeArrangement 
    ? activeArrangement.mode.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : "None";
  const arrangementDate = activeArrangement 
    ? `From: ${format(new Date(activeArrangement.effective_from), 'MMM d, yyyy')}` 
    : "No active arrangement";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/people")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-smooth"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
            👤
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
              {person.display_name || `${person.first_name} ${person.last_name}`}
            </h1>
            <p className="text-slate-500 mt-1">
              {person.email}
              {person.phone ? ` · ${person.phone}` : ""}
            </p>
            <p className="text-sm text-slate-400 mt-1 capitalize">
              Status: {person.status}
              {person.role ? ` · ${roleLabel(person.role)}` : ""}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pb-8 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
              Membership
            </h3>
            <p className="text-lg font-semibold text-slate-900">
              {person.role ? roleLabel(person.role) : "No role"}
            </p>
            <p className="text-sm text-slate-500 mt-1 capitalize">
              Status: {person.membership_status || "Unknown"}
            </p>
            {person.title && (
              <p className="text-sm text-slate-500 mt-1">Title: {person.title}</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
              Care Arrangement
            </h3>
            <p className="text-lg font-semibold text-slate-900">{modeDisplay}</p>
            <p className="text-sm text-slate-500 mt-3">{arrangementDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
              24/7 Caregiver
            </h3>
            <p className="text-lg font-semibold text-slate-900">{get24x7Caregiver()}</p>
            <p className="text-sm text-slate-500 mt-1">(Current)</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Care Circle
          </h2>
          <button 
            type="button" 
            onClick={() => setAddMemberOpen(true)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>
        <div className="space-y-4">
          {activeRels.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-center">
              No care relationships found.
            </div>
          ) : (
            activeRels.map(rel => (
              <div key={rel.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">
                    {rel.related_person?.display_name || "Unknown User"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatRole(rel.role)} {rel.is_24x7_caregiver ? '· 24/7' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {rel.is_24x7_caregiver && (
                    <Badge className="bg-purple-100 text-purple-700 border-0">24/7</Badge>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleDeactivateRelationship(rel.id)} disabled={saving}>
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SideCard
          icon={<FileText className="h-5 w-5 text-slate-400" />}
          title="Care Plan"
          body={`${tasks.length} active tasks`}
          sub="Stored as individual tasks"
        />
        <SideCard
          icon={<Calendar className="h-5 w-5 text-slate-400" />}
          title="Next Visit"
          body="Pending Integration"
          sub=""
        />
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">First name</span>
              <input
                type="text"
                value={editForm.first_name}
                onChange={(e) => setEditForm((f) => ({ ...f, first_name: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Last name</span>
              <input
                type="text"
                value={editForm.last_name}
                onChange={(e) => setEditForm((f) => ({ ...f, last_name: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Display name</span>
              <input
                type="text"
                value={editForm.display_name}
                onChange={(e) => setEditForm((f) => ({ ...f, display_name: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Phone</span>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Organization role</span>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value as PersonRole }))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                <option value="">Unchanged</option>
                <option value="care_recipient">Care Recipient</option>
                <option value="caregiver">Caregiver</option>
                <option value="family_viewer">Family Viewer</option>
                <option value="family_editor">Family Editor</option>
                <option value="supervisor">Supervisor</option>
                <option value="agency_admin">Agency Admin</option>
              </select>
            </label>
            <p className="text-sm text-slate-500">Email: {person.email} (not editable)</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Care Circle Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Select Person</span>
              <select
                value={addMemberForm.related_user_id}
                onChange={(e) => setAddMemberForm(f => ({ ...f, related_user_id: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                <option value="">Select a person...</option>
                {allPersons.filter(p => p.id !== id).map(p => (
                  <option key={p.id} value={p.id}>{p.display_name || `${p.first_name} ${p.last_name}`}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select
                value={addMemberForm.role}
                onChange={(e) => setAddMemberForm(f => ({ ...f, role: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                <option value="primary_contact">Primary Contact</option>
                <option value="backup_contact">Backup Contact</option>
                <option value="family_viewer">Family Viewer</option>
                <option value="nurse">Nurse</option>
                <option value="aide">Aide</option>
                <option value="companion">Companion</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={addMemberForm.is_24x7_caregiver}
                onChange={(e) => setAddMemberForm(f => ({ ...f, is_24x7_caregiver: e.target.checked }))}
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-slate-700">Is 24/7 Caregiver?</span>
            </label>
            {addMemberForm.is_24x7_caregiver && (
              <p className="text-xs text-orange-600">This will replace the current 24/7 caregiver if one exists.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={saving}>
              {saving ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
