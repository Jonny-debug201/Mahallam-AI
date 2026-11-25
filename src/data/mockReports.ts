import { MahallaReport } from '../types';

export const INITIAL_REPORTS: MahallaReport[] = [
  {
    id: 'rep-001',
    title: 'Yo‘ldagi chuqurlik va yoriqlar',
    description:
      'Chilonzor 9-mavze, 14-uy oldidagi ichki yo‘lda 1 metr diametrli chuqurlik hosil bo‘lgan. Avtomobillar va tez yordam mashinalari o‘tishiga xalaqit bermoqda.',
    category: 'ROAD',
    status: 'IN_PROGRESS',
    latitude: 41.2825,
    longitude: 69.2152,
    address: 'Chilonzor 9-mavze, 14-uy oldi',
    mahalla: 'Katta Chilonzor 2-mahalla',
    createdAt: Date.now() - 1000 * 60 * 60 * 18, // 18 hours ago
    isDemo: true,
    severity: 'Yuqori',
    aiRecommendation:
      'Piyodalar va haydovchilar ushbu chuqurlik hududidan aylanib o‘tishlari, tunda sekin harakatlanishlari tavsiya etiladi.',
    officialResponse: 'Tuman obodonlashtirish bo‘limi tomonidan ta’mirlash brigadasi biriktirildi. 2 kunda yakunlanadi.',
  },
  {
    id: 'rep-002',
    title: 'To‘lib ketgan chiqindi qutilari',
    description:
      'Ko‘chadagi umumiy chiqindixona qutilari 3 kundan beri bo‘shatilmagan, shamol sababli mahalla bo‘ylab tarqalmoqda.',
    category: 'WASTE',
    status: 'NEW',
    latitude: 41.3005,
    longitude: 69.2625,
    address: 'Mirobod tumani, Nukus ko‘chasi 42-uy',
    mahalla: 'Temiryo‘lchilar mahallasi',
    createdAt: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    isDemo: true,
    severity: 'O‘rtacha',
    aiRecommendation:
      'Sanitariya xavfsizligi maqsadida bolalarning chiqindixona yaqinida o‘ynamasligini ta’minlash zarur.',
  },
  {
    id: 'rep-003',
    title: 'Yonmayotgan ko‘cha chiroqlari',
    description:
      'Yunusobod 12-mavze bo‘ylab 4 ta elektr chirog‘i 1 haftadan beri yonmayapti. Kechasi piyodalar harakati uchun qorong‘u va xavfli.',
    category: 'LIGHTING',
    status: 'IN_REVIEW',
    latitude: 41.3654,
    longitude: 69.2882,
    address: 'Yunusobod 12-mavze, Ahmad Donish ko‘chasi',
    mahalla: 'Uvaysiy mahallasi',
    createdAt: Date.now() - 1000 * 60 * 60 * 40, // ~1.5 days ago
    isDemo: true,
    severity: 'O‘rtacha',
    aiRecommendation: 'Kechasi ushbu yo‘lakdan o‘tishda shaxsiy fonardan foydalanish tavsiya etiladi.',
    officialResponse: 'Tuman elektr tarmoqlari korxonasiga tekshirish topshirig‘i berildi.',
  },
  {
    id: 'rep-004',
    title: 'Ichimlik suvi quvurida sizish',
    description:
      'Shota Rustaveli ko‘chasi kesishmasida ichimlik suvi quvuri yorilib, yo‘l chetida to‘planib qolmoqda.',
    category: 'WATER',
    status: 'RESOLVED',
    latitude: 41.2952,
    longitude: 69.2481,
    address: 'Yakkasaroy tumani, Bobur ko‘chasi 18-uy',
    mahalla: 'Do‘stlik mahallasi',
    createdAt: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    isDemo: true,
    severity: 'Shoshilinch',
    aiRecommendation: 'Suv oqimi yo‘l qoplamasini yuvib ketishi mumkin, ehtiyot bo‘ling.',
    officialResponse: 'Toshkent shahar suv ta’minoti xizmati avariya brigadasi tomonidan quvur to‘liq almashtirildi.',
  },
  {
    id: 'rep-005',
    title: 'Xavfli osilib qolgan simlar',
    description:
      'Shayxontohur tumani, Navoiy ko‘chasida daraxt shoxi sinib, elektr simini pastga tortib tushirgan.',
    category: 'ELECTRICITY',
    status: 'RESOLVED',
    latitude: 41.3198,
    longitude: 69.2415,
    address: 'Shayxontohur tumani, Samarqand Darvoza ko‘chasi',
    mahalla: 'Gulbozor mahallasi',
    createdAt: Date.now() - 1000 * 60 * 60 * 96, // 4 days ago
    isDemo: true,
    severity: 'Shoshilinch',
    aiRecommendation: 'Simlarga 10 metrdan yaqin bormang! Elektr toki xavfi mavjud.',
    officialResponse: 'FVV va hududiy elektr korxonasi daraxtni olib tashladi, elektr simlari qayta tortildi.',
  },
  {
    id: 'rep-006',
    title: 'Siniq bolalar supachasi va arg‘imchoq',
    description:
      'Bolalar maydonchasidagi bitta arg‘imchoq temir zanjiri uzilgan, xavfli o‘tkir burchak hosil bo‘lgan.',
    category: 'OTHER',
    status: 'IN_REVIEW',
    latitude: 41.3285,
    longitude: 69.2715,
    address: 'Mirzo Ulug‘bek tumani, Mustaqillik shoh ko‘chasi',
    mahalla: 'Olimlar mahallasi',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    isDemo: true,
    severity: 'Past',
    aiRecommendation: 'Arg‘imchoq ta’mirlanmaguncha bolalarni yaqinlashtirmang.',
  },
];
