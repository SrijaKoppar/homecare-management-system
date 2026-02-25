import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  UserPlus,
  ClipboardList,
  Calendar,
  Clock,
  MessageSquare,
} from "lucide-react";

function ActionCard({
  title,
  description,
  icon,
  ctaLabel,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaLabel: string;
  onClick: () => void;
}) {
  return (
    <Card className="p-8 flex flex-col items-center text-center gap-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl">
          {icon}
        </div>

        <CardTitle className="text-lg font-bold text-slate-900">
          {title}
        </CardTitle>

        <p className="text-slate-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <Button
        onClick={onClick}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium"
      >
        {ctaLabel}
      </Button>
    </Card>
  );
}

export function CaregiverLanding() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-balance-heading">
          Caregiver Management
        </h1>
        <p className="text-slate-500 mt-1">
          Manage caregiver registrations, schedules, assignments, and communication.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">

        {/* Register */}
        <ActionCard
          title="New Caregiver Registration"
          description="Register a new caregiver with qualifications, availability, and contact details."
          icon={<UserPlus className="h-6 w-6 text-white" />}
          ctaLabel="Register Caregiver"
          onClick={() => navigate("/caregivers/new")}
        />

        {/* View */}
        <ActionCard
          title="View & Manage Caregivers"
          description="View, edit, and manage caregiver profiles and assignments."
          icon={<ClipboardList className="h-6 w-6 text-white" />}
          ctaLabel="View Caregivers"
          onClick={() => navigate("/caregivers/view")}
        />

        {/* Schedule */}
        <ActionCard
          title="Caregiver Schedules"
          description="View caregiver visits, shifts, and daily schedules."
          icon={<Calendar className="h-6 w-6 text-white" />}
          ctaLabel="View Schedule"
          onClick={() => navigate("/schedule")}
        />

        {/* 24/7 Assignment */}
        <ActionCard
          title="24/7 Assignments"
          description="Assign or manage continuous caregiver assignments."
          icon={<Clock className="h-6 w-6 text-white" />}
          ctaLabel="Assign 24/7"
          onClick={() => navigate("/schedule/assign24x7")}
        />

        {/* Messages */}
        <ActionCard
          title="Caregiver Messages"
          description="Communicate with caregivers and care circles."
          icon={<MessageSquare className="h-6 w-6 text-white" />}
          ctaLabel="Open Messages"
          onClick={() => navigate("/messages")}
        />
      </div>
    </div>
  );
}

export default CaregiverLanding;
