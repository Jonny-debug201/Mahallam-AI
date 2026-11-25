import React, { useState, useEffect } from 'react';
import { MahallaReport, UserProfile, AIAnalysisResult } from './types';
import { apiService, DEFAULT_USER_PROFILE } from './services/api';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ReportScreen } from './components/ReportScreen';
import { AIAssistantScreen } from './components/AIAssistantScreen';
import { MapScreen } from './components/MapScreen';
import { MyReportsScreen } from './components/MyReportsScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ReportDetailModal } from './components/ReportDetailModal';
import { AndroidCodeModal } from './components/AndroidCodeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [reports, setReports] = useState<MahallaReport[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [selectedReport, setSelectedReport] = useState<MahallaReport | null>(null);
  const [isAndroidCodeOpen, setIsAndroidCodeOpen] = useState<boolean>(false);
  const [prefilledImage, setPrefilledImage] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedReports = apiService.getReports();
    setReports(loadedReports);
    const profile = apiService.getUserProfile();
    setUserProfile(profile);
    setIsDemoMode(apiService.isDemoMode());
  }, []);

  // Update profile
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    apiService.saveUserProfile(updated);
  };

  // Toggle demo mode
  const handleToggleDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    apiService.setDemoMode(enabled);
  };

  // Reset demo data
  const handleResetData = () => {
    const refreshed = apiService.resetToDefault();
    setReports([...refreshed]);
  };

  // New report submitted
  const handleReportSubmitted = (newReport: MahallaReport) => {
    setReports((prev) => [newReport, ...prev]);
    setActiveTab('my_reports');
    setSelectedReport(newReport);
  };

  // Apply AI analysis to report
  const handleApplyAIToReport = (analysis: AIAnalysisResult, imageBase64?: string) => {
    if (imageBase64) {
      setPrefilledImage(imageBase64);
    }
    setActiveTab('report');
  };

  // Navigate to map with report
  const handleNavigateToMapWithReport = (_report: MahallaReport) => {
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar adhering to the Top Bar contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
        isDemoMode={isDemoMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'home' && (
          <HomeScreen
            reports={reports}
            userProfile={userProfile}
            isDemoMode={isDemoMode}
            onNavigateToReport={() => {
              setPrefilledImage(null);
              setActiveTab('report');
            }}
            onNavigateToMap={() => setActiveTab('map')}
            onNavigateToMyReports={() => setActiveTab('my_reports')}
            onNavigateToAI={() => setActiveTab('ai_assistant')}
            onSelectReport={(rep) => setSelectedReport(rep)}
          />
        )}

        {activeTab === 'report' && (
          <ReportScreen
            onBack={() => setActiveTab('home')}
            onSubmitSuccess={handleReportSubmitted}
            initialPhotoBase64={prefilledImage}
          />
        )}

        {activeTab === 'ai_assistant' && (
          <AIAssistantScreen onApplyToReport={handleApplyAIToReport} />
        )}

        {activeTab === 'map' && (
          <MapScreen
            reports={reports}
            onSelectReport={(rep) => setSelectedReport(rep)}
            onNavigateToReport={() => {
              setPrefilledImage(null);
              setActiveTab('report');
            }}
          />
        )}

        {activeTab === 'my_reports' && (
          <MyReportsScreen
            reports={reports}
            onSelectReport={(rep) => setSelectedReport(rep)}
            onNavigateToCreate={() => {
              setPrefilledImage(null);
              setActiveTab('report');
            }}
          />
        )}

        {activeTab === 'stats' && <StatisticsScreen reports={reports} />}

        {activeTab === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            isDemoMode={isDemoMode}
            onToggleDemoMode={handleToggleDemoMode}
            onNavigateToMyReports={() => setActiveTab('my_reports')}
            onNavigateToStats={() => setActiveTab('stats')}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onNavigateToMap={handleNavigateToMapWithReport}
      />

      {/* Android Jetpack Compose Code Inspector Modal */}
      <AndroidCodeModal
        isOpen={isAndroidCodeOpen}
        onClose={() => setIsAndroidCodeOpen(false)}
      />
    </div>
  );
}
