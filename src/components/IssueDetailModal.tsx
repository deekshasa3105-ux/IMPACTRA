import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
  Share2,
  Bell,
  MessageSquare,
  Wrench,
  UserCheck,
  Send,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { ReportedIssue, UserProfile, IssueStatus } from '../types';
import { CATEGORY_DEFINITIONS } from '../utils/geoAndClassification';
import { getCategorySvgIllustration } from '../utils/issueVisuals';
import { MAP_DIRECT_URL, openMapDirectLink } from '../utils/mapLink';

interface IssueDetailModalProps {
  issue: ReportedIssue | null;
  onClose: () => void;
  currentUser: UserProfile;
  onToggleUpvote: (issueId: string) => void;
  onAddComment: (issueId: string, commentText: string) => void;
  onUpdateStatusByStaff: (
    issueId: string,
    newStatus: IssueStatus,
    note: string,
    resolvedPhotoUrl?: string
  ) => void;
  onSubscribePush: (issueId: string) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  currentUser,
  onToggleUpvote,
  onAddComment,
  onUpdateStatusByStaff,
  onSubscribePush,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [staffNoteInput, setStaffNoteInput] = useState('');
  const [showStaffActionPanel, setShowStaffActionPanel] = useState(
    currentUser.role === 'field_worker' || currentUser.role === 'official'
  );
  const [copiedLink, setCopiedLink] = useState(false);

  if (!issue) return null;

  const catConfig = CATEGORY_DEFINITIONS[issue.category];
  const isResolved = issue.status === 'resolved' || issue.status === 'closed';

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(issue.id, commentInput.trim());
    setCommentInput('');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isSubscribed = issue.subscribers.includes(currentUser.email || currentUser.phone || 'me');

  // Status Step calculation
  const statusSteps = [
    { key: 'reported', label: 'Reported', desc: 'Submitted by resident' },
    { key: 'acknowledged', label: 'Acknowledged', desc: 'Reviewed by intake' },
    { key: 'in_progress', label: 'In Progress', desc: 'Crew deployed on site' },
    { key: 'resolved', label: 'Resolved', desc: 'Repaired & verified' },
  ];

