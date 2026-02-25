export default function OrganizationSettings() {
    return (
      <div className="p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Organization Settings
        </h2>
  
        <input className="w-full border p-2 rounded mb-3" placeholder="Organization Name" />
        <input className="w-full border p-2 rounded mb-3" placeholder="Phone" />
        <input className="w-full border p-2 rounded mb-3" placeholder="Address" />
  
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    );
  }