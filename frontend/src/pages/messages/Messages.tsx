import { useNavigate } from "react-router-dom";
import { MessageSquarePlus, Search, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { listConversations, createConversation, listMessages, listConversationParticipants, type Conversation } from "../../lib/messagesApi";
import { listPersons, type Person } from "../../lib/personsApi";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

interface ExtendedThread extends Conversation {
  lastMessage?: string;
  lastMessageTime?: string;
  participantsLabel?: string;
}

export default function Messages() {
  const navigate = useNavigate();
  const currentOrgId = localStorage.getItem("organization_id") || "00000000-0000-0000-0000-000000000000";
  const currentUserId = localStorage.getItem("user_id") || "00000000-0000-0000-0000-000000000000";

  const [threads, setThreads] = useState<ExtendedThread[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // New Thread Modal State
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadType, setNewThreadType] = useState<'direct' | 'care_circle' | 'group'>('direct');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadThreads = async () => {
      setLoading(true);
      try {
        const [convs, allPersons] = await Promise.all([
          listConversations(),
          listPersons()
        ]);
        setPersons(allPersons);

        // Fetch last message for each conversation
        const extended: ExtendedThread[] = await Promise.all(
          convs.map(async (c) => {
            try {
              const [msgs, participants] = await Promise.all([
                listMessages(c.id),
                listConversationParticipants(c.id),
              ]);
              const lastMsg = msgs[msgs.length - 1];

              let pLabel = c.title || "Chat Thread";
              if (!c.title) {
                const otherIds = participants
                  .map((p) => p.user_id)
                  .filter((uid) => uid !== currentUserId);
                const names = otherIds
                  .map((uid) => {
                    const person = allPersons.find((p) => p.id === uid);
                    return person?.display_name || (person ? `${person.first_name} ${person.last_name}` : null);
                  })
                  .filter(Boolean);
                if (names.length > 0) {
                  pLabel = names.join(", ");
                } else if (c.type === "direct") {
                  pLabel = "Direct Message";
                } else if (c.type === "care_circle") {
                  pLabel = "Care Circle";
                } else {
                  pLabel = "Group Chat";
                }
              }

              return {
                ...c,
                lastMessage: lastMsg ? lastMsg.body : "No messages yet.",
                lastMessageTime: lastMsg
                  ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : "",
                participantsLabel: pLabel
              };
            } catch {
              return c;
            }
          })
        );
        setThreads(extended);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };
    loadThreads();
  }, []);

  const handleCreateThread = async () => {
    if (selectedParticipants.length === 0) {
      alert("Please select at least one participant");
      return;
    }
    setSubmitting(true);
    try {
      // Find recipient user if care_circle type
      const recipient = newThreadType === 'care_circle' ? selectedParticipants[0] : null;

      const newConv = await createConversation({
        organization_id: currentOrgId,
        care_recipient_id: recipient,
        title: newThreadTitle.trim() || undefined,
        type: newThreadType,
        participants: selectedParticipants
      });
      setNewThreadOpen(false);
      navigate(`/messages/${newConv.id}`);
    } catch (err: any) {
      alert("Failed to start thread: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleParticipantSelection = (pId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(pId) ? prev.filter(id => id !== pId) : [...prev, pId]
    );
  };

  const filtered = threads.filter((t) => {
    const title = t.participantsLabel || t.title || "";
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.lastMessage && t.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === "All" ||
      (filter === "Care circle" && t.type === 'care_circle') ||
      (filter === "Direct" && t.type === 'direct');

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
          onClick={() => setNewThreadOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-lg font-medium transition-smooth shadow-sm hover:shadow"
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
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-55 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {["All", "Care circle", "Direct"].map((tab) => (
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
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading conversation threads...</div>
        ) : filtered.length > 0 ? (
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
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {thread.type === 'care_circle' ? "👥" : "👤"}
                  </div>

                  {/* Message Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-smooth">
                        {thread.participantsLabel || thread.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 truncate mt-1">
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>

                {/* Time & Arrow */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400">{thread.lastMessageTime}</span>
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
            <p className="font-medium text-slate-655 text-slate-600">No messages found</p>
            <p className="text-sm text-slate-500 mt-1">Start a new conversation or check your filters.</p>
          </div>
        )}
      </div>

      {/* New Conversation Dialog */}
      <Dialog open={newThreadOpen} onOpenChange={setNewThreadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Conversation Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Care Circle Group"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Thread Type</label>
              <select
                value={newThreadType}
                onChange={(e) => setNewThreadType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white"
              >
                <option value="direct">Direct Message (Private)</option>
                <option value="care_circle">Care Circle (Patient Scoped)</option>
                <option value="group">Group Chat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Recipients</label>
              <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50 p-1">
                {persons.filter(p => p.id !== currentUserId).map(p => (
                  <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(p.id)}
                      onChange={() => toggleParticipantSelection(p.id)}
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-slate-700">{p.display_name || `${p.first_name} ${p.last_name}`}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewThreadOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleCreateThread} disabled={submitting} className="bg-orange-500 hover:bg-orange-600">
              {submitting ? "Starting..." : "Start Chat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
