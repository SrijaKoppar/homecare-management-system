import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";

import Login from "./pages/Login";
import PeopleList from "./pages/people/PeopleList";
import PersonProfile from "./pages/people/PersonProfile";
import InvitePerson from "./pages/people/InvitePerson";

import Schedule from "./pages/schedule/Schedule";
import NewVisit from "./pages/schedule/NewVisit";
import Assign24x7 from "./pages/schedule/Assign24x7";

import VisitInProgress from "./pages/visits/VisitInProgress";
import Assignment24x7 from "./pages/visits/Assignment24x7";

import Messages from "./pages/messages/Messages";
import MessageThread from "./pages/messages/MessageThread";

import Profile from "./pages/settings/Profile";
import OrganizationSettings from "./pages/settings/OrganizationSettings";

import CarePlanDetail from "./pages/careplans/CarePlanDetail";

import { PatientsLanding } from "./components/PatientsLanding";
import { NewPatient } from "./components/NewPatient";
import { ViewModifyPatients } from "./components/ViewModifyPatients";

import { CaregiverLanding } from "./components/CaregiverLanding";
import { NewCaregiver } from "./components/NewCaregiver";
import { ViewModifyCaregivers } from "./components/ViewModifyCaregivers";

import { StatCard } from "./components/StatCard";
import { UpcomingSchedules } from "./components/UpcomingSchedules";
import { PendingLeaveRequests } from "./components/PendingLeaveRequests";
import { Users, UserCheck, Calendar, FileText } from "lucide-react";

import "./App.css";

function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
          Welcome back, Admin
        </h1>
        <p className="text-slate-500 mt-2">
          Here's what's happening with your home care operations today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Active Patients"
          value={124}
          change={{ value: "+12%", trend: "up" }}
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
          change={{ value: "+8%", trend: "up" }}
          icon={Calendar}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
        />
        <StatCard
          title="Pending Leave Requests"
          value={3}
          icon={FileText}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <UpcomingSchedules />
        </div>
        <div>
          <PendingLeaveRequests />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/" element={<DashboardLayout />}>

        <Route index element={<DashboardPage />} />

        <Route path="patients" element={<PatientsLanding />} />
        <Route path="patients/new" element={<NewPatient />} />
        <Route path="patients/view" element={<ViewModifyPatients />} />

        <Route path="caregivers" element={<CaregiverLanding />} />
        <Route path="caregivers/new" element={<NewCaregiver />} />
        <Route path="caregivers/view" element={<ViewModifyCaregivers />} />

        <Route path="people" element={<PeopleList />} />
        <Route path="people/:id" element={<PersonProfile />} />
        <Route path="invite" element={<InvitePerson />} />

        <Route path="schedule" element={<Schedule />} />
        <Route path="schedule/new" element={<NewVisit />} />
        <Route path="schedule/assign24x7" element={<Assign24x7 />} />

        <Route path="visit/:id" element={<VisitInProgress />} />
        <Route path="assignment24x7" element={<Assignment24x7 />} />

        <Route path="careplan" element={<CarePlanDetail />} />

        <Route path="messages" element={<Messages />} />
        <Route path="messages/:id" element={<MessageThread />} />

        <Route path="profile" element={<Profile />} />
        <Route path="organization" element={<OrganizationSettings />} />

      </Route>

    </Routes>
  );
}

export default App;
