import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MahallaReport, CategoryKey, StatusKey } from '../types';
import { CATEGORIES, STATUSES } from '../data/categories';
import {
  MapPin,
  Filter,
  Layers,
  Compass,
  PlusCircle,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface MapScreenProps {
  reports: MahallaReport[];
  onSelectReport: (report: MahallaReport) => void;
  onNavigateToReport: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  reports,
  onSelectReport,
  onNavigateToReport,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<'ALL' | CategoryKey>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | StatusKey>('ALL');
  const [activeReport, setActiveReport] = useState<MahallaReport | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [41.311081, 69.240562], // Tashkent center
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive or clean up
    };
  }, []);

  // Update Markers when reports or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    filteredReports.forEach((report) => {
      const cat = CATEGORIES[report.category] || CATEGORIES.OTHER;
      const statusObj = STATUSES[report.status] || STATUSES.NEW;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: white;
            border: 2px solid ${cat.color};
            color: ${cat.color};
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.18);
            cursor: pointer;
            position: relative;
          ">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: ${statusObj.color};
              position: absolute;
              top: -2px;
              right: -2px;
              border: 1.5px solid white;
            "></div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: customIcon });
      marker.on('click', () => {
        setActiveReport(report);
        map.panTo([report.latitude, report.longitude], { animate: true });
      });

      marker.addTo(layer);
    });
  }, [filteredReports]);

  // Center on current GPS
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapInstanceRef.current?.setView([latitude, longitude], 15, { animate: true });
        setIsLocating(false);
      },
      () => {
        // Fallback to Tashkent center
        mapInstanceRef.current?.setView([41.311081, 69.240562], 13, { animate: true });
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="relative h-[calc(100vh-140px)] min-h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Interactive Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Filter Overlay */}
      <div className="absolute top-4 left-4 right-16 sm:right-auto z-20 flex flex-wrap items-center gap-2 max-w-2xl pointer-events-auto">
        {/* Category Dropdown */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-md border border-slate-200/90 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="text-xs font-semibold text-slate-800 bg-transparent pr-2 py-1 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Barcha toifalar</option>
            {Object.keys(CATEGORIES).map((key) => (
              <option key={key} value={key}>
                {CATEGORIES[key as CategoryKey].titleUz}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-md border border-slate-200/90 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="text-xs font-semibold text-slate-800 bg-transparent pr-2 py-1 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Barcha holatlar</option>
            {Object.keys(STATUSES).map((key) => (
              <option key={key} value={key}>
                {STATUSES[key as StatusKey].titleUz}
              </option>
            ))}
          </select>
        </div>

        {/* Total Count Badge */}
        <div className="hidden sm:inline-flex items-center text-xs font-semibold text-emerald-800 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-slate-200">
          <span>{filteredReports.length} ta muammo belgilangan</span>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2.5">
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 transition-all active:scale-95 disabled:opacity-50"
          title="Mening joylashuvim"
        >
          <Compass className={`w-5 h-5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onNavigateToReport}
          className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-600/35 flex items-center gap-2 font-bold text-xs transition-all active:scale-95"
          title="Yangi murojaat"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Murojaat yuborish</span>
        </button>
      </div>

      {/* Selected Report Bottom Drawer / Card */}
      {activeReport && (
        <div className="absolute bottom-6 left-4 right-20 sm:right-auto sm:max-w-md z-30 bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
                  {CATEGORIES[activeReport.category]?.titleUz || activeReport.category}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${STATUSES[activeReport.status]?.badgeClass}`}>
                  {STATUSES[activeReport.status]?.titleUz}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                {activeReport.title}
              </h3>
            </div>
            <button
              onClick={() => setActiveReport(null)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {activeReport.description}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-slate-500 text-[11px] truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{activeReport.address}</span>
            </div>

            <button
              onClick={() => onSelectReport(activeReport)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Batafsil</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
