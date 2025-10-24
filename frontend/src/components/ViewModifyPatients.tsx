import { useState } from 'react';
import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Search, User2, Mail, Phone, UserCog, Trash2, Eye } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  assignedCaregiver?: string;
}

const initialPatients: Patient[] = [
  { id: '1', name: 'John Doe', phone: '1234567890', email: 'john@example.com', assignedCaregiver: 'Sarah' },
  { id: '2', name: 'Jane Smith', phone: '9876543210', email: 'jane@example.com' },
];

export function ViewModifyPatients() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState('');

  const handleDelete = (id: string) => setPatients(patients.filter((p) => p.id !== id));
  const handleEdit = (id: string) => alert('🛠 Edit feature coming soon!');
  const handleViewCaregiver = (cg?: string) => alert(`👩‍⚕️ Assigned Caregiver: ${cg || 'None'}`);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
          🧾 View & Manage Patients
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View, edit, or remove patient records. Search by name or email below.
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-3xl mb-10 flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all">
        <Search className="text-slate-500 dark:text-slate-400 h-5 w-5 mr-2" />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-slate-700 dark:text-slate-200"
        />
      </div>

      {/* Patient Cards */}
      <div className="w-full max-w-5xl space-y-6">
        {filteredPatients.length === 0 ? (
          <p className="text-center text-slate-700 dark:text-slate-300 italic">
            No matching patients found.
          </p>
        ) : (
          filteredPatients.map((p) => (
            <Card
              key={p.id}
              className="p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1 space-y-2">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User2 className="text-emerald-500" size={20} />
                  {p.name}
                </CardTitle>
                <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-1 pl-1">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-emerald-500" />
                    <span>{p.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-emerald-500" />
                    <span>{p.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <UserCog size={14} className="text-emerald-500" />
                    <span className="font-medium">
                      Caregiver:
                    </span>{' '}
                    {p.assignedCaregiver || 'None'}
                  </p>
                </CardContent>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  onClick={() => handleEdit(p.id)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                >
                  <Eye size={14} />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(p.id)}
                  className="shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
                <Button
                  onClick={() => handleViewCaregiver(p.assignedCaregiver)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                >
                  <UserCog size={14} />
                  View Caregiver
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
