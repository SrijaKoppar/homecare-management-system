export default function Profile() {
    return (
      <div className="p-6 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
  
        <input className="w-full border p-2 rounded mb-3" placeholder="First Name" />
        <input className="w-full border p-2 rounded mb-3" placeholder="Last Name" />
        <input className="w-full border p-2 rounded mb-3" placeholder="Phone" />
  
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    );
  }