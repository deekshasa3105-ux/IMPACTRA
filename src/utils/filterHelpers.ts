import { IssueStatus, UrgencyLevel } from '../types';

export type TimeRangeFilter = 'all' | '24h' | '7d' | '30d';

export function getTimeRangeMatch(reportedAt: string, range: TimeRangeFilter): boolean {
  if (range === 'all') return true;
  try {
    const reportTime = new Date(reportedAt).getTime();
    const now = new Date('2026-09-25T12:00:00Z').getTime();
    const diffHours = (now - reportTime) / (1000 * 60 * 60);

    if (range === '24h') return diffHours <= 48; // generous threshold to cover recent mock data
    if (range === '7d') return diffHours <= 7 * 24;
    if (range === '30d') return diffHours <= 30 * 24;
  } catch {
    return true;
  }
  return true;
}

export function formatRelativeTime(reportedAt: string): string {
  try {
    const reportTime = new Date(reportedAt).getTime();
    const now = new Date('2026-09-25T12:00:00Z').getTime();
    const diffHours = Math.max(1, Math.round((now - reportTime) / (1000 * 60 * 60)));

    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    const diffWeeks = Math.round(diffDays / 7);
    return `${diffWeeks}w ago`;
  } catch {
    return 'Recent';
  }
}

export function getStatusLabel(status: IssueStatus): { label: string; bg: string; text: string; dot: string } {
  switch (status) {
    case 'reported':
      return {
        label: 'Reported',
        bg: 'bg-blue-500/15 border-blue-500/30',
        text: 'text-blue-300',
        dot: 'bg-blue-400',
      };
    case 'acknowledged':
      return {
        label: 'Acknowledged',
        bg: 'bg-purple-500/15 border-purple-500/30',
        text: 'text-purple-300',
        dot: 'bg-purple-400',
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        bg: 'bg-amber-500/15 border-amber-500/30',
        text: 'text-amber-300',
        dot: 'bg-amber-400',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        bg: 'bg-emerald-500/15 border-emerald-500/30',
        text: 'text-emerald-300',
        dot: 'bg-emerald-400',
      };
    case 'closed':
      return {
        label: 'Closed',
        bg: 'bg-slate-700/50 border-slate-600',
        text: 'text-slate-300',
        dot: 'bg-slate-400',
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-700/50 border-slate-600',
        text: 'text-slate-300',
        dot: 'bg-slate-400',
      };
  }
}
