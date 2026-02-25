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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
            Caregivers
          </h1>
          <p className="text-slate-500 mt-1">
            Manage caregiver records and assignments.
          </p>
        </div>

        <Button
          onClick={() => navigate('/caregivers/new')}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={16} />
          Add Caregiver
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
        <Button size="sm" onClick={() => { setPage(1); fetchCaregivers(); }} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
          Search
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"></div>
            Loading caregivers...
          </div>
        ) : caregivers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">No caregivers found.</div>
        ) : (
          caregivers.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-smooth flex justify-between items-center gap-4 group"
            >
              <div className="flex-1">
                <div className="font-semibold text-slate-900">
                  {c.first_name} {c.middle_name ?? ''} {c.last_name}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {c.email ?? '—'} • {c.phone ?? '—'}
                </div>
                <div className="text-xs text-slate-500 mt-2 bg-slate-50 w-fit px-2 py-1 rounded">
                  Languages: {c.languages ?? 'Not specified'}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/caregivers/${c.id}`)}
                  className="flex items-center gap-1 border-slate-200 hover:bg-slate-50"
                >
                  <Pencil size={14} />
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteCaregiver(c.id)}
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

      {/* Pagination */}
      {totalPages !== null && totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-slate-500 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <span className="font-medium">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="border-slate-200 hover:bg-slate-100" variant="outline">
              Prev
            </Button>
            <Button size="sm" disabled={totalPages !== null && page >= totalPages} onClick={() => setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))} className="border-slate-200 hover:bg-slate-100" variant="outline">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewModifyCaregivers;
