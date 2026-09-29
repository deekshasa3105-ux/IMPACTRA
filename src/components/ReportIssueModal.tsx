import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Sparkles,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle,
  Bell,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { ReportedIssue, IssueCategory, UrgencyLevel, WardInfo, UserProfile } from '../types';
import {
  CATEGORY_DEFINITIONS,
  autoCategorizeIssue,
  reverseGeocodeEstimate,
  getWardByCoordinates,
  CITY_CENTER,
  requestPushNotificationPermission,
} from '../utils/geoAndClassification';
import { getCategorySvgIllustration } from '../utils/issueVisuals';
import { MAP_DIRECT_URL, openMapDirectLink } from '../utils/mapLink';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIssue: (issue: ReportedIssue) => void;
  prefillCoords?: { lat: number; lng: number; ward: WardInfo; address: string } | null;
  currentUser: UserProfile;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmitIssue,
  prefillCoords,
  currentUser,
}) => {
  const [lat, setLat] = useState<number>(prefillCoords?.lat || CITY_CENTER[0]);
  const [lng, setLng] = useState<number>(prefillCoords?.lng || CITY_CENTER[1]);
  const [address, setAddress] = useState<string>(prefillCoords?.address || '742 Valencia Way');
  const [ward, setWard] = useState<WardInfo>(
    prefillCoords?.ward || getWardByCoordinates(CITY_CENTER[0], CITY_CENTER[1])
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('roads');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [detectedConfidence, setDetectedConfidence] = useState<number>(0);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [isManualCategoryOverride, setIsManualCategoryOverride] = useState(false);

  const [reporterName, setReporterName] = useState(currentUser.name || 'Local Resident');
  const [reporterContact, setReporterContact] = useState(currentUser.phone || currentUser.email || '');
  const [enablePushAlerts, setEnablePushAlerts] = useState(true);
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string>('default');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  // Sync coords if changed from map pin
  useEffect(() => {
    if (prefillCoords) {
      setLat(prefillCoords.lat);
      setLng(prefillCoords.lng);
      setAddress(prefillCoords.address);
      setWard(prefillCoords.ward);
    }
  }, [prefillCoords]);

  // Live Auto-categorization when title or description changes
  useEffect(() => {
    if (isManualCategoryOverride) return;

    if (title.length > 3 || description.length > 5) {
      const result = autoCategorizeIssue(title, description);
      setCategory(result.category);
      setDetectedConfidence(result.confidence);
      setDetectedKeywords(result.detectedKeywords);

      // Auto set suggested urgency
      if (CATEGORY_DEFINITIONS[result.category]) {
        setUrgency(CATEGORY_DEFINITIONS[result.category].defaultUrgency);
      }
    }
  }, [title, description, isManualCategoryOverride]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPhotoUrl(reader.result as string);
        setSelectedPhotoPreset('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (enablePushAlerts) {
      await requestPushNotificationPermission();
    }

    const newIssueId = `CP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const finalPhoto =
      customPhotoUrl || getCategorySvgIllustration(category, false);

    const newIssue: ReportedIssue = {
      id: newIssueId,
      title: title.trim() || `${CATEGORY_DEFINITIONS[category].name} Incident`,
      description: description.trim() || 'Defect reported by citizen for urgent municipal repair.',
      category,
      urgency,
      status: 'reported',
      location: {
        lat,
        lng,
        address,
        neighborhood: ward.name.split(' - ')[1] || 'Metro Zone',
      },
      wardId: ward.id,
      wardName: ward.name,
      reportedAt: new Date().toISOString(),
      reportedBy: {
        name: reporterName.trim() || 'Anonymous Resident',
        phone: reporterContact.includes('@') ? undefined : reporterContact,
        email: reporterContact.includes('@') ? reporterContact : undefined,
        isVerified: currentUser.isVerified,
        residentId: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      upvotes: 1,
      upvotedByMe: true,
      photoUrl: finalPhoto,
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'reported',
          authorName: reporterName.trim() || 'Anonymous Resident',
          authorRole: 'citizen',
          notes: `Citizen dropped pin and reported defect. Auto-categorized as ${CATEGORY_DEFINITIONS[category].name} and routed to ${ward.name}.`,
          photoUrl: finalPhoto,
        },
      ],
      comments: [],
      subscribers: reporterContact ? [reporterContact] : [],
    };

    onSubmitIssue(newIssue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <MapPin className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Report Infrastructure Defect</h2>
              <p className="text-xs text-teal-100">
                Pins are geo-verified, auto-categorized, and assigned to municipal crews
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Location & Ward Auto-Tag Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">{address}</div>
                <div className="text-xs text-slate-500 font-mono">
                  Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
                </div>
                <div className="pt-0.5">
                  <a
                    href={MAP_DIRECT_URL}
                    target="_self"
                    onClick={openMapDirectLink}
                    title="Open Direct Map (https://impactra-civicpulse-new.ai.studio/)"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
                  >
                    <span>Open Direct Map (impactra-civicpulse-new.ai.studio) ↗</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: ward.color }}
              ></div>
              <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                {ward.name}
              </span>
            </div>
          </div>

          {/* Issue Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issue Summary *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep pothole breaking car suspensions near school"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Description &amp; Safety Hazard *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is broken, approximate size/depth, hazards to pedestrians or motorists..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Smart Auto-Categorization Feedback Banner */}
          {detectedKeywords.length > 0 && !isManualCategoryOverride && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center justify-between text-xs text-teal-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  <strong>AI Smart Categorization:</strong> Classified as{' '}
                  <span className="font-bold underline">{CATEGORY_DEFINITIONS[category].name}</span>{' '}
                  (Confidence: {Math.round(detectedConfidence * 100)}%)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsManualCategoryOverride(true)}
                className="text-teal-700 hover:text-teal-900 font-semibold underline ml-2 shrink-0"
              >
                Change
              </button>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category (Department Responsible)
              </label>
              {isManualCategoryOverride && (
                <button
                  type="button"
                  onClick={() => setIsManualCategoryOverride(false)}
                  className="text-xs text-teal-600 font-semibold hover:underline"
                >
                  Use Auto-Detection
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(CATEGORY_DEFINITIONS).map(([catKey, conf]) => (
                <button
                  type="button"
                  key={catKey}
                  onClick={() => {
                    setCategory(catKey as IssueCategory);
                    setIsManualCategoryOverride(true);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 min-h-[44px] ${
                    category === catKey
                      ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold ring-1 ring-teal-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: conf.color }}
                  ></span>
                  <span className="truncate">{conf.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { level: 'low', label: 'Low', desc: 'Cosmetic / Minor', color: 'text-slate-600' },
                { level: 'medium', label: 'Medium', desc: 'Standard', color: 'text-amber-700' },
                { level: 'high', label: 'High', desc: 'Active Hazard', color: 'text-orange-700' },
                { level: 'critical', label: 'Critical', desc: 'Immediate Danger', color: 'text-rose-700' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.level}
                  onClick={() => setUrgency(item.level as UrgencyLevel)}
                  className={`p-2 rounded-xl border text-center transition-all min-h-[44px] ${
                    urgency === item.level
                      ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] opacity-80">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Evidence */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Photo Evidence
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                <img
                  src={customPhotoUrl || getCategorySvgIllustration(category, false)}
                  alt="Issue Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer transition-colors min-h-[44px]">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Upload Photo from Device / Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500">
                  Municipal crews prioritize reports with clear photo evidence.
                </p>
              </div>
            </div>
          </div>

          {/* Simple Resident Verification & Push Notification Subscription */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Citizen Contact &amp; Progress Updates</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Your Name / Handle</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">
                  Phone or Email (for SMS/Email Alerts)
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="e.g. 555-019-2831 or user@email.com"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={enablePushAlerts}
                onChange={(e) => setEnablePushAlerts(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-700 font-medium flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-teal-600" />
                <span>Enable push notifications when repair crew is dispatched and issue is resolved</span>
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2 min-h-[44px]"
            >
              <span>Submit Report to City</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
