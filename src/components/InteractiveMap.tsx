import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Crosshair,
  Layers,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
  ExternalLink,
} from 'lucide-react';
import { ReportedIssue, IssueCategory, IssueStatus, WardInfo } from '../types';
import {
  MUNICIPAL_WARDS,
  CITY_CENTER,
  getWardByCoordinates,
  reverseGeocodeEstimate,
  CATEGORY_DEFINITIONS,
} from '../utils/geoAndClassification';
import { getTimeRangeMatch, TimeRangeFilter } from '../utils/filterHelpers';
import { MAP_DIRECT_URL, openMapDirectLink } from '../utils/mapLink';

interface InteractiveMapProps {
  issues: ReportedIssue[];
  selectedIssue: ReportedIssue | null;
  onSelectIssue: (issue: ReportedIssue) => void;
  onStartReportAtCoords: (coords: { lat: number; lng: number; ward: WardInfo; address: string }) => void;
  isDark?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  issues,
  selectedIssue,
  onSelectIssue,
  onStartReportAtCoords,
  isDark = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const wardsLayerRef = useRef<L.LayerGroup | null>(null);
  const dropPinMarkerRef = useRef<L.Marker | null>(null);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [activePriorityFilter, setActivePriorityFilter] = useState<string>('all');
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeRangeFilter>('all');
  const [showWardBoundaries, setShowWardBoundaries] = useState<boolean>(true);
  const [isDropPinMode, setIsDropPinMode] = useState<boolean>(false);
  const [droppedCoords, setDroppedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentEstimate, setCurrentEstimate] = useState<{ ward: WardInfo; address: string } | null>(null);

  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: CITY_CENTER,
        zoom: 13,
        zoomControl: false,
      });

      // Dark Matter or OSM tile layer
      const initialTile = L.tileLayer(isDark ? darkTileUrl : lightTileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = initialTile;

      // Add Zoom control at bottom right for thumb reach
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      wardsLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // Handle map clicks for pin drop
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setDroppedCoords({ lat, lng });
        const ward = getWardByCoordinates(lat, lng);
        const geo = reverseGeocodeEstimate(lat, lng);
        setCurrentEstimate({ ward, address: geo.address });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync dark mode tile layer on theme toggle
  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(isDark ? darkTileUrl : lightTileUrl);
    }
  }, [isDark]);

  // Sync Ward Boundaries
  useEffect(() => {
    if (!mapInstanceRef.current || !wardsLayerRef.current) return;

    wardsLayerRef.current.clearLayers();

    if (showWardBoundaries) {
      MUNICIPAL_WARDS.forEach((ward) => {
        const polygon = L.polygon(ward.bounds, {
          color: ward.color,
          weight: 2,
          opacity: 0.8,
          fillColor: ward.color,
          fillOpacity: 0.12,
          dashArray: '4, 6',
        });

        // Clickable popup on ward
        polygon.bindPopup(`
          <div class="p-3 text-slate-800 font-sans">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="w-3 h-3 rounded-full" style="background-color: ${ward.color}"></span>
              <strong class="text-sm font-semibold">${ward.name}</strong>
            </div>
            <p class="text-xs text-slate-600 mb-1">Zone: ${ward.zone}</p>
            <p class="text-xs text-slate-600 mb-2">Supervisor: <span class="font-medium">${ward.supervisor}</span></p>
            <p class="text-xs text-slate-500">Depot Emergency Dispatch: <a href="tel:${ward.depotPhone}" class="text-teal-700 underline font-medium">${ward.depotPhone}</a></p>
          </div>
        `);

        polygon.addTo(wardsLayerRef.current!);
      });
    }
  }, [showWardBoundaries]);

  // Sync Issue Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filteredIssues = issues.filter((issue) => {
      if (activeCategoryFilter !== 'all' && issue.category !== activeCategoryFilter) {
        return false;
      }
      if (activeStatusFilter !== 'all' && issue.status !== activeStatusFilter) {
        return false;
      }
      if (activePriorityFilter !== 'all') {
        if (activePriorityFilter === 'trending') {
          if (issue.upvotes < 20) return false;
        } else if (issue.urgency !== activePriorityFilter) {
          return false;
        }
      }
      if (activeTimeFilter !== 'all') {
        if (!getTimeRangeMatch(issue.reportedAt, activeTimeFilter)) {
          return false;
        }
      }
      return true;
    });

    filteredIssues.forEach((issue) => {
      const catConfig = CATEGORY_DEFINITIONS[issue.category];
      const isUrgent = issue.urgency === 'critical' || issue.urgency === 'high';
      const isResolved = issue.status === 'resolved';

      const markerHtml = `
        <div class="relative cursor-pointer group">
          ${
            isUrgent && !isResolved
              ? `<div class="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping"></div>`
              : ''
          }
          <div class="relative w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white transition-transform group-hover:scale-125" style="background-color: ${
            isResolved ? '#10B981' : catConfig.color
          }">
            <span class="text-xs font-bold leading-none">${
              isResolved ? '✓' : issue.title.charAt(0)
            }</span>
          </div>
          ${
            issue.upvotes > 20
              ? `<div class="absolute -top-1 -right-1 bg-slate-900 text-white text-[9px] font-bold px-1 rounded-full border border-white">▲${issue.upvotes}</div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-civic-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([issue.location.lat, issue.location.lng], {
        icon: customIcon,
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 max-w-[280px] font-sans';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <span class="text-[11px] font-mono text-slate-500">#${issue.id}</span>
          <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            issue.status === 'resolved'
              ? 'bg-emerald-100 text-emerald-800'
              : issue.status === 'in_progress'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
          }">
            ${issue.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <h4 class="text-sm font-bold text-slate-900 leading-snug mb-1 line-clamp-2">${issue.title}</h4>
        <p class="text-xs text-slate-600 mb-2 truncate">📍 ${issue.location.address}</p>
        <div class="text-[11px] text-slate-500 mb-3 flex items-center gap-2">
          <span>${issue.wardName.split(' - ')[0]}</span>
          <span>·</span>
          <span>▲ ${issue.upvotes} citizens verified</span>
        </div>
        <button id="view-issue-${issue.id}" class="w-full py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs">
          <span>View Progress & Updates</span>
          <span>→</span>
        </button>
      `;

      popupContent.querySelector(`#view-issue-${issue.id}`)?.addEventListener('click', () => {
        onSelectIssue(issue);
      });

      marker.bindPopup(popupContent);
      marker.addTo(markersLayerRef.current!);
    });
  }, [issues, activeCategoryFilter, activeStatusFilter, activePriorityFilter, activeTimeFilter, onSelectIssue]);

  // Handle dropped pin on map
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (droppedCoords) {
      if (dropPinMarkerRef.current) {
        dropPinMarkerRef.current.setLatLng([droppedCoords.lat, droppedCoords.lng]);
      } else {
        const dropIcon = L.divIcon({
          html: `
            <div class="relative flex flex-col items-center">
              <div class="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl border-2 border-white animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div class="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                New Report Point
              </div>
            </div>
          `,
          className: 'new-pin-drop',
          iconSize: [40, 56],
          iconAnchor: [20, 50],
        });

        const newMarker = L.marker([droppedCoords.lat, droppedCoords.lng], {
          icon: dropIcon,
          draggable: true,
        }).addTo(mapInstanceRef.current);

        newMarker.on('dragend', (e) => {
          const latlng = e.target.getLatLng();
          setDroppedCoords({ lat: latlng.lat, lng: latlng.lng });
          const ward = getWardByCoordinates(latlng.lat, latlng.lng);
          const geo = reverseGeocodeEstimate(latlng.lat, latlng.lng);
          setCurrentEstimate({ ward, address: geo.address });
        });

        dropPinMarkerRef.current = newMarker;
      }
    } else {
      if (dropPinMarkerRef.current) {
        dropPinMarkerRef.current.remove();
        dropPinMarkerRef.current = null;
      }
    }
  }, [droppedCoords]);

  // Center on selected issue if changed
  useEffect(() => {
    if (selectedIssue && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedIssue.location.lat, selectedIssue.location.lng],
        16,
        { duration: 1.2 }
      );
    }
  }, [selectedIssue]);

  // "Locate Me" Geolocation handler
  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 15);
          }
          setDroppedCoords({ lat, lng });
          const ward = getWardByCoordinates(lat, lng);
          const geo = reverseGeocodeEstimate(lat, lng);
          setCurrentEstimate({ ward, address: geo.address });
        },
        () => {
          // Fallback to city center if GPS blocked
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(CITY_CENTER, 14);
          }
          setDroppedCoords({ lat: CITY_CENTER[0], lng: CITY_CENTER[1] });
          const ward = getWardByCoordinates(CITY_CENTER[0], CITY_CENTER[1]);
          const geo = reverseGeocodeEstimate(CITY_CENTER[0], CITY_CENTER[1]);
          setCurrentEstimate({ ward, address: geo.address });
        }
      );
    }
  };

  const handleStartReportWithCurrentPin = () => {
    if (droppedCoords && currentEstimate) {
      onStartReportAtCoords({
        lat: droppedCoords.lat,
        lng: droppedCoords.lng,
        ward: currentEstimate.ward,
        address: currentEstimate.address,
      });
      setDroppedCoords(null);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Top Filter Floating Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 max-w-[calc(100vw-4.5rem)] sm:max-w-[calc(100vw-6rem)] overflow-x-auto no-scrollbar scroll-smooth pointer-events-none pb-2">
        {/* Direct Link to Official Map */}
        <a
          href={MAP_DIRECT_URL}
          target="_self"
          onClick={openMapDirectLink}
          title="Direct Map Link (https://impactra-civicpulse-new.ai.studio/)"
          className="pointer-events-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all min-h-[36px]"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          <span>Direct Map (impactra-civicpulse-new.ai.studio)</span>
        </a>

        {/* Category Filter */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 sm:p-1.5 rounded-xl shadow-lg border border-slate-200/80 flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
              activeCategoryFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({issues.length})
          </button>
          {Object.entries(CATEGORY_DEFINITIONS).map(([catKey, conf]) => (
            <button
              key={catKey}
              onClick={() => setActiveCategoryFilter(catKey)}
              className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[36px] flex items-center gap-1.5 ${
                activeCategoryFilter === catKey
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: conf.color }}
              ></span>
              <span>{conf.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200/80 flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveStatusFilter('all')}
            className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-lg min-h-[36px] ${
              activeStatusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => setActiveStatusFilter('in_progress')}
            className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1 min-h-[36px] ${
              activeStatusFilter === 'in_progress' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3 h-3 shrink-0" />
            <span>Active</span>
          </button>
          <button
            onClick={() => setActiveStatusFilter('resolved')}
            className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1 min-h-[36px] ${
              activeStatusFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>Resolved</span>
          </button>
        </div>

        {/* Priority & Time Dropdowns */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200/80 flex items-center gap-1.5 shrink-0">
          <select
            value={activePriorityFilter}
            onChange={(e) => setActivePriorityFilter(e.target.value)}
            className="px-2 py-1 bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer min-h-[36px]"
            title="Filter by Community Priority"
          >
            <option value="all">All Priorities</option>
            <option value="critical">🚨 Critical Urgency</option>
            <option value="high">⚠️ High Priority</option>
            <option value="medium">⚡ Standard / Low</option>
            <option value="trending">🔥 Trending Upvoted (&gt;20)</option>
          </select>

          <span className="text-slate-300">|</span>

          <select
            value={activeTimeFilter}
            onChange={(e) => setActiveTimeFilter(e.target.value as TimeRangeFilter)}
            className="px-2 py-1 bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer min-h-[36px]"
            title="Filter by Time of Report"
          >
            <option value="all">⏱️ All Time</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* Floating Action Controls on Right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        {/* Toggle Ward Boundaries */}
        <button
          onClick={() => setShowWardBoundaries(!showWardBoundaries)}
          title="Toggle Municipal Ward Boundaries"
          className={`p-2.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            showWardBoundaries
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-white/95 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Locate Me Button */}
        <button
          onClick={handleLocateMe}
          title="Center on My Location"
          className="p-2.5 bg-white/95 text-slate-700 hover:bg-slate-100 hover:text-teal-700 rounded-xl shadow-lg border border-slate-200 backdrop-blur-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        {/* Drop Pin Mode Trigger */}
        <button
          onClick={() => {
            const nextMode = !isDropPinMode;
            setIsDropPinMode(nextMode);
            if (nextMode && !droppedCoords) {
              setDroppedCoords({ lat: CITY_CENTER[0], lng: CITY_CENTER[1] });
              const ward = getWardByCoordinates(CITY_CENTER[0], CITY_CENTER[1]);
              const geo = reverseGeocodeEstimate(CITY_CENTER[0], CITY_CENTER[1]);
              setCurrentEstimate({ ward, address: geo.address });
            }
          }}
          title="Drop Pin Anywhere"
          className={`p-2.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur-md transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
            isDropPinMode
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-white/95 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Leaflet Map Target */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Instructions when in Drop Pin Mode or after Pin dropped */}
      {droppedCoords && currentEstimate ? (
        <div className="absolute bottom-5 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-teal-500 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <h3 className="text-sm font-bold text-slate-900">Pin Dropped on Map</h3>
            </div>
            <button
              onClick={() => {
                setDroppedCoords(null);
                setIsDropPinMode(false);
              }}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-1.5 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{currentEstimate.address}</span>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-100 text-teal-800">
                {currentEstimate.ward.name}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-[11px] text-slate-500">
                Auto-assigned to {currentEstimate.ward.supervisor}
              </span>
            </div>
          </div>

          <button
            onClick={handleStartReportWithCurrentPin}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>Proceed to Report Infrastructure Defect</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-auto z-20 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg border border-slate-800">
            <Info className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              Tip: <strong>Click anywhere on the map</strong> to drop a pin and report an issue!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
