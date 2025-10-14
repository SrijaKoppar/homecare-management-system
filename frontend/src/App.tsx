import { DashboardLayout } from './components/DashboardLayout';
import { StatCard } from './components/StatCard';
import { UpcomingSchedules } from './components/UpcomingSchedules';
import { PendingLeaveRequests } from './components/PendingLeaveRequests';
import { Users, UserCheck, Calendar, FileText } from 'lucide-react';
import './App.css';

function App() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" style={{ animationDelay: '0.1s' }}>
          <StatCard
            title="Active Patients"
            value={124}
            change={{ value: '+12%', trend: 'up' }}
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatCard
            title="Available Caregivers"
            value={38}
            icon={UserCheck}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-100"
          />
          <StatCard
            title="Today's Shifts"
            value={42}
            change={{ value: '+8%', trend: 'up' }}
            icon={Calendar}
            iconColor="text-amber-600"
            iconBgColor="bg-amber-100"
          />
          <StatCard
            title="Pending Leave Requests"
            value={3}
            icon={FileText}
            iconColor="text-rose-600"
            iconBgColor="bg-rose-100"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <UpcomingSchedules />
          <PendingLeaveRequests />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;
