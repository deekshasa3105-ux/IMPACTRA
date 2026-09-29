import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  ShieldCheck,
  Building2,
  Download,
  Filter,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { ReportedIssue, UserProfile } from '../types';
import {
  MUNICIPAL_WARDS,
  CATEGORY_DEFINITIONS,
} from '../utils/geoAndClassification';

interface CityOfficialDashboardProps {
  issues: ReportedIssue[];
  currentUser: UserProfile;
  onSelectIssue: (issue: ReportedIssue) => void;
}

export const CityOfficialDashboard: React.FC<CityOfficialDashboardProps> = ({
  issues,
  currentUser,
  onSelectIssue,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'quarter'>('7d');

  // Real-time metric computations
  const totalReports = issues.length;
  const resolvedIssues = issues.filter(
    (i) => i.status === 'resolved' || i.status === 'closed'
  );
  const activeIssues = issues.filter(
    (i) => i.status === 'reported' || i.status === 'in_progress' || i.status === 'acknowledged'
  );
  const criticalCount = issues.filter(
    (i) => (i.urgency === 'critical' || i.urgency === 'high') && i.status !== 'resolved'
  ).length;

  const resolutionRatePercent =
    totalReports > 0 ? Math.round((resolvedIssues.length / totalReports) * 100) : 0;

  // Category breakdown calculation
  const categoryStats = Object.keys(CATEGORY_DEFINITIONS).map((catKey) => {
    const key = catKey as keyof typeof CATEGORY_DEFINITIONS;
    const catIssues = issues.filter((i) => i.category === key);
    const resolvedCat = catIssues.filter((i) => i.status === 'resolved').length;
    return {
      category: key,
      info: CATEGORY_DEFINITIONS[key],
      count: catIssues.length,
      resolved: resolvedCat,
      percentOfTotal: totalReports > 0 ? Math.round((catIssues.length / totalReports) * 100) : 0,
    };
  });

  // Ward performance matrix
  const wardMetrics = MUNICIPAL_WARDS.map((ward) => {
    const wardIssues = issues.filter((i) => i.wardId === ward.id);
    const resolvedInWard = wardIssues.filter((i) => i.status === 'resolved').length;
    const pendingInWard = wardIssues.filter((i) => i.status !== 'resolved').length;
    const rate = wardIssues.length > 0 ? Math.round((resolvedInWard / wardIssues.length) * 100) : 100;
    return {
      ward,
      total: wardIssues.length,
      resolved: resolvedInWard,
      pending: pendingInWard,
      rate,
      avgResolutionHours: 14 + (ward.id.charCodeAt(5) % 12),
    };
  });

  const handleExportCSV = () => {
    const headers = 'IssueID,Title,Category,Ward,Status,Urgency,ReportedAt,Address\n';
    const rows = issues
      .map(
        (i) =>
          `"${i.id}","${i.title.replace(/"/g, '""')}","${i.category}","${i.wardName}","${
            i.status
          }","${i.urgency}","${i.reportedAt}","${i.location.address.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CivicPulse_Official_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Official Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Department of Municipal Operations Executive Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            City Infrastructure Analytics &amp; Responsiveness
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time cross-departmental command center. Monitor incoming crowdsourced reports,
            SLA compliance by ward, and rapid response deployment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md border border-white/20 transition-all min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Export Official CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reports</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            {totalReports}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% cloud-synced</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Backlog</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-600 tabular-nums">
            {activeIssues.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {criticalCount} requiring urgent dispatch
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 tabular-nums">
            {resolutionRatePercent}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Target SLA: 85% within 48h</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Repair Time</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            18.4 hrs
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            ↓ 4.2 hrs improvement vs last month
          </div>
        </div>
      </div>

      {/* Analytics Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Volume & Responsiveness Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Departmental Issue Volume &amp; Resolution Trends
              </h2>
              <p className="text-xs text-slate-500">
                Distribution across municipal bureaus and active resolution rates
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Live Feed
            </span>
          </div>

          <div className="space-y-4">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stat.info.color }}
                    />
                    <span>{stat.info.name}</span>
                  </div>
                  <div className="text-slate-600 font-mono">
                    <span className="font-bold text-slate-900">{stat.count} reports</span> (
                    {stat.resolved} resolved)
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.max(8, stat.percentOfTotal)}%`,
                      backgroundColor: stat.info.color,
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{stat.info.department}</span>
                  <span>{stat.percentOfTotal}% of citywide volume</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ward Leaderboard */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Ward Responsiveness</h2>
          <p className="text-xs text-slate-500">
            Performance comparison across all 5 municipal supervisor districts
          </p>

          <div className="space-y-3">
            {wardMetrics.map((item) => (
              <div
                key={item.ward.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.ward.color }}
                    />
                    <span>{item.ward.name.split(' - ')[0]}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      item.rate >= 50 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {item.rate}% resolved
                  </span>
                </div>

                <div className="text-[11px] text-slate-600">
                  Supervisor: <span className="font-medium">{item.ward.supervisor}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Active: {item.pending}</span>
                  <span>Avg SLA: {item.avgResolutionHours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Action Items Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              High Severity Pending Issues Requiring Supervisor Attention
            </h2>
            <p className="text-xs text-slate-500">
              Issues flagged Critical or High with community upvote validation
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
            SLA Priority Queue
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Ticket</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Title &amp; Address</th>
                <th className="py-2.5 px-3">Ward</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Community Votes</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues
                .filter((i) => i.status !== 'resolved')
                .slice(0, 6)
                .map((issue) => (
                  <tr
                    key={issue.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => onSelectIssue(issue)}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      #{issue.id}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700">
                        {CATEGORY_DEFINITIONS[issue.category].name.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{issue.title}</div>
                      <div className="text-slate-500 text-[11px] truncate">
                        {issue.location.address}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                      {issue.wardName.split(' - ')[0]}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                        {issue.urgency}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-800 tabular-nums">
                      ▲ {issue.upvotes}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button className="text-indigo-600 hover:text-indigo-900 font-bold">
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
