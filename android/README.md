# Mahallam AI — Android Mobil Ilovasi (Kotlin / Jetpack Compose)

Ushbu papka O‘zbekiston sharoitiga moslashtirilgan, mahalla muammolarini (yo‘l, chiqindi, ko‘cha chiroqlari, suv, elektr energiyasi) fotosurat va Google Gemini sun’iy intellekti orqali tezkor aniqlovchi rasmiy Android ilovasining to‘liq manba kodlarini o‘z ichiga oladi.

## Texnologiyalar
- **Til**: Kotlin 2.0+
- **UI Framework**: Jetpack Compose (Material 3)
- **Sun’iy Intellekt**: Google Gemini API (`gemini-1.5-flash` / `gemini-3.8-flash`)
- **Arxitektura**: MVVM (Model-View-ViewModel) + StateFlow
- **Xarita**: Google Maps Compose (Toshkent koordinatalari asosida)
- **Rasm yuklash**: Coil Compose
- **Bulut & Ma’lumotlar bazasi**: Firebase Firestore & Storage (Demo rejimida avtonom ishlaydi)

## Ishga tushirish (Android Studio)
1. Ushbu loyihani **Android Studio Ladybug (yoki undan yangi)** versiyasida oching.
2. `local.properties` faylida Gemini API kalitini kiriting:
   ```properties
   GEMINI_API_KEY=AIzaSy...
   MAPS_API_KEY=AIzaSy...
   ```
3. Firebase'dan `google-services.json` faylini `app/` papkasiga joylashtiring (Demo rejimida Firebase'siz ham ishlayveradi).
4. Emulyatorda yoki haqiqiy Android telefonida (Android 8.0 / API 26+) **Run** tugmasini bosing.
