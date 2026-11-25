import React, { useState, useRef } from 'react';
import { CategoryKey, MahallaReport } from '../types';
import { CATEGORIES } from '../data/categories';
import { apiService } from '../services/api';
import {
  Camera,
  UploadCloud,
  Sparkles,
  MapPin,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Car,
  Trash2,
  Lightbulb,
  Droplets,
  Zap,
  Layers,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface ReportScreenProps {
  onBack: () => void;
  onSubmitSuccess: (newReport: MahallaReport) => void;
  initialPhotoBase64?: string | null;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  onBack,
  onSubmitSuccess,
  initialPhotoBase64,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('ROAD');
  const [severity, setSeverity] = useState<'Past' | 'O‘rtacha' | 'Yuqori' | 'Shoshilinch'>('O‘rtacha');
  const [imagePreview, setImagePreview] = useState<string | null>(initialPhotoBase64 || null);
  const [latitude, setLatitude] = useState<number>(41.311081);
  const [longitude, setLongitude] = useState<number>(69.240562);
  const [address, setAddress] = useState('Toshkent shahri, Mirobod tumani, Nukus ko‘chasi');
  const [mahalla, setMahalla] = useState('Do‘stlik mahallasi');
  const [aiRecommendation, setAiRecommendation] = useState<string>('');

  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Camera modal state for live webcam
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Category Icon helper
  const renderCategoryIcon = (key: CategoryKey) => {
    switch (key) {
      case 'ROAD':
        return <Car className="w-4 h-4" />;
      case 'WASTE':
        return <Trash2 className="w-4 h-4" />;
      case 'LIGHTING':
        return <Lightbulb className="w-4 h-4" />;
      case 'WATER':
        return <Droplets className="w-4 h-4" />;
      case 'ELECTRICITY':
        return <Zap className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Fayl hajmi 10 MB dan oshmasligi kerak.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      triggerAIAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  // Trigger Gemini AI Analysis
  const triggerAIAnalysis = async (base64Img: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const res = await apiService.analyzePhoto(base64Img);
      if (res.categoryKey && CATEGORIES[res.categoryKey]) {
        setSelectedCategory(res.categoryKey);
      }
      if (!title || title.trim() === '') {
        setTitle(res.issueTitleUz || res.categoryTitleUz);
      }
      if (!description || description.trim() === '') {
        setDescription(res.professionalDescriptionUz);
      }
      if (res.safetyRecommendationUz) {
        setAiRecommendation(res.safetyRecommendationUz);
      }
      if (res.severityLevel) {
        setSeverity(res.severityLevel);
      }
      setSuccessNotice('Gemini AI suratni tahlil qildi va ma’lumotlarni avtomatik to‘ldirdi!');
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('AI tahlilida xatolik yuz berdi, lekin ma’lumotlarni qo‘lda kiritishingiz mumkin.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // GPS Location fetcher
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Qurilmangizda geolokatsiya qo‘llab-quvvatlanmaydi.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setAddress(`Toshkent shahri, GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Fallback to central Tashkent with realistic address
        setLatitude(41.311081);
        setLongitude(69.240562);
        setAddress('Toshkent shahri, Mirobod tumani, Oybek ko‘chasi');
        setIsLocating(false);
        setErrorMessage('Joylashuv aniqlanmadi, standart manzil tanlandi.');
        setTimeout(() => setErrorMessage(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Start live webcam
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setIsCameraActive(false);
      // Fallback to native file picker
      fileInputRef.current?.click();
    }
  };

  // Capture webcam snapshot
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      stopCamera();
      triggerAIAnalysis(dataUrl);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Iltimos, muammoning qisqa sarlavhasini kiriting.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Iltimos, muammoning batafsil tavsifini yozing.');
      return;
    }
    if (description.trim().length < 10) {
      setErrorMessage('Tavsif kamida 10 ta belgidan iborat bo‘lishi lozim.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReport = apiService.addReport({
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        status: 'NEW',
        latitude,
        longitude,
        address: address.trim(),
        mahalla: mahalla.trim(),
        imageUrl: imagePreview || undefined,
        isDemo: apiService.isDemoMode(),
        severity,
        aiRecommendation: aiRecommendation.trim() || undefined,
      });

      setIsSubmitting(false);
      onSubmitSuccess(newReport);
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMessage('Murojaatni saqlashda xatolik yuz berdi.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga</span>
        </button>
        <div className="text-right">
          <h1 className="text-lg font-bold text-slate-900">Murojaat yuborish</h1>
          <span className="text-[11px] text-slate-500">Mahalla obodonlashtirish xizmatiga</span>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
          <button onClick={() => setErrorMessage(null)}>
            <X className="w-3.5 h-3.5 text-rose-500" />
          </button>
        </div>
      )}

      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-emerald-900 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{successNotice}</div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Photo Upload & Camera Section */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Muammoning fotosurati <span className="text-emerald-600">(Google Gemini tahlili uchun)</span>
          </label>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
              <img
                src={imagePreview}
                alt="Yuklangan surat"
                className="w-full h-56 sm:h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerAIAnalysis(imagePreview)}
                    disabled={isAnalyzing}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                    <span>{isAnalyzing ? 'Tahlil qilinmoqda...' : 'AI bilan qayta tahlil'}</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center transition-colors shadow"
                  title="Suratni o‘chirish"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={startCamera}
                className="h-32 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2 transition-colors text-slate-600 hover:text-emerald-700 p-4"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold">Kamerani ochish</span>
                <span className="text-[10px] text-slate-400">Jonli suratga olish</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-32 rounded-2xl border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50/70 hover:bg-sky-50/30 flex flex-col items-center justify-center gap-2 transition-colors text-slate-600 hover:text-sky-700 p-4"
              >
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold">Galereyadan tanlash</span>
                <span className="text-[10px] text-slate-400">JPG, PNG formatida</span>
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
              <span>Google Gemini AI suratni tahlil qilib, toifa va rasmiy matn tayyorlamoqda...</span>
            </div>
          )}
        </div>

        {/* Category Picker */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            Muammo toifasi <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => {
              const cat = CATEGORIES[key];
              const isSelected = selectedCategory === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.bgColor, color: cat.color }}
                  >
                    {renderCategoryIcon(key)}
                  </div>
                  <span className="text-xs truncate">{cat.titleUz}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            Qisqa sarlavha <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masalan: Yo‘ldagi xavfli chuqurlik yoki oqayotgan quvur"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              Batafsil tavsif <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {description.length} belgi
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Muammoning aniq manzili, qachon vujudga kelgani va keltirayotgan xavfini bayon qiling..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors leading-relaxed"
          />
        </div>

        {/* AI Recommendations (editable) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <label className="block text-xs font-bold text-slate-800">
              Aholi uchun xavfsizlik tavsiyasi (AI tomonidan taklif etilgan)
            </label>
          </div>
          <input
            type="text"
            value={aiRecommendation}
            onChange={(e) => setAiRecommendation(e.target.value)}
            placeholder="Masalan: Ushbu yo‘lakdan tunda o‘tishda ehtiyot bo‘ling"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Severity selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            Muammoning xavflilik darajasi
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Past', 'O‘rtacha', 'Yuqori', 'Shoshilinch'] as const).map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setSeverity(lvl)}
                className={`py-2 rounded-xl text-xs font-semibold transition-colors ${
                  severity === lvl
                    ? lvl === 'Shoshilinch'
                      ? 'bg-rose-600 text-white'
                      : lvl === 'Yuqori'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* GPS Location & Mahalla */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              Aniqlangan joylashuv va Mahalla
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Aniqlanmoqda...' : 'GPS yangilash'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-slate-700 block">Manzil:</span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent border-b border-dashed border-slate-300 text-slate-600 text-xs py-0.5 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <span className="font-semibold text-slate-700 block">Mahalla nomi:</span>
                <input
                  type="text"
                  value={mahalla}
                  onChange={(e) => setMahalla(e.target.value)}
                  className="w-full bg-transparent border-b border-dashed border-slate-300 text-slate-600 text-xs py-0.5 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Yuborilmoqda...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Murojaatni tasdiqlash va yuborish</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Camera Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-md w-full relative shadow-2xl border border-slate-800">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-80 object-cover bg-black"
            />
            <div className="p-5 flex items-center justify-between bg-slate-900 text-white">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={captureSnapshot}
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 border-4 border-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                title="Rasmga olish"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <div className="w-16" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
