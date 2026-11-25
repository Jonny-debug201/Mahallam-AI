import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  FileCode,
  Download,
  Terminal,
  Smartphone,
} from 'lucide-react';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeFile, setActiveFile] = useState<string>('MainActivity.kt');
  const [copied, setCopied] = useState(false);

  const FILES: Record<string, { lang: string; path: string; code: string }> = {
    'MainActivity.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/uz/mahallam/ai/MainActivity.kt',
      code: `package uz.mahallam.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.*
import uz.mahallam.ai.ui.screens.*
import uz.mahallam.ai.ui.theme.MahallamAITheme
import uz.mahallam.ai.viewmodel.MahallaViewModel

sealed class Screen(val route: String, val titleUz: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    object Home : Screen("home", "Bosh sahifa", Icons.Default.Home)
    object Map : Screen("map", "Xarita", Icons.Default.Map)
    object Report : Screen("report", "Murojaat", Icons.Default.AddCircle)
    object AI : Screen("ai", "AI Yordamchi", Icons.Default.AutoAwesome)
    object Profile : Screen("profile", "Profil", Icons.Default.Person)
    object Stats : Screen("stats", "Statistika", Icons.Default.BarChart)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MahallamAITheme {
                val navController = rememberNavController()
                val viewModel: MahallaViewModel = viewModel()
                val uiState by viewModel.uiState.collectAsState()

                val navItems = listOf(
                    Screen.Home,
                    Screen.Map,
                    Screen.Report,
                    Screen.AI,
                    Screen.Profile
                )

                Scaffold(
                    bottomBar = {
                        NavigationBar {
                            val navBackStackEntry by navController.currentBackStackEntryAsState()
                            val currentRoute = navBackStackEntry?.destination?.route

                            navItems.forEach { screen ->
                                NavigationBarItem(
                                    icon = { Icon(screen.icon, contentDescription = screen.titleUz) },
                                    label = { Text(screen.titleUz) },
                                    selected = currentRoute == screen.route,
                                    onClick = {
                                        if (currentRoute != screen.route) {
                                            navController.navigate(screen.route) {
                                                popUpTo(navController.graph.startDestinationId) { saveState = true }
                                                launchSingleTop = true
                                                restoreState = true
                                            }
                                        }
                                    }
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Home.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(Screen.Home.route) {
                            HomeScreen(
                                user = uiState.userProfile,
                                reports = uiState.reports,
                                isDemo = uiState.isDemoMode,
                                onNavigateToCreate = { navController.navigate(Screen.Report.route) },
                                onNavigateToMap = { navController.navigate(Screen.Map.route) }
                            )
                        }
                        composable(Screen.Map.route) {
                            MapScreen(reports = uiState.reports)
                        }
                        composable(Screen.Report.route) {
                            ReportProblemScreen(
                                viewModel = viewModel,
                                onSubmittedSuccess = {
                                    navController.navigate(Screen.Home.route) {
                                        popUpTo(Screen.Home.route) { inclusive = true }
                                    }
                                }
                            )
                        }
                        composable(Screen.AI.route) {
                            AIAssistantScreen(viewModel = viewModel)
                        }
                        composable(Screen.Profile.route) {
                            ProfileScreen(
                                user = uiState.userProfile,
                                onNavigateToStats = { navController.navigate(Screen.Stats.route) }
                            )
                        }
                        composable(Screen.Stats.route) {
                            StatisticsScreen(reports = uiState.reports)
                        }
                    }
                }
            }
        }
    }
}`,
    },
    'GeminiService.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/uz/mahallam/ai/data/service/GeminiService.kt',
      code: `package uz.mahallam.ai.data.service

import android.graphics.Bitmap
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import uz.mahallam.ai.BuildConfig
import uz.mahallam.ai.data.model.ReportCategory

data class AIAnalysisResult(
    val suggestedCategory: ReportCategory,
    val professionalDescriptionUz: String,
    val safetyRecommendationUz: String,
    val confidenceNote: String
)

class GeminiAssistantService {
    private val apiKey = BuildConfig.GEMINI_API_KEY

    private val generativeModel by lazy {
        if (apiKey.isNotEmpty()) {
            GenerativeModel(
                modelName = "gemini-1.5-flash",
                apiKey = apiKey
            )
        } else null
    }

    suspend fun analyzeProblemImage(bitmap: Bitmap): AIAnalysisResult = withContext(Dispatchers.IO) {
        if (generativeModel == null) {
            return@withContext AIAnalysisResult(
                suggestedCategory = ReportCategory.ROAD,
                professionalDescriptionUz = "Mahalla ichki yo'lida chuqurlik vujudga kelgan, transport vositalari harakatiga xalaqit bermoqda.",
                safetyRecommendationUz = "Harakatlanish chog'ida ushbu yo'l qismidan ehtiyotkorlik bilan o'tish tavsiya qilinadi.",
                confidenceNote = "[Demo tahlil]: Gemini API kaliti kiritilmagan. Xizmat demo holatida ishlamoqda."
            )
        }

        try {
            val prompt = """
                Sen O'zbekistondagi kommunal va obodonlashtirish muammolarini tahlil qiluvchi 'Mahallam AI' tizimisan.
                Suratni tahlil qil va faqat quyidagi tuzilmada o'zbek tilida (lotin yozuvida) javob ber:
                TOIFA: [YO_L | CHIQINDI | CHIRQ | SUV | ELEKTR | BOSHQA]
                TAVSIF: [Davlat organlariga yuborish uchun aniq, rasmiy va professional tilda yozilgan 2-3 jumlali tavsif]
                TAVSIYA: [Aholi uchun xavfsizlik yoki vaqtinchalik chora bo'yicha amaliy maslahat]
                ESLATMA: Tahlil sun'iy intellekt tomonidan birlamchi vizual ko'rik asosida tayyorlandi. Joyida mutaxassis tasdiqlashi lozim.
            """.trimIndent()

            val response = generativeModel!!.generateContent(
                content {
                    image(bitmap)
                    text(prompt)
                }
            )

            parseGeminiResponse(response.text ?: "")
        } catch (e: Exception) {
            AIAnalysisResult(
                suggestedCategory = ReportCategory.OTHER,
                professionalDescriptionUz = "Tahlil jarayonida tarmoq xatoligi yuz berdi.",
                safetyRecommendationUz = "Mahalla fuqarolar yig'iniga xabar berishingiz mumkin.",
                confidenceNote = "Xatolik: \${e.localizedMessage ?: "Noma'lum"}"
            )
        }
    }

    private fun parseGeminiResponse(rawText: String): AIAnalysisResult {
        var category = ReportCategory.OTHER
        if (rawText.contains("YO_L", true)) category = ReportCategory.ROAD
        else if (rawText.contains("CHIQINDI", true)) category = ReportCategory.WASTE
        else if (rawText.contains("CHIRQ", true)) category = ReportCategory.LIGHTING
        else if (rawText.contains("SUV", true)) category = ReportCategory.WATER
        else if (rawText.contains("ELEKTR", true)) category = ReportCategory.ELECTRICITY

        val desc = rawText.substringAfter("TAVSIF:", "Hududdagi muammo bartaraf etilishi lozim.").substringBefore("TAVSIYA:").trim()
        val rec = rawText.substringAfter("TAVSIYA:", "Ehtiyot choralari ko'rilsin.").substringBefore("ESLATMA:").trim()

        return AIAnalysisResult(
            suggestedCategory = category,
            professionalDescriptionUz = desc,
            safetyRecommendationUz = rec,
            confidenceNote = "Birlamchi sun'iy intellekt tahlili. Joyida mutaxassis tasdiqlashi lozim."
        )
    }
}`,
    },
    'Models.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/uz/mahallam/ai/data/model/Models.kt',
      code: `package uz.mahallam.ai.data.model

import java.util.UUID

enum class ReportCategory(val titleUz: String) {
    ROAD("Yo‘l muammosi"),
    WASTE("Chiqindi"),
    LIGHTING("Ko‘cha chiroqlari"),
    WATER("Suv ta’minoti"),
    ELECTRICITY("Elektr energiyasi"),
    OTHER("Boshqa muammolar")
}

enum class ReportStatus(val titleUz: String, val colorHex: Long) {
    NEW("Yangi", 0xFF0284C7),
    IN_REVIEW("Ko‘rib chiqilmoqda", 0xFFF59E0B),
    IN_PROGRESS("Jarayonda", 0xFF6366F1),
    RESOLVED("Hal qilindi", 0xFF10B981)
}

data class MahallaProblemReport(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val category: ReportCategory,
    val status: ReportStatus = ReportStatus.NEW,
    val latitude: Double,
    val longitude: Double,
    val address: String = "Toshkent shahri",
    val imageUrl: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val isDemo: Boolean = true,
    val aiRecommendation: String? = null
)

data class UserProfile(
    val id: String = "usr_001",
    val fullName: String = "Azizbek Rahimov",
    val phone: String = "+998 (90) 123-45-67",
    val mahallaName: String = "Do‘stlik mahallasi, Mirobod tumani"
)`,
    },
    'Theme.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/uz/mahallam/ai/ui/theme/Theme.kt',
      code: `package uz.mahallam.ai.ui.theme

import androidx.compose.material3.LightColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val BrandGreen = Color(0xFF059669)
val BrandGreenLight = Color(0xFFD1FAE5)
val BrandBlue = Color(0xFF0284C7)
val BrandBlueLight = Color(0xFFE0F2FE)
val BackgroundClean = Color(0xFFF8FAFC)
val SurfaceWhite = Color(0xFFFFFFFF)

private val MahallaColorScheme = LightColorScheme(
    primary = BrandGreen,
    onPrimary = Color.White,
    primaryContainer = BrandGreenLight,
    secondary = BrandBlue,
    onSecondary = Color.White,
    secondaryContainer = BrandBlueLight,
    background = BackgroundClean,
    surface = SurfaceWhite
)

@Composable
fun MahallamAITheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = MahallaColorScheme,
        typography = Typography(),
        content = content
    )
}`,
    },
    'build.gradle.kts': {
      lang: 'kotlin',
      path: 'app/build.gradle.kts',
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    id("com.google.gms.google-services") version "4.4.2" apply false
}

