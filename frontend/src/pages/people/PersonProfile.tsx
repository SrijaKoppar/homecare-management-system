export default function PersonProfile() {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Mary Smith</h2>
  
        <div className="border p-4 rounded mb-4">
          <p><strong>Role:</strong> Care Recipient</p>
          <p><strong>Care Arrangement:</strong> Visits Only</p>
          <p><strong>24/7 Caregiver:</strong> Jane Doe</p>
        </div>
  
        <div className="border p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Care Circle</h3>
          <p>John Smith – Primary contact</p>
          <p>Jane Doe – Caregiver</p>
        </div>
  
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Care Plan</h3>
          <p>Post-hospital recovery</p>
        </div>
      </div>
    );
  }