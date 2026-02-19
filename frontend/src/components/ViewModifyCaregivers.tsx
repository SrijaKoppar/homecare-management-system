import React, { useEffect, useState } from 'react';
import { Search, Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { API_BASE } from '../config/api';
import { useNavigate } from 'react-router-dom';

type Caregiver = {
  id: number;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  email?: string | null;
  languages?: string | null;
};

export function ViewModifyCaregivers() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const navigate = useNavigate();

  const fetchCaregivers = async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE}/api/caregivers`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('per_page', '20');
      if (search.trim()) url.searchParams.set('search', search.trim());

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(await res.text());

      const json = await res.json();
      setCaregivers(json.items ?? []);
      setTotalPages(json.pages ?? null);
    } catch (err) {
      console.error(err);
      setCaregivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregivers();
    // eslint-disable-next-line
  }, [page]);

  const deleteCaregiver = async (id: number) => {
    if (!confirm('Delete caregiver?')) return;
    try {
      await fetch(`${API_BASE}/api/caregivers/${id}`, { method: 'DELETE' });
      fetchCaregivers();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Caregivers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage caregiver records and assignments.
          </p>
        </div>

        <Button
          onClick={() => navigate('/caregivers/new')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          <Plus size={16} />
          Add Caregiver
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
        <Button size="sm" onClick={() => { setPage(1); fetchCaregivers(); }}>
          Search
        </Button>
      </div>

      {/* List */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">

        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading caregivers...</div>
        ) : caregivers.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No caregivers found.</div>
        ) : (
          caregivers.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {c.first_name} {c.middle_name ?? ''} {c.last_name}
                </div>
                <div className="text-sm text-slate-500">
                  {c.email ?? '—'} • {c.phone ?? '—'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Languages: {c.languages ?? '—'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/caregivers/${c.id}`)}
                  className="flex items-center gap-1"
                >
                  <Pencil size={14} />
                  View
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteCaregiver(c.id)}
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

      {/* Pagination */}
      {totalPages !== null && totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-slate-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <Button size="sm" disabled={totalPages !== null && page >= totalPages} onClick={() => setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewModifyCaregivers;
