import React, { useState } from 'react';
import { Zap, Laptop, Plane, ShoppingBag, Smartphone, Tv, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, Activity, Cpu, BarChart3, TrendingUp, ShieldAlert, Layers } from 'lucide-react';
import axios from 'axios';

const PRESETS = [
  {
    id: 'macbook',
    title: 'Apple MacBook Air M3',
    merchant: 'Apple Store Express',
    category: 'Electronics',
    amount: 114900,
    icon: Laptop,
    badge: 'Purchase Protection',
    color: 'from-cyan-500 via-sky-500 to-indigo-600',
    borderColor: 'border-cyan-500/40'
  },
  {
    id: 'flight',
    title: 'IndiGo Flight (Delayed >6h)',
    merchant: 'IndiGo Airlines 6E-532',
    category: 'Travel',
    amount: 18500,
    icon: Plane,
    badge: 'Travel Delay Insurance',
    color: 'from-teal-500 via-emerald-500 to-cyan-600',
    borderColor: 'border-emerald-500/40'
  },
  {
    id: 'zara',
    title: 'Zara Tailored Suit',
    merchant: 'ZARA Retail Store',
    category: 'Apparel',
    amount: 6490,
    icon: ShoppingBag,
    badge: 'Return Protection',
    color: 'from-fuchsia-500 via-pink-500 to-rose-600',
    borderColor: 'border-fuchsia-500/40'
  },
  {
    id: 'iphone',
    title: 'iPhone 15 Pro Max',
    merchant: 'Imagine Apple Reseller',
    category: 'Cell Phone',
    amount: 139900,
    icon: Smartphone,
    badge: 'Cell Phone Protection',
    color: 'from-amber-500 via-orange-500 to-rose-600',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'tv',
    title: 'LG 55" 4K OLED TV',
    merchant: 'Reliance Digital',
    category: 'Home Appliance',
    amount: 85000,
    icon: Tv,
    badge: 'Extended Warranty',
    color: 'from-violet-500 via-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/40'
  }
];