android {
    namespace = "uz.mahallam.ai"
    compileSdk = 35

    defaultConfig {
        applicationId = "uz.mahallam.ai"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        buildConfigField("String", "GEMINI_API_KEY", "\"${'$'}{project.findProperty("GEMINI_API_KEY") ?: ""}\"")
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.10.01"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.8.4")
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("com.google.maps.android:maps-compose:6.2.1")
    implementation("com.google.android.gms:play-services-maps:19.0.0")
    implementation("com.google.ai.client.generativeai:generativeai:0.9.0")
    implementation(platform("com.google.firebase:firebase-bom:33.6.0"))
    implementation("com.google.firebase:firebase-firestore-ktx")
}`,
    },
    'AndroidManifest.xml': {
      lang: 'xml',
      path: 'app/src/main/AndroidManifest.xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Mahallam AI"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">

        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="\${MAPS_API_KEY}" />

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(FILES[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-800 shadow-2xl flex flex-col h-[85vh] overflow-hidden text-slate-100">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Android Loyihasi (Kotlin · Jetpack Compose)</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Android Studio uchun to‘liq tayyor kodlar va konfiguratsiya
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none text-xs">
          {Object.keys(FILES).map((fname) => (
            <button
              key={fname}
              onClick={() => setActiveFile(fname)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeFile === fname
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{fname}</span>
            </button>
          ))}
        </div>

        {/* Code Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          <div className="px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono text-slate-400 truncate max-w-md">
              {FILES[activeFile].path}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Nusxalandi!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kodni nusxalash</span>
                </>
              )}
            </button>
          </div>

          <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
            <code>{FILES[activeFile].code}</code>
          </pre>
        </div>

        {/* Instructions footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-200 block">Android Studio'da ochish:</span>
            <span>Ushbu fayllarni Android Studio'dagi Empty Compose Activity loyihangizga joylashtiring.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors self-end sm:self-auto"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
