import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Camera,
  Navigation,
  FileText,
  UserCheck,
  Truck,
  Filter,
} from 'lucide-react';
import { ReportedIssue, UserProfile, IssueStatus } from '../types';
import { CATEGORY_DEFINITIONS } from '../utils/geoAndClassification';
import { getCategorySvgIllustration } from '../utils/issueVisuals';

interface MunicipalWorkerDashboardProps {
  issues: ReportedIssue[];
  currentUser: UserProfile;
  onSelectIssue: (issue: ReportedIssue) => void;
  onUpdateStatusByStaff: (
    issueId: string,
    newStatus: IssueStatus,
    note: string,
    resolvedPhotoUrl?: string
  ) => void;
}

export const MunicipalWorkerDashboard: React.FC<MunicipalWorkerDashboardProps> = ({
  issues,
  currentUser,
  onSelectIssue,
  onUpdateStatusByStaff,
}) => {
  const [filterMode, setFilterMode] = useState<'my_crew' | 'my_ward' | 'all_pending'>('my_crew');
  const [activeActionIssueId, setActiveActionIssueId] = useState<string | null>(null);
  const [technicianNote, setTechnicianNote] = useState('');

  // Filter issues according to field worker role
  const workerIssues = issues.filter((issue) => {
    if (filterMode === 'my_crew') {
      return (
        issue.assignedCrew?.leadWorker?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        issue.assignedCrew?.leadWorker === 'Carlos Mendez' ||
        issue.wardId === currentUser.wardId
      );
    }
    if (filterMode === 'my_ward') {
      return issue.wardId === (currentUser.wardId || 'ward-4');
    }
    return issue.status !== 'resolved' && issue.status !== 'closed';
  });

  const activeWorkOrdersCount = workerIssues.filter(
    (i) => i.status === 'in_progress' || i.status === 'acknowledged'
  ).length;

  const handleQuickResolve = (issue: ReportedIssue) => {
    onUpdateStatusByStaff(
      issue.id,
      'resolved',
      technicianNote ||
        `Repaired by ${currentUser.name} (Crew Unit). Standard safety inspection verified.`,
      getCategorySvgIllustration(issue.category, true)
    );
    setActiveActionIssueId(null);
    setTechnicianNote('');
  };

  const handleStartWork = (issue: ReportedIssue) => {
    onUpdateStatusByStaff(
      issue.id,
      'in_progress',
      technicianNote || `Work started on site by ${currentUser.name}. Traffic safety perimeter established.`
    );
    setActiveActionIssueId(null);
    setTechnicianNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Field Crew Work Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
              CREW-04-A DISPATCH
            </span>
            <span className="text-xs text-amber-200">
              Vehicle #{currentUser.badgeNumber || 'TR-881'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Repair Operations Portal
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl">
            Logged in as <strong>{currentUser.name}</strong> (
            {currentUser.department || 'Bureau of Street Repair & Drainage'}). Field updates sync
            directly to the public map and notify reporting citizens.
          </p>
        </div>

        {/* Worker Summary Cards */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center min-w-[100px] sm:min-w-[120px]">
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 tabular-nums">
              {activeWorkOrdersCount}
            </div>
            <div className="text-[11px] sm:text-xs text-amber-100">Pending Orders</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center min-w-[100px] sm:min-w-[120px]">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tabular-nums">
              {issues.filter((i) => i.status === 'resolved').length}
            </div>
            <div className="text-[11px] sm:text-xs text-emerald-100">Resolved Today</div>
          </div>
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterMode('my_crew')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
              filterMode === 'my_crew'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Assigned to My Crew
          </button>
          <button
            onClick={() => setFilterMode('my_ward')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
              filterMode === 'my_ward'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Ward 4 Operations
          </button>
          <button
            onClick={() => setFilterMode('all_pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
              filterMode === 'all_pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All City Backlog
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {workerIssues.length} field work tickets
        </div>
      </div>

      {/* Field Work Tickets List */}
      <div className="space-y-4">
        {workerIssues.map((issue) => {
          const cat = CATEGORY_DEFINITIONS[issue.category];
          const isSelectedForAction = activeActionIssueId === issue.id;
          const isResolved = issue.status === 'resolved';

          return (
            <div
              key={issue.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all ${
                issue.urgency === 'critical' && !isResolved
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left Ticket Summary */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      #{issue.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : issue.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-rose-600 capitalize">
                      ● {issue.urgency} Priority
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-600 font-medium">
                      {issue.wardName}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectIssue(issue)}
                    className="text-base font-bold text-slate-900 hover:text-amber-700 cursor-pointer"
                  >
                    {issue.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span className="font-medium text-slate-800">
                        {issue.location.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Reported {new Date(issue.reportedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-slate-600 font-semibold">
                      ▲ {issue.upvotes} community confirmations
                    </div>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                  <button
                    onClick={() => onSelectIssue(issue)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px]"
                  >
                    View Timeline
                  </button>

                  {!isResolved && (
                    <button
                      onClick={() =>
                        setActiveActionIssueId(
                          isSelectedForAction ? null : issue.id
                        )
                      }
                      className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Update Ticket / Log Repair</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Form Expander */}
              {isSelectedForAction && (
                <div className="mt-4 pt-4 border-t border-slate-200 bg-amber-50/50 -mx-5 -mb-5 p-5 rounded-b-2xl space-y-3">
                  <div className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>Crew Work Log &amp; Safety Compliance Form</span>
                  </div>

                  <input
                    type="text"
                    value={technicianNote}
                    onChange={(e) => setTechnicianNote(e.target.value)}
                    placeholder="Enter technician notes, materials used, asphalt mix batch, or pump flow metrics..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-amber-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="text-[11px] text-amber-800">
                      Auto-triggers real-time push notification to{' '}
                      <strong>{issue.reportedBy.name}</strong> and{' '}
                      <strong>{issue.subscribers.length} subscribers</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveActionIssueId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 min-h-[40px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartWork(issue)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors min-h-[40px]"
                      >
                        Set In Progress
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickResolve(issue)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 min-h-[40px]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sign-off &amp; Mark Resolved</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
