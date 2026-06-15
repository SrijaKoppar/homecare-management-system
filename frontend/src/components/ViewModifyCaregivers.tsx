import { useEffect, useState } from 'react';
import { Search, Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { deletePerson, listPersons, type Person } from '../lib/personsApi';
import { useNavigate } from 'react-router-dom';

type Caregiver = Person;

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
      const all = await listPersons({ role: 'caregiver', search });
      const term = search.trim().toLowerCase();
      const filtered = term
        ? all.filter((p) => {
            const name = (p.display_name ?? `${p.first_name} ${p.last_name}`).toLowerCase();
            return name.includes(term) || p.email.toLowerCase().includes(term);
          })
        : all;
      const pageSize = 20;
      const start = (page - 1) * pageSize;
      setCaregivers(filtered.slice(start, start + pageSize));
      setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
    } catch (err) {
      console.error(err);
      setCaregivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const deleteCaregiver = async (id: string) => {
    if (!confirm('Delete caregiver?')) return;
    try {
      await deletePerson(id);
      fetchCaregivers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
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
                  {c.display_name || `${c.first_name} ${c.last_name}`}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {c.email ?? '—'} {c.phone ? `• ${c.phone}` : ''}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/people/${c.id}`)}
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
