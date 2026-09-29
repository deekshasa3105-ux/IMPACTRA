import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Wrench,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { NotificationItem } from '../types';
import { requestPushNotificationPermission } from '../utils/geoAndClassification';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectIssueId: (issueId: string) => void;
  onSimulateTestPush: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectIssueId,
  onSimulateTestPush,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleEnableBrowserPush = async () => {
    const granted = await requestPushNotificationPermission();
    if (granted) {
      alert('Push alerts enabled! You will receive system notifications when issues are resolved.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-400" />
              <h2 className="text-base font-bold">Civic Push Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Browser Push Permission & Test Bar */}
          <div className="p-4 bg-teal-50 border-b border-teal-100 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-teal-900">
                Live Browser Push Alerts
              </div>
              <button
                onClick={handleEnableBrowserPush}
                className="text-[11px] font-bold text-teal-700 bg-white border border-teal-300 px-2.5 py-1 rounded-lg hover:bg-teal-100"
              >
                Enable System Push
              </button>
            </div>
            <p className="text-[11px] text-teal-800">
              Receive desktop &amp; mobile alerts when repairs in your neighborhood are resolved.
            </p>
            <button
              type="button"
              onClick={onSimulateTestPush}
              className="w-full py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Simulate Real-Time Resolution Alert</span>
            </button>
          </div>

          {/* Actions Bar */}
          <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>{notifications.length} Total Alerts</span>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-teal-700 font-semibold hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectIssueId(item.issueId);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    item.read
                      ? 'bg-white border-slate-200'
                      : 'bg-teal-50/50 border-teal-200 ring-1 ring-teal-300/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {item.type === 'resolved' && (
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {item.type === 'crew_assigned' && (
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Wrench className="w-4 h-4" />
                        </div>
                      )}
                      {item.type === 'community_vote' && (
                        <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                      )}
                      {item.type === 'status_change' && (
                        <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                      <div className="text-[11px] font-semibold text-teal-700 pt-1 flex items-center gap-1">
                        <span>View Ticket #{item.issueId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-50" />
                <p className="text-xs">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
