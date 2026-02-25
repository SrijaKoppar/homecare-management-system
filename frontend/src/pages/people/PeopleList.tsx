import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search, Users } from "lucide-react";

interface Person {
  id: number;
  name: string;
  role: "Care Recipient" | "Family" | "Caregiver";
  subtitle: string;
  avatar?: string;
}

const peopleData: Person[] = [
  { id: 1, name: "Mary Smith", role: "Care Recipient", subtitle: "Mom · 123 Oak St" },
  { id: 2, name: "John Smith", role: "Family", subtitle: "john@email.com · Primary contact" },
  { id: 3, name: "Jane Doe", role: "Caregiver", subtitle: "Assigned to Mary S." },
  { id: 4, name: "Alice Brown", role: "Caregiver", subtitle: "Available · Full-time" },
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Care Recipient":
      return "bg-blue-100 text-blue-700";
    case "Family":
      return "bg-purple-100 text-purple-700";
    case "Caregiver":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Care Recipient":
      return "👤";
    case "Family":
      return "👨‍👩‍👧";
    case "Caregiver":
      return "🏥";
    default:
      return "👤";
  }
};

export default function PeopleList() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filtered = peopleData.filter((p) => {
    const matchesFilter = filter === "All" || p.role === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
            People
          </h1>
          <p className="text-slate-500 mt-1">
            Manage recipients, family members, and caregivers.
          </p>
        </div>

        <button
          onClick={() => navigate("/invite")}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-lg font-medium transition-smooth"
        >
          <UserPlus className="h-4 w-4" />
          Add Person
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
          />
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:border-orange-500 transition-smooth"
        >
          <option>All</option>
          <option>Care Recipient</option>
          <option>Family</option>
          <option>Caregiver</option>
        </select>
      </div>

      {/* People Grid/List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((person) => (
            <div
              key={person.id}
              onClick={() => navigate(`/people/${person.id}`)}
              className="cursor-pointer bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-smooth group"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center text-lg flex-shrink-0 group-hover:shadow-md transition-smooth">
                    {getRoleIcon(person.role)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-smooth">
                      {person.name}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {person.subtitle}
                    </p>
                  </div>
                </div>

                {/* Badge & Action */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(person.role)}`}>
                    {person.role}
                  </span>
                  <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-smooth">
                    →
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-slate-200">
            <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium text-slate-600">No people found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
