export type CategoryKey = 'ROAD' | 'WASTE' | 'LIGHTING' | 'WATER' | 'ELECTRICITY' | 'OTHER';

export type StatusKey = 'NEW' | 'IN_REVIEW' | 'IN_PROGRESS' | 'RESOLVED';

export interface ReportCategory {
  key: CategoryKey;
  titleUz: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface ReportStatus {
  key: StatusKey;
  titleUz: string;
  color: string;
  bgColor: string;
  badgeClass: string;
}

export interface MahallaReport {
  id: string;
  title: string;
  description: string;
  category: CategoryKey;
  status: StatusKey;
  latitude: number;
  longitude: number;
  address: string;
  mahalla: string;
  imageUrl?: string;
  createdAt: number;
  isDemo: boolean;
  severity: 'Past' | 'O‘rtacha' | 'Yuqori' | 'Shoshilinch';
  aiRecommendation?: string;
  officialResponse?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  region: string;
  district: string;
  mahallaName: string;
  avatarUrl?: string;
}

export interface AIAnalysisResult {
  categoryKey: CategoryKey;
  categoryTitleUz: string;
  issueTitleUz: string;
  professionalDescriptionUz: string;
  safetyRecommendationUz: string;
  severityLevel: 'Past' | 'O‘rtacha' | 'Yuqori' | 'Shoshilinch';
  confidenceNote: string;
  isDemoFallback?: boolean;
}
