import React, { useEffect, useState } from 'react';
import { Search, Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { API_BASE } from '../config/api';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  assignedCaregiver?: string | null;
}

export function ViewModifyPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadPatients = async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE}/api/patients`);
      if (search.trim()) url.searchParams.set('search', search.trim());
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setPatients(json.items ?? json ?? []);
    } catch (err) {
      console.error(err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete patient?')) return;
    try {
      await fetch(`${API_BASE}/api/patients/${id}`, { method: 'DELETE' });
      loadPatients();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
            Patients
          </h1>
          <p className="text-slate-500 mt-1">
            Manage care recipients within your organization.
          </p>
        </div>

        <Button
          onClick={() => navigate('/patients/new')}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={16} />
          Add Patient
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 max-w-md hover:border-slate-300 transition-smooth focus-within:border-orange-500 focus-within:bg-white">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder-slate-400"
        />
      </div>

      {/* List */}
      <div className="space-y-3">

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"></div>
            Loading patients...
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">No patients found.</div>
        ) : (
          patients.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-smooth flex justify-between items-center gap-4 group"
            >
              <div className="flex-1">
                <div className="font-semibold text-slate-900">
                  {p.name}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {p.email} • {p.phone}
                </div>
                <div className="text-xs text-slate-500 mt-2 bg-slate-50 w-fit px-2 py-1 rounded">
                  Assigned: {p.assignedCaregiver || 'Unassigned'}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="flex items-center gap-1 border-slate-200 hover:bg-slate-50"
                >
                  <Pencil size={14} />
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(p.id)}
                  className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewModifyPatients;
