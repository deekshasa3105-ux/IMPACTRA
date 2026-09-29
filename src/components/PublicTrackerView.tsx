import React, { useState } from 'react';
import {
  Search,
  Filter,
  ThumbsUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  PlusCircle,
  Bell,
  Eye,
} from 'lucide-react';
import { ReportedIssue, IssueCategory, IssueStatus } from '../types';
import { CATEGORY_DEFINITIONS, MUNICIPAL_WARDS } from '../utils/geoAndClassification';
import { getCategorySvgIllustration } from '../utils/issueVisuals';
import { getTimeRangeMatch, formatRelativeTime, TimeRangeFilter } from '../utils/filterHelpers';

interface PublicTrackerViewProps {
  issues: ReportedIssue[];
  onSelectIssue: (issue: ReportedIssue) => void;
  onToggleUpvote: (issueId: string) => void;
  onOpenReportModal: () => void;
}

export const PublicTrackerView: React.FC<PublicTrackerViewProps> = ({
  issues,
  onSelectIssue,
  onToggleUpvote,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeFilter>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'newest' | 'urgency'>('votes');

  // Filter and sort logic
  const filteredIssues = issues
    .filter((issue) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          issue.title.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q) ||
          issue.location.address.toLowerCase().includes(q) ||
          issue.id.toLowerCase().includes(q);
        if (!matchesText) return false;
      }
      if (selectedCategory !== 'all' && issue.category !== selectedCategory) {
        return false;
      }
      if (selectedWard !== 'all' && issue.wardId !== selectedWard) {
        return false;
      }
      if (selectedStatus !== 'all' && issue.status !== selectedStatus) {
        return false;
      }
      if (selectedPriority !== 'all') {
        if (selectedPriority === 'trending') {
          if (issue.upvotes < 20) return false;
        } else if (issue.urgency !== selectedPriority) {
          return false;
        }
      }
      if (selectedTimeRange !== 'all') {
        if (!getTimeRangeMatch(issue.reportedAt, selectedTimeRange)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') {
        return b.upvotes - a.upvotes;
      }
      if (sortBy === 'newest') {
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      }
      if (sortBy === 'urgency') {
        const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityWeight[b.urgency] - priorityWeight[a.urgency];
      }
      return 0;
    });

  const totalCount = issues.length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress' || i.status === 'acknowledged').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Civic Transparency Hero Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            Open Civic Accountability &amp; Public Transparency
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Metro Infrastructure Resolution Hub
          </h1>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Every citizen report is tracked publicly in real-time. Upvote problems in your
            neighborhood to accelerate municipal dispatch and follow live repair progress.
          </p>
        </div>

        {/* Quick Summary Metrics */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 max-w-lg">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {totalCount}
            </div>
            <div className="text-[11px] text-teal-200">Total Tracked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 tabular-nums">
              {inProgressCount}
            </div>
            <div className="text-[11px] text-amber-200">Active Repairs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tabular-nums">
              {resolvedCount}
            </div>
            <div className="text-[11px] text-emerald-200">Verified Fixed</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by issue ID, street name, pothole, light, drain..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'votes' | 'newest' | 'urgency')}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
            >
              <option value="votes">Community Upvotes (Most Urgently Needed)</option>
              <option value="urgency">Severity Level (Critical First)</option>
              <option value="newest">Recent Submissions</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full lg:w-auto px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none min-h-[38px]"
          >
            <option value="all">All Infrastructure Categories</option>
            {Object.entries(CATEGORY_DEFINITIONS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.name}
              </option>
            ))}
          </select>

          {/* Ward Dropdown */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full lg:w-auto px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none min-h-[38px]"
          >
            <option value="all">All City Wards</option>
            {MUNICIPAL_WARDS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Resolution Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full lg:w-auto px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none min-h-[38px]"
          >
            <option value="all">All Resolution Statuses</option>
            <option value="reported">🟡 Reported (New)</option>
            <option value="acknowledged">🔵 Acknowledged</option>
            <option value="in_progress">🟠 In Progress (Crew Assigned)</option>
            <option value="resolved">🟢 Resolved &amp; Closed</option>
          </select>

          {/* Community Priority Dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full lg:w-auto px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none min-h-[38px]"
          >
            <option value="all">All Community Priorities</option>
            <option value="critical">🚨 Critical Danger</option>
            <option value="high">⚠️ High Priority</option>
            <option value="medium">⚡ Medium / Low</option>
            <option value="trending">🔥 Trending Upvoted (&gt;20)</option>
          </select>

          {/* Time of Report Dropdown */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as TimeRangeFilter)}
            className="w-full lg:w-auto px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none min-h-[38px]"
          >
            <option value="all">⏱️ All Submission Times</option>
            <option value="24h">Past 24 Hours (Fresh)</option>
            <option value="7d">Past 7 Days (This Week)</option>
            <option value="30d">Past 30 Days (This Month)</option>
          </select>

          <span className="text-xs text-slate-500 sm:col-span-2 lg:ml-auto font-medium text-center sm:text-left lg:text-right pt-1 lg:pt-0">
            Showing {filteredIssues.length} of {issues.length} issues
          </span>
        </div>
      </div>

      {/* Issues Feed Grid */}
      {filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIssues.map((issue) => {
            const cat = CATEGORY_DEFINITIONS[issue.category];
            const isResolved = issue.status === 'resolved';

            return (
              <div
                key={issue.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
                onClick={() => onSelectIssue(issue)}
              >
                {/* Visual Thumbnail */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={issue.photoUrl || getCategorySvgIllustration(issue.category, isResolved)}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
                        isResolved
                          ? 'bg-emerald-500 text-white'
                          : issue.status === 'in_progress'
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Ward & Time Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="bg-black/70 backdrop-blur-md text-teal-300 text-[10px] font-mono px-2 py-0.5 rounded shadow">
                      {formatRelativeTime(issue.reportedAt)}
                    </span>
                    <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                      {issue.wardName.split(' - ')[0]}
                    </div>
                  </div>

                  {/* Urgency indicator at bottom of image */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-mono text-slate-300">#{issue.id}</span>
                    <span className="font-semibold text-teal-300 capitalize">
                      {issue.urgency} Urgency
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      ></span>
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                      {issue.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{issue.location.address}</span>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleUpvote(issue.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[40px] ${
                          issue.upvotedByMe
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${issue.upvotedByMe ? 'fill-white' : ''}`} />
                        <span>{issue.upvotes}</span>
                      </button>

                      <span className="text-xs font-semibold text-teal-700 group-hover:underline flex items-center gap-1">
                        <span>View Progress</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No issues found matching filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, selecting another ward, or report a new issue if you noticed a defect!
          </p>
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-teal-700 transition-colors inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Infrastructure Defect</span>
          </button>
        </div>
      )}
    </div>
  );
};
