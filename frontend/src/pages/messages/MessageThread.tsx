import { useState } from "react";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
  avatar: string;
}

export default function MessageThread() {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Jane Doe",
      text: "Starting visit now.",
      time: "10:15 AM",
      isOwn: false,
      avatar: "👩‍⚕️",
    },
    {
      id: 2,
      sender: "You",
      text: "Thanks for the update.",
      time: "10:16 AM",
      isOwn: true,
      avatar: "👤",
    },
    {
      id: 3,
      sender: "Jane Doe",
      text: "All tasks completed. Mary is doing well.",
      time: "11:45 AM",
      isOwn: false,
      avatar: "👩‍⚕️",
    },
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "You",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      avatar: "👤",
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
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
            Mary's Care Circle
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            {!msg.isOwn && (
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-sm flex-shrink-0">
                {msg.avatar}
              </div>
            )}

            <div className={`flex flex-col gap-1 max-w-xs ${msg.isOwn ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 rounded-lg ${
                  msg.isOwn
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none"
                    : "bg-white border border-slate-200 text-slate-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
              </div>
              <p className={`text-xs ${msg.isOwn ? "text-slate-500 text-right" : "text-slate-500"}`}>
                {msg.time}
              </p>
            </div>

            {msg.isOwn && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-sm flex-shrink-0">
                👤
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t border-slate-200 bg-white p-6">
        <div className="flex gap-3">
          <button className="p-2.5 hover:bg-slate-100 rounded-lg transition-smooth text-slate-600">
            <Paperclip className="h-5 w-5" />
          </button>
          
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-smooth"
          />

          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
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
