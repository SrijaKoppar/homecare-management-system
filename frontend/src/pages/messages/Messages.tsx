import { useNavigate } from "react-router-dom";
import { MessageSquarePlus, Search, MessageCircle } from "lucide-react";
import { useState } from "react";

interface MessageThread {
  id: number;
  name: string;
  last: string;
  unread: number;
  time: string;
  avatar: string;
}

export default function Messages() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const threads: MessageThread[] = [
    {
      id: 1,
      name: "Mary's Care Circle",
      last: "Visit completed successfully.",
      unread: 2,
      time: "10:30 AM",
      avatar: "👥",
    },
    {
      id: 2,
      name: "John Smith",
      last: "See you tomorrow at 10 AM.",
      unread: 0,
      time: "Yesterday",
      avatar: "👤",
    },
    {
      id: 3,
      name: "Jane Doe",
      last: "Task completed - medication given",
      unread: 1,
      time: "2 hours ago",
      avatar: "👩‍⚕️",
    },
  ];

  const filtered = threads.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || (filter === "Care circle" && t.name.includes("Care")) || (filter === "Direct" && !t.name.includes("Care"));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
            Messages
          </h1>
          <p className="text-slate-500 mt-1">
            Communicate with care circles and staff.
          </p>
        </div>

        <button
          onClick={() => navigate("/messages/new")}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-lg font-medium transition-smooth"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Message
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {["All", "Care circle"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-smooth ${
                filter === tab
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Thread List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((thread) => (
            <div
              key={thread.id}
              onClick={() => navigate(`/messages/${thread.id}`)}
              className="cursor-pointer bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-smooth group"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {thread.avatar}
                  </div>

                  {/* Message Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-smooth">
                        {thread.name}
                      </h3>
                      {thread.unread > 0 && (
                        <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {thread.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate mt-1">
                      {thread.last}
                    </p>
                  </div>
                </div>

                {/* Time & Arrow */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400">{thread.time}</span>
                  <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-smooth">
                    →
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-slate-200">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium text-slate-600">No messages found</p>
            <p className="text-sm text-slate-500 mt-1">Start a new conversation or check your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
