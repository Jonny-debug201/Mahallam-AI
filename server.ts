import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Mahallam AI',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Photo Analysis Endpoint
app.post('/api/gemini/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userPrompt } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Rasm ma’lumotlari topilmadi (imageBase64 required).' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful smart fallback when Gemini API key is not configured
      res.json({
        categoryKey: 'ROAD',
        categoryTitleUz: 'Yo‘l muammosi',
        issueTitleUz: 'Yo‘l qoplamasidagi chuqurlik va yoriqlar',
        professionalDescriptionUz:
          'Mahalla ichki yo‘lida chuqurliklar vujudga kelgan, transport vositalari va piyodalar harakatiga xalaqit bermoqda. Asfalt qoplamasini ta’mirlash talab etiladi.',
        safetyRecommendationUz:
          'Harakatlanish chog‘ida ushbu yo‘l qismidan ehtiyotkorlik bilan o‘tish tavsiya qilinadi.',
        severityLevel: 'O‘rtacha',
        confidenceNote:
          'DIQQAT: Ushbu ma’lumot sun’iy intellekt tomonidan birlamchi vizual ko‘rik asosida tayyorlandi. Joyida mutaxassis tasdiqlashi lozim.',
        isDemoFallback: true,
      });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const promptText = `
Sen O‘zbekistondagi kommunal, obodonlashtirish va shahar infratuzilmasi muammolarini tahlil qiluvchi "Mahallam AI" aqlli tizimisan.
Foydalanuvchi yuklagan suratni diqqat bilan o‘rgan.

Quyidagi qat’iy qoidalarga rioya qil:
1. Barcha matnlar faqat o‘zbek tilida (lotin yozuvida) bo‘lishi shart.
2. Toifani quyidagilardan eng mos birontasiga ajrat:
   - "ROAD" (Yo‘l muammosi: chuqur, buzilgan asfalt, yo‘l belgisi, bordyur)
   - "WASTE" (Chiqindi: chiqindixona to‘lganligi, noqonuniy tashlandilar)
   - "LIGHTING" (Ko‘cha chiroqlari: yonmayotgan simyog‘och, singan chiroq)
   - "WATER" (Suv ta’minoti: ichimlik suvi oqishi, kanalizatsiya to‘lishi, ochiq lyuk)
   - "ELECTRICITY" (Elektr energiyasi: osilib qolgan simlar, transformator nosozligi)
   - "OTHER" (Boshqa muammolar: daraxt shoxlari sinishi, bolalar maydonchasi nosozligi va h.k.)
3. Rasmiy, professional va idoraviy yozishmalarga mos 2-3 jumlali tavsif tuz.
4. Fuqarolar xavfsizligi uchun amaliy tavsiya ber.
5. Hech qachon muammoni "rasman tasdiqlandi" deb da’vo qilma; har doim bu birlamchi sun’iy intellekt tahlili ekanligini qayd et.
${userPrompt ? `Foydalanuvchi qo‘shimcha izohi: "${userPrompt}"` : ''}
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categoryKey: {
              type: Type.STRING,
              description: 'One of: ROAD, WASTE, LIGHTING, WATER, ELECTRICITY, OTHER',
            },
            categoryTitleUz: {
              type: Type.STRING,
              description: 'Category title in Uzbek',
            },
            issueTitleUz: {
              type: Type.STRING,
              description: 'Short title for the report in Uzbek (max 8 words)',
            },
            professionalDescriptionUz: {
              type: Type.STRING,
              description: 'Formal Uzbek description for neighborhood authorities',
            },
            safetyRecommendationUz: {
              type: Type.STRING,
              description: 'Safety recommendation for citizens in Uzbek',
            },
            severityLevel: {
              type: Type.STRING,
              description: 'Severity: Past, O‘rtacha, Yuqori, or Shoshilinch',
            },
            confidenceNote: {
              type: Type.STRING,
              description: 'Note emphasizing that this visual report needs official field verification',
            },
          },
          required: [
            'categoryKey',
            'categoryTitleUz',
            'issueTitleUz',
            'professionalDescriptionUz',
            'safetyRecommendationUz',
            'severityLevel',
            'confidenceNote',
          ],
        },
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    res.json({
      ...parsedData,
      isDemoFallback: false,
    });
  } catch (error: any) {
    console.error('Gemini analyze error:', error);
    // Provide a resilient fallback so the citizen is never blocked
    res.status(200).json({
      categoryKey: 'OTHER',
      categoryTitleUz: 'Boshqa muammolar',
      issueTitleUz: 'Aniqlangan mahalla muammosi',
      professionalDescriptionUz:
        'Hududdagi obodonlashtirish holatini ko‘zdan kechirish va tegishli choralar ko‘rish so‘raladi.',
      safetyRecommendationUz:
        'Mahalladagi mas’ul organlarga qo‘shimcha xabar berishingiz mumkin.',
      severityLevel: 'O‘rtacha',
      confidenceNote:
        'Sun’iy intellekt tahlili vaqtida xatolik yuz berdi (' +
        (error?.message || 'Tarmoq xatosi') +
        '). Ma’lumotlarni mustaqil tahrirlashingiz mumkin.',
      isDemoFallback: true,
    });
  }
});

// AI Chat Consultation Endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Xabar matni kiritilmadi.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        reply:
          'Assalomu alaykum! Men "Mahallam AI" yordamchisiman. Mahalla obodonlashtirish, suv, elektr, yo‘llar yoki chiqindi masalalari bo‘yicha murojaat yuborishda sizga yordam bera olaman. Xabar berish uchun pastdagi "Murojaat" tugmasini bosing!',
        isDemoFallback: true,
      });
      return;
    }

    const systemInstruction = `
Sen "Mahallam AI" tizimining aqlli yordamchisisan.
Vazifang: O‘zbekiston fuqarolariga mahalla muammolarini (yo‘l, elektr, suv, chiqindi, ko‘cha chiroqlari, bolalar maydonchasi va boshqalar) xabar berishda, huquqiy va amaliy masalalarda maslahat berish.
Qoidalar:
- Faqat o‘zbek tilida (lotin yozuvida), samimiy, tushunarli va professional tilda javob ber.
- Muammo yuzaga kelganda kimga murojaat qilish kerakligini tushuntir (masalan, Mahalla fuqarolar yig‘ini raisi, Xalq qabulxonasi 1000, Obodonlashtirish boshqarmasi, Toshkent shahar "Xalq nazorati" portali, "Hududiy elektr tarmoqlari" 1154, "O‘zsuvta’minot" 1255).
- Hech qachon tekshirilmagan muammoni rasman tasdiqlandi deb da’vo qilma.
- Javoblaring ixcham va amaliy (3-5 jumla) bo‘lsin.
    `.trim();

    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
      history: formattedHistory,
    });

    const response = await chat.sendMessage({
      message: message,
    });

    res.json({
      reply: response.text || 'Javob shakllanmadi.',
      isDemoFallback: false,
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(200).json({
      reply:
        'Kechirasiz, sun’iy intellekt xizmati bilan bog‘lanishda vaqtinchalik uzilish yuz berdi. Iltimos, muammoingizni to‘g‘ridan-to‘g‘ri "Murojaat" bo‘limida ro‘yxatga oling.',
      isDemoFallback: true,
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mahallam AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
