import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

const peopleData = [
  { id: 1, name: "Mary Smith", role: "Care Recipient" },
  { id: 2, name: "John Smith", role: "Family" },
  { id: 3, name: "Jane Doe", role: "Caregiver" },
];

export default function PeopleList() {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filtered =
    filter === "All"
      ? peopleData
      : peopleData.filter((p) => p.role === filter);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            People
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage recipients, family members, and caregivers.
          </p>
        </div>

        <button
          onClick={() => navigate("/invite")}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <UserPlus className="h-4 w-4" />
          Add Person
        </button>
      </div>

      {/* Filter */}
      <div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Care Recipient</option>
          <option>Family</option>
          <option>Caregiver</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((person) => (
          <div
            key={person.id}
            onClick={() => navigate(`/people/${person.id}`)}
            className="cursor-pointer border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-xl hover:shadow-md transition"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {person.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {person.role}
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-slate-500 text-sm">
            No people found.
          </div>
        )}
      </div>
    </div>
  );
}