export default function InvitePerson() {
    return (
      <div className="p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Invite Person
        </h2>
  
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Email"
        />
  
        <select className="w-full border p-2 rounded mb-3">
          <option>Family editor</option>
          <option>Caregiver</option>
          <option>Viewer</option>
        </select>
  
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Send Invite
        </button>
      </div>
    );
  }