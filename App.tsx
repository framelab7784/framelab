import React, { useState, useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext'; // Import useAuth
import { LanguageSwitcher } from './components/LanguageSwitcher';
import VideoGenerator from './components/VideoGenerator';
import type { Tab } from './types';
import SettingsModal from './components/SettingsModal';
import ImageEditor from './components/ImageEditor';
import { SettingsIcon, AspectRatioIcon, LightbulbIcon } from './components/icons';
import { VideoPromptGenerator } from './components/VideoPromptGenerator';
import AuthModal from './components/AuthModal'; // Import AuthModal
import { Spinner } from './components/Spinner';

const VideoCameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const LogoutIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const TabButton = ({ label, icon, isActive, onClick }: { label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors duration-200 ${
                isActive
                    ? 'border-lime-400 text-white'
                    : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
        >
            {icon}
            {label}
        </button>
    );
};

export default function App() {
  const { t } = useLanguage();
  const { user, loading, logout, verifySession } = useAuth(); // Get user and loading state from AuthContext
  const [activeTab, setActiveTab] = useState<Tab>('videoGenerator');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Efek untuk verifikasi sesi secara berkala
  useEffect(() => {
    if (!user) {
      return; // Jangan jalankan jika tidak ada pengguna
    }
    
    // Periksa sesi setiap 30 detik
    const intervalId = setInterval(() => {
      verifySession();
    }, 30000);

    // Membersihkan interval saat komponen dilepas atau pengguna berubah
    return () => clearInterval(intervalId);
  }, [user, verifySession]);

  if (loading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
            <Spinner className="h-10 w-10" />
        </div>
    );
  }

  if (!user) {
    return <AuthModal />; // Show login/register modal if not authenticated
  }

  return (
    <div className="bg-gray-900 text-gray-200 font-sans flex flex-col h-screen">
      <header className="flex items-center justify-between p-3 border-b border-gray-800/70 flex-shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
                <VideoCameraIcon className="w-5 h-5 text-lime-400" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-md font-bold text-white leading-tight">
                  Frame Lab
                  <span className="text-xs ml-2 font-mono bg-gray-700 px-1.5 py-0.5 rounded">1.0</span>
              </h1>
              <p className="text-xs text-gray-500 font-mono leading-tight">Modified by.FYAN.IT</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <p className="text-xs text-gray-400 hidden sm:block">{user.email}</p>
            <LanguageSwitcher />
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-md text-gray-400 bg-gray-800/80 hover:bg-gray-700/80 hover:text-white transition-colors"
                aria-label="Settings"
            >
                <SettingsIcon className="w-5 h-5" />
            </button>
             <button
                onClick={() => logout()}
                className="p-2 rounded-md text-gray-400 bg-red-800/40 hover:bg-red-700/60 hover:text-white transition-colors"
                aria-label="Logout"
            >
                <LogoutIcon className="w-5 h-5" />
            </button>
        </div>
      </header>

      <nav className="flex border-b border-gray-800/70 flex-shrink-0">
        <TabButton 
          label={t('videoGeneratorTab')} 
          icon={<VideoCameraIcon className="w-5 h-5"/>} 
          isActive={activeTab === 'videoGenerator'} 
          onClick={() => setActiveTab('videoGenerator')} 
        />
        <TabButton 
          label={t('imageEditorTab')} 
          icon={<AspectRatioIcon className="w-5 h-5"/>} 
          isActive={activeTab === 'imageEditor'} 
          onClick={() => setActiveTab('imageEditor')} 
        />
         <TabButton 
          label={t('navVideoPrompt')} 
          icon={<LightbulbIcon className="w-5 h-5"/>} 
          isActive={activeTab === 'videoPrompt'} 
          onClick={() => setActiveTab('videoPrompt')} 
        />
      </nav>

      <div className="flex-1 overflow-hidden">
        <div style={{ display: activeTab === 'videoGenerator' ? 'block' : 'none', height: '100%' }}>
          <VideoGenerator />
        </div>
        <div style={{ display: activeTab === 'imageEditor' ? 'block' : 'none', height: '100%' }}>
          <ImageEditor />
        </div>
         <div style={{ display: activeTab === 'videoPrompt' ? 'block' : 'none', height: '100%' }}>
          <VideoPromptGenerator />
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}