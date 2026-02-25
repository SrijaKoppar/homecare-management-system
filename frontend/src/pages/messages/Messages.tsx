import { useNavigate } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";

export default function Messages() {
  const navigate = useNavigate();

  const threads = [
    {
      id: 1,
      name: "Mary's Care Circle",
      last: "Visit completed successfully.",
      unread: 2,
      time: "10:30 AM",
    },
    {
      id: 2,
      name: "John Smith",
      last: "See you tomorrow at 10 AM.",
      unread: 0,
      time: "Yesterday",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Messages
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Communicate with care circles and staff.
          </p>
        </div>

        <button
          onClick={() => navigate("/messages/new")}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Message
        </button>
      </div>

      {/* Thread List */}
      <div className="space-y-3">
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => navigate(`/messages/${thread.id}`)}
            className="cursor-pointer border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-xl hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {thread.name}
              </h3>

              <span className="text-xs text-slate-500">
                {thread.time}
              </span>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {thread.last}
            </p>

            {thread.unread > 0 && (
              <span className="inline-block mt-2 text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">
                {thread.unread} unread
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}