  const getStepState = (stepKey: string) => {
    const order = ['reported', 'acknowledged', 'in_progress', 'resolved', 'closed'];
    const currentIndex = order.indexOf(issue.status);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: catConfig.color }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">#{issue.id}</span>
                <span className="text-slate-400">·</span>
                <span className="text-xs font-semibold text-teal-400">{catConfig.name}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold leading-tight line-clamp-1 truncate">
                {issue.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
          {/* Status Tracker Stepper */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-5">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>Resolution Progress Tracker</span>
              <span className="text-slate-500 font-normal text-[11px]">
                Reported {new Date(issue.reportedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 relative">
              {statusSteps.map((step, idx) => {
                const state = getStepState(step.key);
                return (
                  <div
                    key={step.key}
                    className={`p-3 rounded-xl border transition-all ${
                      state === 'current'
                        ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20'
                        : state === 'completed'
                        ? 'border-emerald-300 bg-emerald-50/60'
                        : 'border-slate-200 bg-white opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {state === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : state === 'current' ? (
                        <div className="w-4 h-4 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 text-[10px] flex items-center justify-center text-slate-400">
                          {idx + 1}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-900">{step.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 leading-snug">{step.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-200 rounded-xl p-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500">Location</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{issue.location.address}</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Lat: {issue.location.lat.toFixed(5)}, Lng: {issue.location.lng.toFixed(5)}
              </div>
              <div className="pt-1">
                <a
                  href={MAP_DIRECT_URL}
                  target="_self"
                  onClick={openMapDirectLink}
                  title="View on Interactive Map (https://impactra-civicpulse-new.ai.studio/)"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Interactive Map (impactra-civicpulse-new.ai.studio) ↗</span>
                </a>
              </div>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
              <div className="text-xs font-semibold text-slate-500">Assigned Ward &amp; Agency</div>
              <div className="text-sm font-bold text-slate-900">{issue.wardName}</div>
              <div className="text-xs text-teal-700 font-medium">{catConfig.department}</div>
            </div>
          </div>

          {/* Description & Hazard Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Citizen Description &amp; Public Safety Notice
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {issue.description}
            </p>
          </div>

          {/* Before & After Photo Comparison */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Visual Documentation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                  <span>Reported Condition (Before)</span>
                  <span className="text-[10px] text-slate-400">Citizen Submission</span>
                </div>
                <div className="h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                  <img
                    src={issue.photoUrl || getCategorySvgIllustration(issue.category, false)}
                    alt="Reported Condition"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                  <span>Municipal Repair Status (After)</span>
                  {isResolved ? (
                    <span className="text-[10px] text-emerald-600 font-bold">Verified Repaired</span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-bold">Awaiting Work Completion</span>
                  )}
                </div>
                <div className="h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {issue.resolvedPhotoUrl ? (
                    <img
                      src={issue.resolvedPhotoUrl}
                      alt="Resolved State"
                      className="w-full h-full object-cover"
                    />
                  ) : isResolved ? (
                    <img
                      src={getCategorySvgIllustration(issue.category, true)}
                      alt="Resolved State"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-70" />
                      <div className="text-xs font-semibold text-slate-700">Repair in Progress</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Field crew will upload proof photo upon completion
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Crew Details */}
          {issue.assignedCrew && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-900">
                    Active Municipal Crew: {issue.assignedCrew.crewName}
                  </div>
                  <div className="text-xs text-amber-800">
                    Crew Lead: <span className="font-semibold">{issue.assignedCrew.leadWorker}</span> · Vehicle #{issue.assignedCrew.vehicleNumber}
                  </div>
                </div>
              </div>
              {issue.assignedCrew.eta && (
                <div className="text-xs font-semibold text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-300 self-start sm:self-auto">
                  {issue.assignedCrew.eta}
                </div>
              )}
            </div>
          )}

          {/* Community Engagement: Upvotes, Notification Subscription & Sharing */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-2 border-y border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleUpvote(issue.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                  issue.upvotedByMe
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${issue.upvotedByMe ? 'fill-white' : ''}`} />
                <span>{issue.upvotes} Citizens Confirmed</span>
              </button>

              <button
                onClick={() => onSubscribePush(issue.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors min-h-[44px] ${
                  isSubscribed
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${isSubscribed ? 'fill-teal-600 text-teal-600' : ''}`} />
                <span>{isSubscribed ? 'Subscribed to Alerts' : 'Notify Me When Fixed'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors min-h-[44px]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Audit Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Official Resolution Timeline
            </h3>
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
              {issue.timeline.map((event) => (
                <div key={event.id} className="relative flex items-start gap-3 pl-1">
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-teal-600 flex items-center justify-center shrink-0 z-10 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                  </div>
                  <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{event.authorName}</span>
                        {event.department && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            ({event.department})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(event.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{event.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Municipal Staff / Official Action Panel */}
          {(currentUser.role === 'field_worker' || currentUser.role === 'official') && (
            <div className="p-4 bg-teal-50 border-2 border-teal-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                    Authorized Municipal Staff Controls ({currentUser.role.replace('_', ' ')})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-900 mb-1">
                  Technician Action Note / Repair Dispatch Log
                </label>
                <input
                  type="text"
                  value={staffNoteInput}
                  onChange={(e) => setStaffNoteInput(e.target.value)}
                  placeholder="e.g. Cleared catch basin and re-tested flow rate with city standard 100 gpm."
                  className="w-full px-3 py-2 text-xs bg-white border border-teal-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatusByStaff(
                      issue.id,
                      'in_progress',
                      staffNoteInput || 'Field repair crew arrived and initiated repair procedures.'
                    );
                    setStaffNoteInput('');
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors min-h-[40px]"
                >
                  Set In Progress
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatusByStaff(
                      issue.id,
                      'resolved',
                      staffNoteInput || 'Infrastructure defect fully resolved and verified on-site.',
                      getCategorySvgIllustration(issue.category, true)
                    );
                    setStaffNoteInput('');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors min-h-[40px]"
                >
                  ✓ Mark Fully Resolved
                </button>
              </div>
            </div>
          )}

          {/* Citizen Community Comments */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>Community Discussion &amp; Eye-Witness Reports ({issue.comments.length})</span>
            </h3>

            {issue.comments.length > 0 ? (
              <div className="space-y-2">
                {issue.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{c.authorName}</span>
                        {c.authorRole === 'staff' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-100 text-teal-800">
                            City Staff
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-700">{c.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No community comments yet. Add an update below.</p>
            )}

            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add comment, eyewitness observation, or repair tip..."
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Ward Depot Phone: <a href="tel:555-019-4821" className="text-teal-700 underline font-medium">555-019-4821</a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors min-h-[40px]"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
