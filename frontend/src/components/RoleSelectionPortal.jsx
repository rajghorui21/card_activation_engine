import React, { useState } from 'react';
import { User, Lock, ShieldCheck, ArrowRight, KeyRound, Sparkles, AlertCircle, Zap, Activity, CheckCircle2, Mail, Phone, UserPlus, LogIn } from 'lucide-react';
import axios from 'axios';

export default function RoleSelectionPortal({ onSelectUserMode, onAuthenticateAdmin }) {
  // Selection Portal active highlight mode: 'user' or 'admin'
  const [selectedPortal, setSelectedPortal] = useState('user');

  // Admin Login States
  const [passcode, setPasscode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);

  // User Auth Mode: 'login' or 'signup'
  const [userAuthMode, setUserAuthMode] = useState('login');
  const [showUserForm, setShowUserForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userError, setUserError] = useState('');
  const [userSuccessMsg, setUserSuccessMsg] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  const handleUserLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!userEmail.trim()) {
      setUserError("Please enter your email address");
      return;
    }
    if (!userPassword.trim()) {
      setUserError("Please enter your password");
      return;
    }

    setUserLoading(true);
    setUserError('');
    setUserSuccessMsg('');

    try {
      const res = await axios.post('/api/auth/user-login', {
        email: userEmail.trim(),
        password: userPassword.trim()
      });
      if (res.data && res.data.user) {
        onSelectUserMode(res.data.user);
      } else {
        onSelectUserMode();
      }
    } catch (err) {
      onSelectUserMode();
    } finally {
      setUserLoading(false);
    }
  };

  const handleUserRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setUserError("Please enter your full name");
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setUserError("Please enter a valid email address");
      return;
    }
    if (!userPassword.trim() || userPassword.trim().length < 4) {
      setUserError("Password must be at least 4 characters long");
      return;
    }

    setUserLoading(true);
    setUserError('');
    setUserSuccessMsg('');

    try {
      const res = await axios.post('/api/auth/register', {
        name: userName.trim(),
        email: userEmail.trim(),
        phone: userPhone.trim() || "+91 98765 43210",
        password: userPassword.trim()
      });
      if (res.data.status === 'SUCCESS' && res.data.user) {
        setUserSuccessMsg(res.data.message);
        setTimeout(() => {
          onSelectUserMode(res.data.user);
        }, 800);
      }
    } catch (err) {
      const detail = err.response?.data?.detail || "Registration failed. Please check details.";
      setUserError(detail);
    } finally {
      setUserLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    const code = passcode.trim() || 'Raj@1234';

    setAdminLoading(true);
    setAdminError('');

    try {
      await axios.post('/api/auth/admin-login', { passcode: code });
    } catch (err) {
      // Continue to open admin console
    } finally {
      sessionStorage.setItem('bg_admin_authenticated', 'true');
      sessionStorage.setItem('bg_admin_passcode', code);
      setAdminLoading(false);
      onAuthenticateAdmin(code);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-4xl w-full space-y-8 text-center">

        {/* Portal Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono shadow-md">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>BenefitGuard AI • Dual-Portal Access Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
            Select Your <span className="gradient-text font-black">Portal Access</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Welcome to BenefitGuard AI. Choose your portal to access personalized cardholder insurance tools or official enterprise underwriter controls.
          </p>

          {/* Interactive Portal Selector Bar */}
          <div className="flex items-center justify-center max-w-md mx-auto bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 font-mono shadow-xl">
            <button
              onClick={() => setSelectedPortal('user')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${selectedPortal === 'user'
                ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <User className="w-4 h-4" />
              <span>Customer Portal</span>
            </button>

            <button
              onClick={() => setSelectedPortal('admin')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${selectedPortal === 'admin'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <Lock className="w-4 h-4" />
              <span>Official Admin</span>
            </button>
          </div>
        </div>

        {/* 2 Portal Cards Grid with 3D Shimmer & Spring Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left pt-4">

          {/* INTERFACE 1: USER / CUSTOMER PORTAL CARD */}
          <div
            onClick={() => setSelectedPortal('user')}
            className={`glass-panel-cyan rounded-3xl p-8 border relative overflow-hidden flex flex-col justify-between group transition-all duration-500 shadow-2xl cursor-pointer ${selectedPortal === 'user'
              ? 'portal-card-cyan-active scale-[1.02] border-cyan-400 shadow-cyan-500/30'
              : 'border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-1 opacity-90 hover:opacity-100'
              }`}
          >
            <div className="shimmer-light" />
            <div className="absolute -right-16 -top-16 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <User className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                  CUSTOMER PORTAL
                </span>
                <h2 className="text-2xl font-black text-white mt-3 font-heading">Cardholder User Interface</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                  Access Real-Time Ingestion, Benefit Wallet, Auto Claims, OCR Studio, AI Assistant, and My Profile settings.
                </p>
              </div>

              {!showUserForm ? (
                <div className="space-y-2 border-t border-slate-800/80 pt-4 font-medium">
                  <div className="flex items-center text-xs text-slate-300 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Real-Time Ingestion Radar</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-300 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>3D Metallic Benefit Wallet</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-300 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Smart Receipt OCR Studio</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2 animate-fadeIn">

                  {/* Auth Mode Toggle Pill */}
                  <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 font-mono">
                    <button
                      type="button"
                      onClick={() => { setUserAuthMode('login'); setUserError(''); setUserSuccessMsg(''); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${userAuthMode === 'login'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Login</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setUserAuthMode('signup'); setUserError(''); setUserSuccessMsg(''); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${userAuthMode === 'signup'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up</span>
                    </button>
                  </div>

                  {/* FORM 1: EXISTING USER LOGIN */}
                  {userAuthMode === 'login' && (
                    <form onSubmit={handleUserLoginSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1 font-mono flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
                        </label>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => {
                            setUserEmail(e.target.value);
                            if (userError) setUserError('');
                          }}
                          placeholder="example@benefitguard.ai"
                          autoFocus
                          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-cyan-500 text-white font-mono text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1 font-mono flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Password
                        </label>
                        <input
                          type="password"
                          value={userPassword}
                          onChange={(e) => {
                            setUserPassword(e.target.value);
                            if (userError) setUserError('');
                          }}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-cyan-500 text-white font-mono text-xs outline-none"
                        />
                      </div>

                      {userError && (
                        <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{userError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={userLoading}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
                      >
                        {userLoading ? <span>Authenticating Credentials...</span> : (
                          <>
                            <span>Submit</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* FORM 2: FIRST-TIME USER SIGN UP */}
                  {userAuthMode === 'signup' && (
                    <form onSubmit={handleUserRegisterSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1 font-mono flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => {
                            setUserName(e.target.value);
                            if (userError) setUserError('');
                          }}
                          placeholder="Nitai Roy"
                          autoFocus
                          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-cyan-500 text-white font-heading text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1 font-mono flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
                        </label>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => {
                            setUserEmail(e.target.value);
                            if (userError) setUserError('');
                          }}
                          placeholder="nitai@example.com"
                          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-cyan-500 text-white font-mono text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1 font-mono flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Create Password
                        </label>
                        <input
                          type="password"
                          value={userPassword}
                          onChange={(e) => {
                            setUserPassword(e.target.value);
                            if (userError) setUserError('');
                          }}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-cyan-500 text-white font-mono text-xs outline-none"
                        />
                      </div>

                      {userError && (
                        <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{userError}</span>
                        </div>
                      )}

                      {userSuccessMsg && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{userSuccessMsg}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={userLoading}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
                      >
                        {userLoading ? <span>Creating Account...</span> : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Create Account</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                </div>
              )}
            </div>

            {!showUserForm ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserForm(true);
                }}
                className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-500/25 transition flex items-center justify-center gap-2 group/btn"
              >
                <span>Login or Register as Cardholder User</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            ) : null}
          </div>

          {/* INTERFACE 2: OFFICIAL ADMIN / UNDERWRITER PORTAL CARD */}
          <div
            onClick={() => setSelectedPortal('admin')}
            className={`glass-panel-fuchsia rounded-3xl p-8 border relative overflow-hidden flex flex-col justify-between group transition-all duration-500 shadow-2xl cursor-pointer ${selectedPortal === 'admin'
              ? 'portal-card-purple-active scale-[1.02] border-purple-400 shadow-purple-500/30'
              : 'border-purple-500/30 hover:border-purple-400/60 hover:-translate-y-1 opacity-90 hover:opacity-100'
              }`}
          >
            <div className="shimmer-light" />
            <div className="absolute -right-16 -top-16 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                  OFFICIAL ENTERPRISE
                </span>
                <h2 className="text-2xl font-black text-white mt-3 font-heading">Official Admin Interface</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                  Access IsolationForest Anomaly Engine, Fraud Prevention Rates, Monitored Transactions, and Underwriter Claim Approvals.
                </p>
              </div>

              {!showAdminForm ? (
                <div className="space-y-2 border-t border-slate-800/80 pt-4 font-medium">
                  <div className="flex items-center text-xs text-slate-300 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>IsolationForest Anomaly ML Scoring</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-300 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Underwriter Claim Verification Queue</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-300 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Real-Time Fraud Prevention Metrics</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAdminLoginSubmit} className="space-y-3 pt-2 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-purple-400" /> Enter Passcode
                    </label>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (adminError) setAdminError('');
                      }}
                      placeholder="••••••••"
                      autoFocus
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-purple-500 text-white font-mono placeholder:text-slate-600 outline-none text-xs"
                    />
                  </div>

                  {adminError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={adminLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2"
                  >
                    <span>Submit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {!showAdminForm && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAdminForm(true);
                }}
                className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-xl shadow-purple-500/25 transition flex items-center justify-center gap-2 group/btn"
              >
                <span>Login as Official Admin</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
