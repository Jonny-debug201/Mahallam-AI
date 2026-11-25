import React, { useState } from 'react';
import { UserProfile } from '../types';
import { apiService } from '../services/api';
import {
  User,
  Phone,
  MapPin,
  Shield,
  Settings,
  HelpCircle,
  FileText,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Save,
  RotateCcw,
} from 'lucide-react';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  isDemoMode: boolean;
  onToggleDemoMode: (isDemo: boolean) => void;
  onNavigateToMyReports: () => void;
  onNavigateToStats: () => void;
  onResetData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  isDemoMode,
  onToggleDemoMode,
  onNavigateToMyReports,
  onNavigateToStats,
  onResetData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [phone, setPhone] = useState(userProfile.phone);
  const [mahallaName, setMahallaName] = useState(userProfile.mahallaName);
  const [district, setDistrict] = useState(userProfile.district);
  const [region, setRegion] = useState(userProfile.region);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      fullName: fullName.trim() || userProfile.fullName,
      phone: phone.trim() || userProfile.phone,
      mahallaName: mahallaName.trim() || userProfile.mahallaName,
      district: district.trim() || userProfile.district,
      region: region.trim() || userProfile.region,
    };
    onUpdateProfile(updated);
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Emergency Hotlines in Uzbekistan
  const HOTLINES = [
    { name: 'O‘zbekiston Respublikasi Prezidenti Xalq qabulxonasi', number: '1000', desc: 'Barcha davlat va fuqarolik masalalari' },
    { name: 'Toshkent shahar kommunal dispetcherlik xizmati', number: '1055', desc: 'Kommunal avariyalar va obodonlashtirish' },
    { name: 'Favqulodda vaziyatlar vazirligi (FVV)', number: '101', desc: 'Yong‘in, qutqaruv va tabiiy ofatlar' },
    { name: '«Hududiy elektr tarmoqlari» AJ', number: '1154', desc: 'Elektr uzilishlari va simlar xavfi' },
    { name: '«O‘zsuvta’minot» AJ', number: '1255', desc: 'Ichimlik suvi va oqova quvurlar' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Toast */}
      {showSavedToast && (
        <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profil ma’lumotlari muvaffaqiyatli yangilandi!</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-100 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-700 shadow-inner">
              <User className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {userProfile.fullName}
                </h1>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Faol Fuqaro
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{userProfile.phone}</span>
              </p>
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{userProfile.mahallaName}, {userProfile.district}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Yopish' : 'Tahrirlash'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Ism va familiya</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Telefon raqam</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Mahalla nomi</label>
                <input
                  type="text"
                  value={mahallaName}
                  onChange={(e) => setMahallaName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Tuman / Shahar</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Saqlash</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation Quick Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          onClick={onNavigateToMyReports}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block group-hover:text-emerald-700 transition-colors">
                Mening murojaatlarim
              </span>
              <span className="text-xs text-slate-400">Yuborilgan xabarlar tarixi</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={onNavigateToStats}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block group-hover:text-emerald-700 transition-colors">
                Mahalla statistikasi
              </span>
              <span className="text-xs text-slate-400">Ijro intizomi va tahlil</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Settings & Demo Mode Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600" />
          <h2 className="text-base font-bold text-slate-900">
            Ilova Sozlamalari
          </h2>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="space-y-0.5 max-w-md">
            <span className="text-xs font-bold text-slate-900 block">
              Demo (Sinov) Rejimi
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ilovani to‘liq sinab ko‘rish uchun xavfsiz rejim. Ma’lumotlar davlat idoralariga yuborilmaydi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onToggleDemoMode(!isDemoMode)}
            className="text-emerald-600 hover:text-emerald-700 transition-colors"
            title="Demo rejimini almashtirish"
          >
            {isDemoMode ? (
              <ToggleRight className="w-9 h-9 fill-emerald-600" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-slate-400" />
            )}
          </button>
        </div>

        {/* Reset Demo Data */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900 block">
              Namuna ma’lumotlarni qayta tiklash
            </span>
            <p className="text-[11px] text-slate-500">
              Barcha dastlabki demo muammolar va holatlarni qayta yuklash
            </p>
          </div>
          <button
            type="button"
            onClick={onResetData}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tiklash</span>
          </button>
        </div>
      </div>

      {/* Emergency & Municipal Hotlines */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Favqulodda va Kommunal Aloqa Raqamlari
            </h2>
            <p className="text-xs text-slate-500">
              Tezkor zaruriyat yuzaga kelganda to‘g‘ridan-to‘g‘ri murojaat qilish uchun
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {HOTLINES.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 transition-colors flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {item.desc}
                </span>
              </div>
              <a
                href={`tel:${item.number}`}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-extrabold tabular-nums shrink-0 transition-colors"
              >
                {item.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* About & Support Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-xs text-slate-500 space-y-2 text-center">
        <p className="font-bold text-slate-800">
          «Mahallam AI» — Mahalla Infratuzilmasi va Xalq Nazorati Tizimi
        </p>
        <p>
          O‘zbekiston Respublikasi shahar va tumanlarida obodonlashtirish hamda kommunal xizmatlar sifatini oshirishga yo‘naltirilgan zamonaviy platforma.
        </p>
        <p className="text-[11px] text-slate-400 pt-1">
          Versiya: 1.0.0 (Material 3 · Google Gemini AI Integratsiyasi)
        </p>
      </div>
    </div>
  );
};
