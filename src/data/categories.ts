import { CategoryKey, ReportCategory, StatusKey, ReportStatus } from '../types';

export const CATEGORIES: Record<CategoryKey, ReportCategory> = {
  ROAD: {
    key: 'ROAD',
    titleUz: 'Yo‘l muammosi',
    icon: 'Car',
    color: '#0284C7', // Sky Blue
    bgColor: '#E0F2FE',
  },
  WASTE: {
    key: 'WASTE',
    titleUz: 'Chiqindi',
    icon: 'Trash2',
    color: '#D97706', // Amber
    bgColor: '#FEF3C7',
  },
  LIGHTING: {
    key: 'LIGHTING',
    titleUz: 'Ko‘cha chiroqlari',
    icon: 'Lightbulb',
    color: '#F59E0B', // Yellow
    bgColor: '#FEF9C3',
  },
  WATER: {
    key: 'WATER',
    titleUz: 'Suv ta’minoti',
    icon: 'Droplets',
    color: '#0284C7', // Sky
    bgColor: '#E0F2FE',
  },
  ELECTRICITY: {
    key: 'ELECTRICITY',
    titleUz: 'Elektr energiyasi',
    icon: 'Zap',
    color: '#8B5CF6', // Purple
    bgColor: '#EDE9FE',
  },
  OTHER: {
    key: 'OTHER',
    titleUz: 'Boshqa muammolar',
    icon: 'Layers',
    color: '#059669', // Emerald
    bgColor: '#D1FAE5',
  },
};

export const STATUSES: Record<StatusKey, ReportStatus> = {
  NEW: {
    key: 'NEW',
    titleUz: 'Yangi',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    badgeClass: 'text-sky-700 bg-sky-50 border border-sky-200',
  },
  IN_REVIEW: {
    key: 'IN_REVIEW',
    titleUz: 'Ko‘rib chiqilmoqda',
    color: '#D97706',
    bgColor: '#FEF3C7',
    badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200',
  },
  IN_PROGRESS: {
    key: 'IN_PROGRESS',
    titleUz: 'Jarayonda',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    badgeClass: 'text-purple-700 bg-purple-50 border border-purple-200',
  },
  RESOLVED: {
    key: 'RESOLVED',
    titleUz: 'Hal qilindi',
    color: '#059669',
    bgColor: '#D1FAE5',
    badgeClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  },
};
