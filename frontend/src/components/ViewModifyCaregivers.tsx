import { useState } from 'react';
import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Search, User2, Mail, Phone, Users, Trash2, Eye } from 'lucide-react';

interface Caregiver {
  id: string;
  name: string;
  phone: string;
  email: string;
  assignedPatients?: string[];
}

const initialCaregivers: Caregiver[] = [
  { id: '1', name: 'Sarah Johnson', phone: '9988776655', email: 'sarah@example.com', assignedPatients: ['John Doe'] },
  { id: '2', name: 'David Brown', phone: '9876543210', email: 'david@example.com', assignedPatients: [] },
];

export function ViewModifyCaregivers() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>(initialCaregivers);
  const [search, setSearch] = useState('');

  const handleDelete = (id: string) => setCaregivers(caregivers.filter((c) => c.id !== id));
  const handleEdit = (id: string) => alert('🛠 Edit feature coming soon!');
  const handleViewPatients = (patients?: string[]) =>
    alert(`🧾 Assigned Patients: ${patients && patients.length > 0 ? patients.join(', ') : 'None'}`);

  const filteredCaregivers = caregivers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900 py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-emerald-400 mb-2">
          👩‍⚕️ View & Manage Caregivers
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View, edit, or remove caregiver records. Search by name or email below.
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-3xl mb-10 flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all">
        <Search className="text-slate-500 dark:text-slate-400 h-5 w-5 mr-2" />
        <input
          type="text"
          placeholder="Search caregivers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-slate-700 dark:text-slate-200"
        />
      </div>

      {/* Caregiver Cards */}
      <div className="w-full max-w-5xl space-y-6">
        {filteredCaregivers.length === 0 ? (
          <p className="text-center text-slate-700 dark:text-slate-300 italic">
            No matching caregivers found.
          </p>
        ) : (
          filteredCaregivers.map((c) => (
            <Card
              key={c.id}
              className="p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1 space-y-2">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User2 className="text-blue-500" size={20} />
                  {c.name}
                </CardTitle>
                <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-1 pl-1">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-blue-500" />
                    <span>{c.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-blue-500" />
                    <span>{c.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users size={14} className="text-blue-500" />
                    <span className="font-medium">Assigned Patients:</span>{' '}
                    {c.assignedPatients && c.assignedPatients.length > 0
                      ? c.assignedPatients.join(', ')
                      : 'None'}
                  </p>
                </CardContent>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  onClick={() => handleEdit(c.id)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                >
                  <Eye size={14} />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(c.id)}
                  className="shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
                <Button
                  onClick={() => handleViewPatients(c.assignedPatients)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                >
                  <Users size={14} />
                  View Patients
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
