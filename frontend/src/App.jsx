import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Lock, LogOut } from 'lucide-react';
import Header from './components/Header';
import TransactionSimulator from './components/TransactionSimulator';
import BenefitWallet from './components/BenefitWallet';
import ClaimCenter from './components/ClaimCenter';
import OcrScanner from './components/OcrScanner';
import AiAssistant from './components/AiAssistant';
import UserProfile from './components/UserProfile';
import AdminConsole from './components/AdminConsole';
import AdminAuthModal from './components/AdminAuthModal';
import RoleSelectionPortal from './components/RoleSelectionPortal';

export default function App() {
  // Current Active Interface Mode: 'select', 'user', or 'admin'
  const [currentInterface, setCurrentInterface] = useState('select');
  const [activeTab, setActiveTab] = useState('simulator');
  const [userProfile, setUserProfile] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [claimsRefreshTrigger, setClaimsRefreshTrigger] = useState(0);

  // Admin access control states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('bg_admin_authenticated') === 'true';
  });
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);

  // Light / Dark Theme Mode state (Defaults to Light mode)
  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (themeMode === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile/1');
      setUserProfile(res.data);
      if (res.data.cards && res.data.cards.length > 0) {
        setSelectedCard(res.data.cards[0]);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const savedPasscode = sessionStorage.getItem('bg_admin_passcode') || 'Raj@1234';
      const res = await axios.get('/api/claims/notifications/stream', {
        headers: { 'X-Admin-Passcode': savedPasscode }
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleTransactionProcessed = (claimData) => {
    setNotifications(prev => [
      {
        id: Date.now(),
        title: `Auto Claim #${claimData.claim_id} Created`,
        message: `Benefit ${claimData.benefit_name} auto-triggered for ₹${claimData.requested_amount?.toLocaleString()}`,
        created_at: new Date().toISOString(),
        is_read: false
      },
      ...prev
    ]);
    setUnreadCount(prev => prev + 1);
    setClaimsRefreshTrigger(prev => prev + 1);
  };

  const markNotificationsRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleAdminAuthenticate = (passcode) => {
    setIsAdminAuthenticated(true);
    setCurrentInterface('admin');
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('bg_admin_authenticated');
    sessionStorage.removeItem('bg_admin_passcode');
    setIsAdminAuthenticated(false);
    setCurrentInterface('select');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500">
      
      {/* Header Navigation Bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'admin') {
            setCurrentInterface('admin');
          } else {
            setCurrentInterface('user');
          }
          setActiveTab(tab);
        }}
        userProfile={userProfile}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        notifications={notifications}
        unreadCount={unreadCount}
        markNotificationsRead={markNotificationsRead}
        clearNotifications={clearNotifications}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminAuth={() => setShowAdminAuthModal(true)}
        onLogoutAdmin={handleAdminLogout}
        themeMode={themeMode}
        toggleThemeMode={toggleThemeMode}
        currentInterface={currentInterface}
        onSwitchInterface={(mode) => {
          setCurrentInterface(mode);
          if (mode === 'admin') setActiveTab('admin');
          if (mode === 'user' && activeTab === 'admin') setActiveTab('simulator');
        }}
      />

      {/* Landing Portal Selection View (If no interface selected yet) */}
      {currentInterface === 'select' ? (
        <RoleSelectionPortal 
          onSelectUserMode={(userData) => {
            if (userData) {
              setUserProfile(userData);
              if (userData.cards && userData.cards.length > 0) {
                setSelectedCard(userData.cards[0]);
              }
            }
            setCurrentInterface('user');
            setActiveTab('simulator');
          }}
          onAuthenticateAdmin={handleAdminAuthenticate}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            
            {/* USER INTERFACE TABS */}
            {currentInterface === 'user' && (
              <>
                {activeTab === 'simulator' && (
                  <TransactionSimulator 
                    onTransactionProcessed={handleTransactionProcessed} 
                    selectedCard={selectedCard}
                  />
                )}

                {activeTab === 'wallet' && (
                  <BenefitWallet 
                    selectedCard={selectedCard}
                    userProfile={userProfile}
                  />
                )}

                {activeTab === 'claims' && (
                  <ClaimCenter 
                    userProfile={userProfile}
                    refreshTrigger={claimsRefreshTrigger}
                  />
                )}

                {activeTab === 'ocr' && (
                  <OcrScanner />
                )}

                {activeTab === 'chat' && (
                  <AiAssistant />
                )}

                {activeTab === 'profile' && (
                  <UserProfile 
                    userProfile={userProfile}
                    selectedCard={selectedCard}
                    setSelectedCard={setSelectedCard}
                  />
                )}
              </>
            )}

            {/* OFFICIAL ADMIN INTERFACE */}
            {currentInterface === 'admin' && (
              <AdminConsole 
                isAdminAuthenticated={isAdminAuthenticated}
                onAuthenticate={handleAdminAuthenticate}
                onLogout={handleAdminLogout}
              />
            )}

          </main>
      )}

      {/* Admin Authentication Modal */}
      <AdminAuthModal 
        isOpen={showAdminAuthModal}
        onClose={() => setShowAdminAuthModal(false)}
        onSuccess={handleAdminAuthenticate}
      />

      {/* Global Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 mt-12 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>BenefitGuard AI Engine v1.0 • Real-Time Card Protection System</span>
          </div>

          <p>© 2026 BenefitGuard AI. Built for Card Insurance & Benefit Activation Challenge.</p>
        </div>
      </footer>

    </div>
  );
}