export default function TransactionSimulator({ onTransactionProcessed, selectedCard }) {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0: Idle, 1: Stream, 2: AI Match, 3: Auto Claim, 4: Complete
  const [latestResult, setLatestResult] = useState(null);
  
  // Custom Transaction Form state
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [amount, setAmount] = useState('');

  const triggerTransaction = async (txData) => {
    setLoading(true);
    setLatestResult(null);
    
    // Animate Pipeline Workflow Steps
    setActiveStep(1); // Kafka Stream
    await new Promise(r => setTimeout(r, 400));
    setActiveStep(2); // AI Benefit Matching Engine
    await new Promise(r => setTimeout(r, 500));
    setActiveStep(3); // Claim Auto-Fill Engine
    await new Promise(r => setTimeout(r, 400));

    try {
      const res = await axios.post('/api/transactions', {
        user_id: 1,
        card_id: selectedCard?.id || 1,
        merchant: txData.merchant,
        category: txData.category,
        amount: parseFloat(txData.amount),
        mcc: "5732",
        location: "Mumbai, IN"
      });

      setActiveStep(4);
      setLatestResult(res.data);
      if (onTransactionProcessed) {
        onTransactionProcessed(res.data);
      }
    } catch (err) {
      console.error("Error processing transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-3 font-mono">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kafka / Payment Gateway Ingestion Stream</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Real-Time <span className="gradient-text">Benefit Activation Engine</span>
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Simulate card swipes or e-commerce purchases. The AI Engine continuously monitors transaction streams, matches merchant categories to card insurance policies, pre-fills 95%+ of claim forms, and dispatches instant activation alerts.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 min-w-[240px] shadow-lg">
            <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Card Ingest Stream</span>
              <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {selectedCard?.card_name || "AMEX Platinum"} (**** {selectedCard?.card_number_last4 || "4092"})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Dashboard Status Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Widget 1: Stream Telemetry */}
        <div className="glass-panel-cyan rounded-3xl p-5 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider block font-mono">Ingestion Radar</span>
            <h4 className="text-xl font-extrabold text-white mt-1 font-heading">1,420 pkts/s</h4>
            <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> 0.8ms Kafka Stream Latency
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-lg">
            <Zap className="w-6 h-6 animate-radar" />
          </div>
        </div>

        {/* Widget 2: AI Rule Engine */}
        <div className="glass-panel-fuchsia rounded-3xl p-5 border border-fuchsia-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-fuchsia-300 font-bold uppercase tracking-wider block font-mono">AI Matching Rate</span>
            <h4 className="text-xl font-extrabold text-white mt-1 font-heading">98.4% Match</h4>
            <span className="text-[10px] text-fuchsia-300 font-mono mt-1 block">RandomForest Policy Classifier</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300 shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Widget 3: Fraud Risk Engine */}
        <div className="glass-panel-emerald rounded-3xl p-5 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block font-mono">Fraud Risk ML</span>
            <h4 className="text-xl font-extrabold text-emerald-400 mt-1 font-heading">&lt;0.25 LOW</h4>
            <span className="text-[10px] text-emerald-300 font-mono mt-1 block">IsolationForest Anomaly Detector</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Widget 4: Auto Payout Recovery */}
        <div className="glass-panel-amber rounded-3xl p-5 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block font-mono">Instant Payouts</span>
            <h4 className="text-xl font-extrabold text-amber-300 mt-1 font-heading">₹4,85,000</h4>
            <span className="text-[10px] text-amber-400 font-mono mt-1 block">Zero Friction Settlement</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Preset Transaction Trigger Grid */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-heading">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Select a Sample Purchase to Simulate Live Detection
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                disabled={loading}
                onClick={() => triggerTransaction(preset)}
                className="group text-left p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${preset.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-2 font-mono uppercase">
                    {preset.badge}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 font-heading">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{preset.merchant}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white font-heading">₹{preset.amount.toLocaleString()}</span>
                  <div className="p-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Flow Visualizer Pipeline */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Real-Time Pipeline Execution Steps
          </h3>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
            4 Pipeline Workers Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              step: 1, 
              label: '1. Transaction Ingestion', 
              desc: 'Captured via Kafka stream & Payment Gateway', 
              icon: Zap,
              iconBg: 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25',
              activeBg: 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-cyan-500/20',
              colorTag: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
            },
            { 
              step: 2, 
              label: '2. AI Rule Engine Match', 
              desc: 'RandomForest ML matches MCC to policy terms', 
              icon: Sparkles,
              iconBg: 'bg-gradient-to-tr from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/25',
              activeBg: 'bg-fuchsia-500/15 border-fuchsia-500 text-fuchsia-300 shadow-fuchsia-500/20',
              colorTag: 'border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-400'
            },
            { 
              step: 3, 
              label: '3. Auto-Claim Generator', 
              desc: 'Pre-fills 95%+ of claim metadata & incident log', 
              icon: ShieldCheck,
              iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25',
              activeBg: 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-emerald-500/20',
              colorTag: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
            },
            { 
              step: 4, 
              label: '4. Instant Alert & Draft', 
              desc: 'Dispatches notification stream & saves draft', 
              icon: CheckCircle2,
              iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25',
              activeBg: 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-amber-500/20',
              colorTag: 'border-amber-500/40 bg-amber-500/10 text-amber-400'
            }
          ].map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.step;
            const isCompleted = activeStep > s.step;
            return (
              <div 
                key={s.step} 
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isCurrent 
                    ? `${s.activeBg} shadow-lg scale-[1.02]` 
                    : isCompleted 
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${s.iconBg} ${isCurrent ? 'animate-bounce scale-110' : ''}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono border ${s.colorTag}`}>
                    Step 0{s.step}
                  </span>
                </div>
                <h4 className={`text-xs font-extrabold font-heading ${isCurrent ? 'text-cyan-300' : isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                  {s.label}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Display & Auto-Generated Claim Preview */}
      {latestResult && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/40 bg-purple-950/20 animate-fadeIn shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-inner shrink-0">
                <CheckCircle2 className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                    <span>AUTOMATICALLY SENT TO ADMIN CONSOLE FOR APPROVE / REJECT</span>
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                    STATUS: {latestResult.auto_claim_draft?.status || 'VERIFICATION'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mt-2 font-heading">
                  Qualifies for {latestResult.transaction?.detected_benefit_code?.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  Claim generated and transmitted live to the Underwriter Admin Console for Approve or Reject decision.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-mono">AI Match Confidence</span>
              <span className="text-2xl font-extrabold text-cyan-400 font-heading">
                {Math.round((latestResult.transaction?.confidence_score || 0.98) * 100)}%
              </span>
            </div>
          </div>

          {/* Claim Draft & Admin Transmitted Breakdown */}
          {latestResult.auto_claim_draft && (
            <div className="mt-6 pt-6 border-t border-purple-500/20 grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Claim Reference</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">{latestResult.auto_claim_draft.claim_id}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Requested Payout</span>
                <span className="text-sm font-bold text-emerald-400 font-heading">₹{latestResult.transaction?.amount?.toLocaleString() || latestResult.auto_claim_draft.coverage_limit?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Fraud Risk Model</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  Score: {latestResult.auto_claim_draft.fraud_score} ({latestResult.auto_claim_draft.risk_level})
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Admin Decision Queue</span>
                <span className="text-sm font-bold text-amber-300 flex items-center gap-1 font-mono">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Pending Admin Review
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Transaction Form */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 font-heading">Or Enter a Custom Credit Card Swipe</h3>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          if (merchant && amount) {
            triggerTransaction({ merchant, category, amount });
          }
        }} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Merchant Name</label>
            <input 
              type="text" 
              placeholder="e.g. Croma Electronics, Taj Hotel" 
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Purchase Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none transition"
            >
              <option value="Electronics">Electronics</option>
              <option value="Travel">Travel / Airlines</option>
              <option value="Apparel">Apparel / Clothing</option>
              <option value="Cell Phone">Cell Phone</option>
              <option value="Home Appliance">Home Appliance</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Amount (₹)</label>
            <input 
              type="number" 
              placeholder="e.g. 45000" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none transition"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>{loading ? "Processing..." : "Simulate Swipe"}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
