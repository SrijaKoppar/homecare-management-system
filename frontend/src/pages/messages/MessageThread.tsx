import { useEffect, useState } from "react";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getConversation, listMessages, sendMessage, type Conversation, type Message } from "../../lib/messagesApi";
import { listPersons, type Person } from "../../lib/personsApi";
import { notifyError } from "../../lib/notify";

export default function MessageThread() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUserId = localStorage.getItem("user_id");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [people, setPeople] = useState<Record<string, Person>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const loadThread = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [conv, msgs, persons] = await Promise.all([
        getConversation(id),
        listMessages(id),
        listPersons(),
      ]);
      setConversation(conv);
      setMessages(msgs);
      setPeople(Object.fromEntries(persons.map((person) => [person.id, person])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThread();
  }, [id]);

  const handleSendMessage = async () => {
    if (!id || !messageText.trim() || sending) return;
    setSending(true);
    try {
      const sent = await sendMessage(id, messageText.trim());
      setMessages((prev) => [...prev, sent]);
      setMessageText("");
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const senderName = (senderId: string) => {
    if (senderId === currentUserId) return "You";
    const person = people[senderId];
    return person?.display_name || (person ? `${person.first_name} ${person.last_name}` : "Unknown");
  };

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="border-b border-slate-200 p-6 bg-white">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/messages")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-smooth"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900 text-center flex-1 text-balance-heading">
            {conversation?.title || (conversation?.type === "direct" ? "Direct Message" : "Care Circle")}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading messages...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-600 bg-white rounded-xl border border-red-200">{error}</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">No messages yet.</div>
        ) : messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
          <div
            key={msg.id}
            className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
          >
            {!isOwn && (
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-sm flex-shrink-0">
                {senderName(msg.sender_id).slice(0, 1)}
              </div>
            )}

            <div className={`flex flex-col gap-1 max-w-xs ${isOwn ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 rounded-lg ${
                  isOwn
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none"
                    : "bg-white border border-slate-200 text-slate-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm break-words">{msg.body}</p>
              </div>
              <p className={`text-xs ${isOwn ? "text-slate-500 text-right" : "text-slate-500"}`}>
                {senderName(msg.sender_id)} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {isOwn && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-sm flex-shrink-0">
                👤
              </div>
            )}
          </div>
        )})}
      </div>

      {/* Message Input */}
      <div className="border-t border-slate-200 bg-white p-6">
        <div className="flex gap-3">
          <button
            type="button"
            disabled
            className="p-2.5 rounded-lg text-slate-300 cursor-not-allowed"
            title="Attachments are not available in MVP"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
          />

          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sending}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-lg font-medium transition-smooth"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
