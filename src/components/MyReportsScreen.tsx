import React, { useState } from 'react';
import { MahallaReport, StatusKey } from '../types';
import { CATEGORIES, STATUSES } from '../data/categories';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  Filter,
  PlusCircle,
  Sparkles,
  Calendar,
  Car,
  Trash2,
  Lightbulb,
  Droplets,
  Zap,
  Layers,
} from 'lucide-react';

interface MyReportsScreenProps {
  reports: MahallaReport[];
  onSelectReport: (report: MahallaReport) => void;
  onNavigateToCreate: () => void;
}

export const MyReportsScreen: React.FC<MyReportsScreenProps> = ({
  reports,
  onSelectReport,
  onNavigateToCreate,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | StatusKey>('ALL');

  const filtered = reports.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const getCategoryIcon = (key: string) => {
    switch (key) {
      case 'ROAD':
        return <Car className="w-4 h-4 text-sky-600" />;
      case 'WASTE':
        return <Trash2 className="w-4 h-4 text-amber-600" />;
      case 'LIGHTING':
        return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      case 'WATER':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'ELECTRICITY':
        return <Zap className="w-4 h-4 text-purple-600" />;
      default:
        return <Layers className="w-4 h-4 text-emerald-600" />;
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const getStatusStepIndex = (status: StatusKey): number => {
    switch (status) {
      case 'NEW':
        return 1;
      case 'IN_REVIEW':
        return 2;
      case 'IN_PROGRESS':
        return 3;
      case 'RESOLVED':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Mening Murojaatlarim
          </h1>
          <p className="text-xs text-slate-500">
            Siz yuborgan mahalla muammolarining real vaqtdagi ijro nazorati
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center gap-2 self-start sm:self-auto transition-transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi murojaat</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filterStatus === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Barchasi ({reports.length})
        </button>
        <button
          onClick={() => setFilterStatus('NEW')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filterStatus === 'NEW'
              ? 'bg-sky-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Yangi ({reports.filter((r) => r.status === 'NEW').length})
        </button>
        <button
          onClick={() => setFilterStatus('IN_REVIEW')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filterStatus === 'IN_REVIEW'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Ko‘rib chiqilmoqda ({reports.filter((r) => r.status === 'IN_REVIEW').length})
        </button>
        <button
          onClick={() => setFilterStatus('IN_PROGRESS')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filterStatus === 'IN_PROGRESS'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Jarayonda ({reports.filter((r) => r.status === 'IN_PROGRESS').length})
        </button>
        <button
          onClick={() => setFilterStatus('RESOLVED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filterStatus === 'RESOLVED'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Hal qilindi ({reports.filter((r) => r.status === 'RESOLVED').length})
        </button>
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Murojaat topilmadi</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tanlangan holat bo‘yicha hozircha hech qanday murojaat mavjud emas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((report) => {
            const cat = CATEGORIES[report.category] || CATEGORIES.OTHER;
            const statusObj = STATUSES[report.status] || STATUSES.NEW;
            const currentStep = getStatusStepIndex(report.status);

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer space-y-4"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.bgColor }}
                    >
                      {getCategoryIcon(report.category)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">
                        {cat.titleUz}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ID: {report.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl ${statusObj.badgeClass}`}>
                      {statusObj.titleUz}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                {/* Status Progression Bar */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {[
                      { step: 1, label: 'Yuborildi' },
                      { step: 2, label: 'Ko‘rib chiqilmoqda' },
                      { step: 3, label: 'Jarayonda' },
                      { step: 4, label: 'Hal qilindi' },
                    ].map((st) => {
                      const isCompleted = currentStep >= st.step;
                      const isCurrent = currentStep === st.step;

                      return (
                        <div key={st.step} className="space-y-1">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isCompleted
                                ? st.step === 4
                                  ? 'bg-emerald-600'
                                  : 'bg-emerald-500'
                                : 'bg-slate-200'
                            }`}
                          />
                          <span
                            className={`text-[10px] block truncate text-center ${
                              isCurrent
                                ? 'font-bold text-emerald-800'
                                : isCompleted
                                ? 'text-slate-700 font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Address */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{report.address}</span>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                    <span>Batafsil ko‘rish</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
