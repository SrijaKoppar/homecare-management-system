import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Check, X, FileText } from 'lucide-react';

interface LeaveRequest {
  id: string;
  caregiverName: string;
  startDate: string;
  endDate: string;
  reason: string;
  days: number;
}

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    caregiverName: 'Sarah Johnson',
    startDate: 'Oct 18, 2025',
    endDate: 'Oct 22, 2025',
    reason: 'Family emergency - need to travel out of state',
    days: 5
  },
  {
    id: '2',
    caregiverName: 'Michael Davis',
    startDate: 'Oct 25, 2025',
    endDate: 'Oct 26, 2025',
    reason: 'Medical appointment and recovery',
    days: 2
  },
  {
    id: '3',
    caregiverName: 'Jessica Wilson',
    startDate: 'Nov 1, 2025',
    endDate: 'Nov 3, 2025',
    reason: 'Planned vacation',
    days: 3
  }
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

export function PendingLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);

  const handleApprove = (id: string) => {
    setLeaveRequests(prev => prev.filter(r => r.id !== id));
    console.log('Approved leave request:', id);
  };

  const handleDeny = (id: string) => {
    setLeaveRequests(prev => prev.filter(r => r.id !== id));
    console.log('Denied leave request:', id);
  };

  return (
    <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-800/30 animate-slide-in-bottom">
      <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg shadow-amber-500/30">
            <FileText className="h-5 w-5 text-white" />
          </div>
          Pending Leave Requests ({leaveRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300/50 scrollbar-track-transparent">
        {leaveRequests.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-10">
            No pending leave requests 🎉
          </p>
        ) : (
          leaveRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/5 hover:border-amber-200 dark:hover:border-amber-900/50 group"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 text-emerald-700 dark:text-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/20 transition-all duration-300 group-hover:scale-110">
                  <AvatarFallback className="font-bold">{getInitials(request.caregiverName)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{request.caregiverName}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {request.startDate} - {request.endDate} ({request.days} {request.days === 1 ? 'day' : 'days'})
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                    <span className="font-medium">Reason: </span>
                    {request.reason}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
                    >
                      <Check className="h-4 w-4 mr-1.5" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeny(request.id)}
                      className="hover:bg-gradient-to-r hover:from-rose-50 hover:to-red-50 dark:hover:from-rose-950 dark:hover:to-red-950 hover:text-rose-700 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 hover:shadow-md hover:shadow-rose-500/20 hover:scale-105"
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Deny
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
