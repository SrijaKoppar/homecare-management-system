import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { RequireAuth, RedirectIfAuthed } from "./components/RequireAuth";

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
import { listAssignments24x7, type Assignment24x7 as Assignment24x7Record } from "./lib/assignments24x7Api";
import { Clock, ArrowRight, Users, UserCheck, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { listPersons } from "./lib/personsApi";
import { listLeaveRequests } from "./lib/leaveRequestsApi";
import { apiHeaders, apiUrl } from "./config/api";

import "./App.css";

function DashboardPage() {
  const navigate = useNavigate();
  const displayName = localStorage.getItem("display_name") || "there";
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");

  const [patientCount, setPatientCount] = useState(0);
  const [todayShifts, setTodayShifts] = useState(0);
  const [caregiverCount, setCaregiverCount] = useState(0);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const [active247, setActive247] = useState<Assignment24x7Record | null>(null);

  const loadPendingLeaveCount = async () => {
    try {
      const leaves = await listLeaveRequests("pending");
      setPendingLeaveCount(leaves.length);
    } catch (error) {
      console.error("Failed to load pending leave count:", error);
    }
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [patients, caregivers] = await Promise.all([
          listPersons({ role: "care_recipient" }),
          listPersons({ role: "caregiver" }),
        ]);

        setPatientCount(patients.length);
        setCaregiverCount(caregivers.length);

        const response = await fetch(
          apiUrl("/api/v1/visits"),
          {
            headers: apiHeaders(),
          }
        );

        if (response.ok) {
          const visits = await response.json();

          const today = new Date().toISOString().split("T")[0];

          const todaysVisits = visits.filter((visit: { scheduled_start?: string; start_time?: string }) => {
            const visitDate =
              visit.scheduled_start?.split("T")[0] ||
              visit.start_time?.split("T")[0];

            return visitDate === today;
          });

          setTodayShifts(todaysVisits.length);
        }

        if (userRole === "caregiver" && userId) {
          const assignments = await listAssignments24x7({ caregiver_id: userId });
          const active = assignments.find((a) => a.status === "active") ?? null;
          setActive247(active);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    }

    loadDashboardData();
    loadPendingLeaveCount();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
          Welcome back, {displayName.split(" ")[0]}
        </h1>
        <p className="text-slate-500 mt-2">
          Here's what's happening with your home care operations today.
        </p>
      </div>

      {active247 && (
        <div
          onClick={() => navigate("/assignment24x7")}
          className="cursor-pointer bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 hover:shadow-md transition-smooth"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Current 24/7 Assignment</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Active since {active247.start_date} · {active247.type} assignment
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-purple-500" />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Active Patients"
          value={patientCount}
          change={{ value: "+12%", trend: "up" }}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />

        <StatCard
          title="Available Caregivers"
          value={caregiverCount}
          icon={UserCheck}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100"
        />

        <StatCard
          title="Today's Shifts"
          value={todayShifts}
          change={{ value: "+8%", trend: "up" }}
          icon={Calendar}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
        />

        <StatCard
          title="Pending Leave Requests"
          value={pendingLeaveCount}
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
          <PendingLeaveRequests onStatusChanged={loadPendingLeaveCount} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>

      <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />

      <Route element={<RequireAuth />}>
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
        <Route path="schedule/:id/edit" element={<NewVisit />} />
        <Route path="schedule/assign24x7" element={<Assign24x7 />} />

        <Route path="visit/:id" element={<VisitInProgress />} />
        <Route path="assignment24x7" element={<Assignment24x7 />} />

        <Route path="careplan" element={<CarePlanDetail />} />

        <Route path="messages" element={<Messages />} />
        <Route path="messages/:id" element={<MessageThread />} />

        <Route path="profile" element={<Profile />} />
        <Route path="organization" element={<OrganizationSettings />} />

      </Route>

      </Route>
    </Routes>
  );
}

export default App;
