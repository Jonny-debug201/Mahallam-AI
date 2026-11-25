import React from 'react';
import { MahallaReport } from '../types';
import { CATEGORIES, STATUSES } from '../data/categories';
import {
  X,
  MapPin,
  Calendar,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Car,
  Trash2,
  Lightbulb,
  Droplets,
  Zap,
  Layers,
  Share2,
} from 'lucide-react';

interface ReportDetailModalProps {
  report: MahallaReport | null;
  onClose: () => void;
  onNavigateToMap?: (report: MahallaReport) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onNavigateToMap,
}) => {
  if (!report) return null;

  const cat = CATEGORIES[report.category] || CATEGORIES.OTHER;
  const statusObj = STATUSES[report.status] || STATUSES.NEW;

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const getCategoryIcon = (key: string) => {
    switch (key) {
      case 'ROAD':
        return <Car className="w-5 h-5 text-sky-600" />;
      case 'WASTE':
        return <Trash2 className="w-5 h-5 text-amber-600" />;
      case 'LIGHTING':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'WATER':
        return <Droplets className="w-5 h-5 text-sky-600" />;
      case 'ELECTRICITY':
        return <Zap className="w-5 h-5 text-purple-600" />;
      default:
        return <Layers className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header bar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: cat.bgColor }}
            >
              {getCategoryIcon(report.category)}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {cat.titleUz}
              </span>
              <span className="text-[10px] text-slate-400">
                ID: {report.id}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Image preview if exists */}
          {report.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-64">
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Status & Severity */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-xl ${statusObj.badgeClass}`}>
              {statusObj.titleUz}
            </span>

            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(report.createdAt)}</span>
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {report.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {report.description}
            </p>
          </div>

          {/* Address & Mahalla */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{report.address}</span>
            </div>
            <div className="text-[11px] text-slate-500 pl-5">
              Mahalla: <span className="font-medium text-slate-700">{report.mahalla}</span>
            </div>
          </div>

          {/* Official response if any */}
          {report.officialResponse && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mas’ul tashkilot javobi:</span>
              </div>
              <p className="text-emerald-800 leading-relaxed pl-5">
                {report.officialResponse}
              </p>
            </div>
          )}

          {/* AI Recommendation */}
          {report.aiRecommendation && (
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-sky-900 font-bold">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Google Gemini AI xulosasi:</span>
              </div>
              <p className="text-sky-800 leading-relaxed pl-5 italic">
                {report.aiRecommendation}
              </p>
              <div className="text-[10px] text-sky-600 pl-5 pt-1">
                Eslatma: Birlamchi tahlil sun’iy intellekt tomonidan tayyorlangan bo‘lib, rasmiy tasdiqlash uchun mas’ul xodim joyida ko‘rik o‘tkazadi.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {report.isDemo ? 'Demo ma’lumoti' : 'Haqiqiy murojaat'}
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToMap && (
              <button
                onClick={() => {
                  onNavigateToMap(report);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Xaritada ko‘rish
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
