import { MahallaReport, AIAnalysisResult, UserProfile } from '../types';
import { INITIAL_REPORTS } from '../data/mockReports';

const STORAGE_KEY_REPORTS = 'mahallam_ai_reports_v1';
const STORAGE_KEY_PROFILE = 'mahallam_ai_profile_v1';
const STORAGE_KEY_DEMO_MODE = 'mahallam_ai_demo_mode_v1';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-9901',
  fullName: 'Azizbek Rahimov',
  phone: '+998 (90) 123-45-67',
  region: 'Toshkent shahri',
  district: 'Mirobod tumani',
  mahallaName: 'Do‘stlik mahallasi',
};

export const apiService = {
  // Load reports from LocalStorage or seed with INITIAL_REPORTS
  getReports(): MahallaReport[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read reports from storage:', e);
    }
    this.saveReports(INITIAL_REPORTS);
    return INITIAL_REPORTS;
  },

  saveReports(reports: MahallaReport[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports to storage:', e);
    }
  },

  addReport(newReport: Omit<MahallaReport, 'id' | 'createdAt'>): MahallaReport {
    const reports = this.getReports();
    const created: MahallaReport = {
      ...newReport,
      id: `rep-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    const updated = [created, ...reports];
    this.saveReports(updated);
    return created;
  },

  resetToDefault(): MahallaReport[] {
    this.saveReports(INITIAL_REPORTS);
    return INITIAL_REPORTS;
  },

  // User Profile
  getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read profile:', e);
    }
    return DEFAULT_USER_PROFILE;
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  },

  // Demo Mode
  isDemoMode(): boolean {
    const val = localStorage.getItem(STORAGE_KEY_DEMO_MODE);
    return val === null ? true : val === 'true';
  },

  setDemoMode(isDemo: boolean): void {
    localStorage.setItem(STORAGE_KEY_DEMO_MODE, isDemo ? 'true' : 'false');
  },

  // Gemini API analysis
  async analyzePhoto(imageBase64: string, userPrompt?: string): Promise<AIAnalysisResult> {
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          userPrompt,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server xatosi: ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('Backend API unavailable, using client fallback:', err);
      return {
        categoryKey: 'ROAD',
        categoryTitleUz: 'Yo‘l muammosi',
        issueTitleUz: 'Yo‘ldagi jiddiy chuqurlik',
        professionalDescriptionUz:
          'Ko‘cha yo‘l qoplamasida chuqurlik aniqlangan bo‘lib, transport vositalari harakati xavfsizligiga tahdid solmoqda. Ta’mirlash choralari ko‘rilishi so‘raladi.',
        safetyRecommendationUz:
          'Transport vositalari haydovchilariga ushbu yo‘l qismida tezlikni kamaytirish tavsiya etiladi.',
        severityLevel: 'O‘rtacha',
        confidenceNote:
          'Birlamchi tahlil sun’iy intellekt tomonidan amalga oshirildi. Joyida mutaxassis tasdiqlashi lozim.',
        isDemoFallback: true,
      };
    }
  },

  // Gemini Chat
  async sendChatMessage(message: string, history: Array<{ role: 'user' | 'model'; text: string }>): Promise<{ reply: string; isDemoFallback?: boolean }> {
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server xatosi: ${res.statusText}`);
      }

      return await res.json();
    } catch (err: any) {
      return {
        reply:
          'Mahallangizdagi muammo bo‘yicha tezkor xabar berish uchun ilovadagi "Murojaat" tugmasidan foydalanishingiz yoki tuman xalq qabulxonasiga (1000) qo‘ng‘iroq qilishingiz mumkin.',
        isDemoFallback: true,
      };
    }
  },
};
