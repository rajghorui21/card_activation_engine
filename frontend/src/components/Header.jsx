import React, { useState } from 'react';
import { ShieldCheck, Bell, CreditCard, Sparkles, User, RefreshCw, Zap, CheckCircle2, ChevronDown, Activity, SlidersHorizontal, ShieldAlert, Cpu, Lock, KeyRound, LogOut, Trash2, X, Sun, Moon, Bot } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  userProfile,
  selectedCard,
  setSelectedCard,
  notifications,
  unreadCount,
  markNotificationsRead,
  clearNotifications,
  isAdminAuthenticated,
  onOpenAdminAuth,
  onLogoutAdmin,
  themeMode,
  toggleThemeMode,
  currentInterface,
  onSwitchInterface
}) {
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showCardMenu, setShowCardMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl">
      {/* Click outside backdrop */}
      {(showCardMenu || showNotifPopover) && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
          onClick={() => {
            setShowCardMenu(false);
            setShowNotifPopover(false);
          }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & System Name */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onSwitchInterface('select')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <ShieldCheck className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-heading">
                  BenefitGuard <span className="gradient-text font-black">{currentInterface === 'admin' ? 'Enterprise' : 'AI'}</span>
                </h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-sm animate-pulse ${
                  currentInterface === 'admin' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                }`}>
                  <Activity className="w-3 h-3 mr-1 text-cyan-400" /> {currentInterface === 'admin' ? 'ADMIN CONSOLE' : 'LIVE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                {currentInterface === 'admin' 
                  ? 'Official Enterprise Underwriter & Fraud Prevention Console' 
                  : 'Automated Card Insurance & Benefit Activation Platform'}
              </p>
            </div>
          </div>

          {/* Customer Navigation Tabs (ONLY IN USER MODE - My Profile cut from bar) */}
          {currentInterface === 'user' && (
            <nav className="hidden lg:flex items-center space-x-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner mr-4 lg:mr-6">
              {[
                { id: 'simulator', label: 'Real-Time Ingestion', icon: Zap },
                { id: 'wallet', label: 'Benefit Wallet', icon: CreditCard },
                { id: 'claims', label: 'Auto Claims', icon: ShieldCheck },
                { id: 'ocr', label: 'OCR Studio', icon: Sparkles },
                { id: 'chat', label: 'AI Assistant', icon: Bot }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Controls: User Mode vs Admin Mode Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">

            {/* Light / Dark Theme Mode Toggle Button */}
            <button
              onClick={toggleThemeMode}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-md flex items-center justify-center group"
              title={themeMode === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {themeMode === 'light' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* USER INTERFACE CONTROLS */}
            {currentInterface === 'user' && (
              <>
                {userProfile?.cards && (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowCardMenu(!showCardMenu);
                        setShowNotifPopover(false);
                      }}
                      className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all shadow-md group"
                      title="Switch Active Card Account"
                    >
                      <CreditCard className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />

                      {/* Desktop / Tablet View */}
                      <div className="text-left hidden md:block">
                        <span className="text-[10px] text-slate-400 block leading-none font-medium">Active Card Account</span>
                        <span className="text-xs font-bold text-white flex items-center gap-1 font-mono">
                          {selectedCard?.card_name || "American Express Platinum Reserve"} ({selectedCard?.card_number_prefix || "3782"} •••• {selectedCard?.card_number_last4 || "4092"})
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                        </span>
                      </div>

                      {/* Compact Mobile View */}
                      <div className="md:hidden flex items-center gap-1 text-xs font-bold text-white font-mono">
                        <span>{selectedCard?.card_number_prefix || "3782"} •••• {selectedCard?.card_number_last4 || "4092"}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                    </button>

                    {/* Popover Dropdown Menu */}
                    {showCardMenu && (
                      <div className="absolute right-0 mt-2 w-88 sm:w-96 max-w-[calc(100vw-2rem)] glass-panel rounded-2xl border border-slate-800 shadow-2xl p-3 z-50 animate-fadeIn">
                        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-cyan-400" />
                            <h3 className="text-xs font-bold text-white font-heading">Select Card Account</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                              {userProfile.cards.length} Cards Available
                            </span>
                          </div>
                          <button
                            onClick={() => setShowCardMenu(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Close menu"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                          {userProfile.cards.map((c) => {
                            const isSelected = selectedCard?.id === c.id;
                            return (
                              <div
                                key={c.id}
                                onClick={() => {
                                  setSelectedCard(c);
                                  setShowCardMenu(false);
                                }}
                                className={`p-2.5 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${isSelected
                                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-cyan-500/50 shadow-md'
                                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700'
                                  }`}
                              >
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs font-bold text-white font-heading">{c.card_name}</span>
                                    {c.is_active && (
                                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                        ACTIVE
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                                    {c.issuer} • {c.card_number_prefix} •••• {c.card_number_last4}
                                  </span>
                                </div>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Notifications Popover */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifPopover(!showNotifPopover);
                      setShowCardMenu(false);
                      if (!showNotifPopover) markNotificationsRead();
                    }}
                    className="relative p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all shadow-md group"
                    title="Real-Time Benefit Activation Alerts"
                  >
                    <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white shadow-md animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Popover */}
                  {showNotifPopover && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] glass-panel rounded-2xl border border-slate-800 shadow-2xl p-4 z-50 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-xs font-bold text-white font-heading">Activation Stream Alerts</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          {notifications.length > 0 && (
                            <button
                              onClick={clearNotifications}
                              className="text-[10px] text-slate-400 hover:text-rose-400 transition flex items-center gap-1 font-medium"
                            >
                              <Trash2 className="w-3 h-3" /> Clear All
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-6">No new notifications. Swipe a card in the simulator to test!</p>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition">
                              <div className="flex items-start gap-2.5">
                                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5 shrink-0">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                                  <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                                    {new Date(n.created_at || Date.now()).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar Pill Button - Tap Sayan Rudra to open My Profile */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 border rounded-xl px-3 py-1.5 shadow-md transition-all group ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-850'
                  }`}
                  title="Tap Sayan Rudra to open My Profile section"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-md group-hover:scale-105 transition-transform">
                    {userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'SR'}
                  </div>
                  <span className="text-xs font-extrabold hidden sm:block font-heading">
                    {userProfile?.name || "Sayan Rudra"}
                  </span>
                </button>

                {/* User Account Log Out Button */}
                <button
                  onClick={() => onSwitchInterface('select')}
                  className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                  title="Log Out of User Account"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span className="hidden md:inline font-mono">Log Out</span>
                </button>
              </>
            )}

            {/* OFFICIAL ADMIN INTERFACE CONTROLS */}
            {currentInterface === 'admin' && (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Official Underwriter Session</span>
                </div>

                <button
                  onClick={onLogoutAdmin}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-extrabold transition flex items-center gap-1.5 shadow-md"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Lock Session</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Mobile Nav (ONLY FOR USER MODE - My Profile cut from bar) */}
        {currentInterface === 'user' && (
          <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-800/80 overflow-x-auto gap-1 scrollbar-none px-1">
            {[
              { id: 'simulator', label: 'Ingest', icon: Zap },
              { id: 'wallet', label: 'Wallet', icon: CreditCard },
              { id: 'claims', label: 'Claims', icon: ShieldCheck },
              { id: 'ocr', label: 'OCR', icon: Sparkles },
              { id: 'chat', label: 'AI Chat', icon: Bot }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-1.5 px-2.5 text-[10px] font-bold rounded-xl transition-all shrink-0 ${activeTab === tab.id
                  ? 'text-cyan-300 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
              >
                <tab.icon className={`w-4 h-4 mb-0.5 ${activeTab === tab.id ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
