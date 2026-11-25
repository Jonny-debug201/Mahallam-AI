import React from 'react';
import { MahallaReport, CategoryKey } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  AlertCircle,
  TrendingUp,
  Award,
  Car,
  Trash2,
  Lightbulb,
  Droplets,
  Zap,
} from 'lucide-react';

interface StatisticsScreenProps {
  reports: MahallaReport[];
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ reports }) => {
  const total = reports.length;
  const resolved = reports.filter((r) => r.status === 'RESOLVED').length;
  const inProgress = reports.filter((r) => r.status === 'IN_PROGRESS').length;
  const inReview = reports.filter((r) => r.status === 'IN_REVIEW').length;
  const newReports = reports.filter((r) => r.status === 'NEW').length;
  const pending = inProgress + inReview + newReports;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const getCategoryCount = (key: CategoryKey) => {
    return reports.filter((r) => r.category === key).length;
  };

  const renderCategoryIcon = (key: CategoryKey) => {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Mahalla Statistikasi
            </h1>
            <p className="text-xs text-slate-500">
              Infratuzilma holati, ijro intizomi va toifalar taqsimoti
            </p>
          </div>
        </div>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Jami murojaat</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {total}
          </div>
          <span className="text-[11px] text-slate-400">Ro‘yxatga olingan</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-emerald-700 font-medium">Hal qilingan</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums">
            {resolved}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">{resolutionRate}% ijro</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-purple-700 font-medium">Jarayonda</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 tabular-nums">
            {inProgress}
          </div>
          <span className="text-[11px] text-slate-400">Ish olib borilmoqda</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-sky-700 font-medium">Kutilayotgan</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-600 tabular-nums">
            {newReports + inReview}
          </div>
          <span className="text-[11px] text-slate-400">O‘rganilmoqda</span>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Ijro samaradorligi ko‘rsatkichi
            </h2>
          </div>
          <span className="text-xl font-extrabold text-emerald-700 tabular-nums">
            {resolutionRate}%
          </span>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${total > 0 ? (resolved / total) * 100 : 0}%` }}
              title="Hal qilingan"
            />
            <div
              className="bg-purple-500 h-full transition-all duration-500"
              style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
              title="Jarayonda"
            />
            <div
              className="bg-amber-400 h-full transition-all duration-500"
              style={{ width: `${total > 0 ? (inReview / total) * 100 : 0}%` }}
              title="Ko‘rib chiqilmoqda"
            />
            <div
              className="bg-sky-400 h-full transition-all duration-500"
              style={{ width: `${total > 0 ? (newReports / total) * 100 : 0}%` }}
              title="Yangi"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Hal qilingan: {resolved} ta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Jarayonda: {inProgress} ta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Ko‘rib chiqilmoqda: {inReview} ta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Yangi: {newReports} ta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900">
          Muammolarning sohalar bo‘yicha taqsimoti
        </h2>

        <div className="space-y-4">
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => {
            const cat = CATEGORIES[key];
            const count = getCategoryCount(key);
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.bgColor }}
                    >
                      {renderCategoryIcon(key)}
                    </div>
                    <span className="font-semibold text-slate-800">{cat.titleUz}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-slate-600">
                    <span className="tabular-nums font-bold text-slate-900">{count} ta</span>
                    <span className="text-[11px] text-slate-400">({percentage}%)</span>
                  </div>
                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
