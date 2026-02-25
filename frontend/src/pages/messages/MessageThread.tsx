export default function MessageThread() {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Mary's Care Circle
        </h2>
  
        <div className="space-y-3 mb-4">
          <div className="bg-gray-100 p-3 rounded">
            Jane: Starting visit now.
          </div>
          <div className="bg-blue-100 p-3 rounded">
            You: Thanks for the update.
          </div>
        </div>
  
        <div className="flex">
          <input
            className="flex-1 border p-2 rounded-l"
            placeholder="Type a message..."
          />
          <button className="bg-blue-600 text-white px-4 rounded-r">
            Send
          </button>
        </div>
      </div>
    );
  }