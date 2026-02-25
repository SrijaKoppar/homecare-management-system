export default function Assign24x7() {
    return (
      <div className="p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Assign 24/7 Caregiver
        </h2>
  
        <input className="w-full border p-2 rounded mb-3" placeholder="Recipient" />
        <input className="w-full border p-2 rounded mb-3" placeholder="Caregiver" />
        <input className="w-full border p-2 rounded mb-3" type="date" />
  
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    );
  }