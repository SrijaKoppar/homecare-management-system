export default function Assignment24x7() {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Mary Smith · 24/7 Assignment
        </h2>
  
        <div className="border p-4 rounded mb-4">
          <p>Today's Tasks</p>
          <ul className="list-disc ml-5 mt-2">
            <li>Morning routine</li>
            <li>Medication round</li>
            <li>Lunch assistance</li>
          </ul>
        </div>
  
        <textarea
          className="w-full border rounded p-2"
          placeholder="Add daily note..."
        />
  
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Save Note
        </button>
      </div>
    );
  }