import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, TrendingUp, AlertCircle, Clock, CheckCircle2, Award, Zap, DollarSign, Sparkles, ChevronRight, Lock, Wifi, ShieldAlert, RotateCw, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function BenefitWallet({ selectedCard, userProfile }) {
  const [healthData, setHealthData] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedCard]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cardType = selectedCard?.card_type || "Platinum";
      const [hRes, pRes] = await Promise.all([
        axios.get('/api/analytics/health-score/1'),
        axios.get(`/api/benefits/policies?card_type=${cardType}`)
      ]);
      setHealthData(hRes.data);
      setPolicies(pRes.data);
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = activeFilter === 'ALL'
    ? policies
    : policies.filter(p => p.benefit_code === activeFilter);

  const healthScore = healthData?.benefit_health_score || 92;
  const strokeDashoffset = 283 - (283 * healthScore) / 100;

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Visual Credit Card & Health Score Dual Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Interactive 3D Metallic Credit Card Preview */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden flex flex-col justify-between group shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          {/* Card Head */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black tracking-widest text-cyan-400 uppercase flex items-center gap-1.5 font-mono bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> AMEX VERIFIED
              </span>
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE COVERAGE
              </span>
            </div>

            {/* Flippable 3D Metallic Credit Card */}
            <div
              className="my-6 cursor-pointer select-none [perspective:1000px] group w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none"
              onClick={() => setIsFlipped(!isFlipped)}
              title="Tap card to flip"
            >
              <div className={`relative w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>

                {/* FRONT SIDE */}
                <div className="p-6 rounded-2xl card-holo border border-slate-700/80 shadow-2xl relative overflow-hidden [backface-visibility:hidden]">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between">
                    {/* Metallic Gold EMV Chip & Contactless Icon */}
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 border border-amber-200/60 shadow-lg flex items-center justify-center p-1 relative overflow-hidden">
                        <div className="w-full h-full border border-amber-800/40 rounded-sm grid grid-cols-2 gap-0.5 opacity-80" />
                      </div>
                      <Wifi className="w-5 h-5 text-slate-400/80 rotate-90" />
                    </div>

                    <span className="text-sm font-black italic tracking-widest text-slate-100 font-heading">
                      {selectedCard?.issuer || "AMERICAN EXPRESS"}
                    </span>
                  </div>

                  <div className="my-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase tracking-widest">
                        CARD NUMBER
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCardNumber(!showCardNumber);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 transition px-2 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1 bg-cyan-500/10 rounded-md border border-cyan-500/20 shadow-sm"
                        title={showCardNumber ? "Hide Full Card Number" : "Reveal Full Card Number"}
                      >
                        {showCardNumber ? <EyeOff className="w-3 h-3 text-cyan-400" /> : <Eye className="w-3 h-3 text-cyan-400" />}
                        <span>{showCardNumber ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                    <span className="text-xl font-mono font-bold tracking-widest text-white drop-shadow-md">
                      {showCardNumber
                        ? `3782 8224 9100 ${selectedCard?.card_number_last4 || "4092"}`
                        : `•••• •••• •••• ${selectedCard?.card_number_last4 || "4092"}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono uppercase tracking-wider">CARDHOLDER</span>
                      <span className="font-extrabold text-slate-100 uppercase tracking-wider font-heading">{userProfile?.name || "SAYAN RUDRA"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono uppercase tracking-wider">VALID THRU</span>
                      <span className="font-extrabold text-slate-100 font-mono">{selectedCard?.expiry_date || "08/28"}</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-500/40 shadow-sm uppercase tracking-wider font-mono">
                      {selectedCard?.card_type || "PLATINUM"}
                    </div>
                  </div>

                  {/* Tap Hint Badge */}
                  <div className="mt-4 pt-2.5 border-t border-slate-700/60 flex items-center justify-center gap-1.5 text-[11px] text-cyan-300 font-mono font-bold animate-pulse">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Tap Card to Reveal CVV</span>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="absolute inset-0 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 shadow-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">

                  {/* Magnetic Strip */}
                  <div className="-mx-6 -mt-2 h-10 bg-slate-950 border-y border-slate-800 relative flex items-center justify-end px-4">
                    <span className="text-[8px] font-mono text-slate-600 tracking-widest uppercase">MAGNETIC STRIP</span>
                  </div>

                  {/* Signature & Toggleable Demo CVV Box */}
                  <div className="my-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                      <span>AUTHORIZED SIGNATURE</span>
                      <span className="text-cyan-400 font-bold">SECURITY CVV</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Signature Line */}
                      <div className="flex-1 h-9 rounded bg-slate-200/90 flex items-center px-3 font-serif italic text-slate-900 text-sm tracking-wider shadow-inner select-none">
                        {userProfile?.name || "Sayan Rudra"}
                      </div>

                      {/* Interactive Toggle CVV Box */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCvv(!showCvv);
                        }}
                        className="px-3 py-1.5 rounded bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-mono font-black text-sm tracking-widest shadow-lg flex items-center gap-1.5 transition"
                        title={showCvv ? "Hide CVV" : "Show CVV"}
                      >
                        {showCvv ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                            <span>849</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>•••</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Hologram & AMEX Verified Security Seal */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                    <div className="flex items-center space-x-2 bg-cyan-500/20 px-2.5 py-1 rounded-full border border-cyan-500/40 shadow-sm">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-400 animate-pulse border border-cyan-300" />
                      <span className="text-cyan-300 font-mono text-[10px] font-black uppercase tracking-wider">AMEX VERIFIED</span>
                    </div>

                    <div className="text-right">
                      <span className="text-cyan-400 font-mono font-bold block text-[11px]">
                        CVV: {showCvv ? "849" : "•••"}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">24/7 Protection Line</span>
                    </div>
                  </div>

                  {/* Tap to flip back badge */}
                  <div className="text-center text-[10px] text-cyan-300 font-mono font-semibold flex items-center justify-center gap-1">
                    <RotateCw className="w-3 h-3" />
                    <span>Tap Card to Flip Back</span>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Bottom Card Summary */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Embedded Insurance Policies:
            </span>
            <span className="font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              {policies.length} Active Policies
            </span>
          </div>
        </div>

        {/* Benefit Health Score & Recovery Metrics */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Health Gauge Box */}
          <div className="sm:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center space-x-6">

              {/* Circular SVG Gauge Visualizer */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#healthGradient)"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-white leading-none font-heading">
                    {healthScore}
                  </span>
                  <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest mt-1">
                    {healthData?.health_status || "EXCELLENT"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1 font-mono">
                  Card Protection Utilization Index
                </span>
                <h3 className="text-xl font-extrabold text-white font-heading">Benefit Health Score</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                  You are leveraging <strong className="text-emerald-400">92%</strong> of the insurance and protection benefits built into your card fees.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-right shrink-0">
              <span className="text-[11px] text-slate-400 block font-medium">Unclaimed Losses Prevented</span>
              <span className="text-xl font-extrabold text-emerald-400 block mt-0.5 font-heading">
                ↓ 68% Reduction
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">Zero Unclaimed Perks</span>
            </div>
          </div>

          {/* Financial Stats 1 */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20 shadow-inner">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <span className="text-xs text-slate-400 font-medium block">Unclaimed Benefit Money Saved</span>
              <h3 className="text-2xl font-extrabold text-white mt-1 font-heading">
                ₹{(healthData?.unclaimed_value_recovered || 67000).toLocaleString()}
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Recovered via Auto-Fill Claims
              </span>
            </div>
          </div>

          {/* Financial Stats 2 */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 w-fit border border-purple-500/20 shadow-inner">
              <Zap className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <span className="text-xs text-slate-400 font-medium block">Filing Time Saved</span>
              <h3 className="text-2xl font-extrabold text-white mt-1 font-heading">
                {healthData?.time_saved_minutes || 112} Mins
              </h3>
              <span className="text-[11px] text-purple-400 font-semibold mt-1 inline-block">
                ↓ 94% Manual Paperwork Effort
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Active Card Protections Vault */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-heading">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Active Benefit Policies Catalog ({selectedCard?.card_name || "AMEX Platinum"})
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Every purchase made on this card is automatically protected under these coverage policies.
            </p>
          </div>

          {/* Policy Category Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            {['ALL', 'PURCHASE_PROTECTION', 'TRAVEL_DELAY', 'RETURN_PROTECTION', 'CELL_PHONE_PROTECTION', 'EXTENDED_WARRANTY'].map(code => (
              <button
                key={code}
                onClick={() => setActiveFilter(code)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${activeFilter === code ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                {code === 'ALL' ? 'All Policies' : code.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPolicies.map((p) => (
            <div key={p.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase tracking-wider font-mono">
                    {p.benefit_code}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-heading">{p.benefit_name}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {p.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Coverage Limit</span>
                  <span className="font-extrabold text-white font-heading">₹{p.max_coverage_per_item?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Coverage Duration</span>
                  <span className="font-bold text-cyan-300">{p.coverage_days} Days</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Deductible</span>
                  <span className="font-semibold text-slate-300">₹{p.deductible}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Smart Expiry & Predictive Coverage Alerts */}
      <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 bg-amber-950/10">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-heading">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Predictive Coverage Reminders & Expiry Risk
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Croma TV Purchase Protection Expiring Soon</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                ₹48,500 OLED TV on AMEX Platinum. Protection window expires in 12 days. Claim draft ready if damaged!
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">IndiGo Flight Delay Claim Pre-filled</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                IndiGo 6E-532 ₹18,500 flight delay. 1-Click submit available to claim ₹12,400 hotel reimbursement.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
