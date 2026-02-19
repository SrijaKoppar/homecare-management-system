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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Patients
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage care recipients within your organization.
          </p>
        </div>

        <Button
          onClick={() => navigate('/patients/new')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          <Plus size={16} />
          Add Patient
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 max-w-md">
        <Search size={16} className="text-slate-500" />
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      {/* List */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">

        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No patients found.</div>
        ) : (
          patients.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {p.name}
                </div>
                <div className="text-sm text-slate-500">
                  {p.email} • {p.phone}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Caregiver: {p.assignedCaregiver || 'None'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="flex items-center gap-1"
                >
                  <Pencil size={14} />
                  View
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(p.id)}
                  className="flex items-center gap-1"
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
