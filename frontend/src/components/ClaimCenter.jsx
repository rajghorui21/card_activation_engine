import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Upload, ArrowRight, X, Clock, Sparkles, Zap, Lock, DollarSign, ChevronRight } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';

export default function ClaimCenter({ userProfile, refreshTrigger }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [incidentDescription, setIncidentDescription] = useState('');
  const [ocrVerified, setOcrVerified] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, [refreshTrigger]);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/claims?user_id=1');
      setClaims(res.data);
    } catch (err) {
      console.error("Error fetching claims:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenClaimModal = (claim) => {
    setSelectedClaim(claim);
    setIncidentDescription(claim.incident_description || '');
    setOcrVerified(claim.documents_count > 0);
  };

  const handleSubmitClaim = async () => {
    if (!selectedClaim) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`/api/claims/${selectedClaim.claim_id}/submit`, {
        claim_id: selectedClaim.claim_id,
        incident_description: incidentDescription,
        requested_amount: selectedClaim.requested_amount,
        documents: ocrVerified ? ["Receipt_Verified.png"] : []
      });

      if (res.data.current_status === "APPROVED" || res.data.auto_approved) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      await fetchClaims();
      setSelectedClaim(null);
    } catch (err) {
      console.error("Error submitting claim:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulateOcrUpload = async () => {
    setUploadingDoc(true);
    await new Promise(r => setTimeout(r, 600));
    setOcrVerified(true);
    setUploadingDoc(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono shadow-sm"><CheckCircle2 className="w-3.5 h-3.5"/> Approved</span>;
      case 'DRAFT':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-mono shadow-sm"><Zap className="w-3.5 h-3.5"/> Pre-filled Draft</span>;
      case 'VERIFICATION':
      case 'FRAUD_CHECK':
      case 'SUBMITTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-mono shadow-sm"><Clock className="w-3.5 h-3.5"/> In Review</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-mono shadow-sm"><AlertTriangle className="w-3.5 h-3.5"/> Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 font-mono">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Automated Pre-Fill Lifecycle Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-heading">Smart Claim Activation Center</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Claims detected by BenefitGuard AI are pre-filled automatically using your transaction data, policy limits, and cardholder profile. Review and submit with 1 click.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 font-mono shadow-md">
            Total Claims: {claims.length}
          </span>
        </div>
      </div>

      {/* Claims List Table / Grid */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <FileText className="w-5 h-5 text-cyan-400" />
            Active & Historical Protection Claims
          </h3>
        </div>

        {claims.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">No claims created yet.</p>
            <p className="text-xs text-slate-500 mt-1">Simulate a transaction in the Real-Time Simulator tab to auto-generate a claim draft!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {claims.map((claim) => (
              <div key={claim.id} className="p-6 hover:bg-slate-900/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0 shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-bold text-white font-heading">{claim.benefit_name}</h4>
                      <span className="text-xs font-semibold text-slate-400 font-mono">({claim.claim_id})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Merchant: <strong className="text-slate-200">{claim.merchant}</strong> • Card: **** {claim.card_last4}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {claim.incident_description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-6">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Claim Amount</span>
                    <span className="text-base font-extrabold text-white font-heading">
                      ₹{claim.requested_amount?.toLocaleString()}
                    </span>
                  </div>

                  <div>{getStatusBadge(claim.status)}</div>

                  <button
                    onClick={() => handleOpenClaimModal(claim)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{claim.status === 'DRAFT' ? 'Review & Submit' : 'View Lifecycle'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-Filled Pre-Fill Claim Form Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-3xl rounded-3xl border border-cyan-500/30 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedClaim(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">98% Auto-Filled Claim Form</span>
                <h3 className="text-xl font-bold text-white font-heading">{selectedClaim.benefit_name} ({selectedClaim.claim_id})</h3>
              </div>
            </div>

            {/* Lifecycle Status Pipeline Indicator */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 font-mono">Live Claim Lifecycle Status</span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {['DRAFT', 'SUBMITTED', 'VERIFICATION', 'APPROVED'].map((st, idx) => {
                  const isDone = selectedClaim.status === st || (selectedClaim.status === 'APPROVED' && idx <= 3);
                  return (
                    <div key={st} className={`p-2.5 rounded-xl border ${isDone ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      {st}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pre-Filled Metadata Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium block">Cardholder Name (Auto-Filled)</span>
                <span className="text-sm font-bold text-white mt-1 block flex items-center gap-1.5 font-heading">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> {userProfile?.name || "Sayan Rudra"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium block">Card Number (Auto-Filled)</span>
                <span className="text-sm font-bold text-white mt-1 block flex items-center gap-1.5 font-mono">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> AMEX Platinum (**** {selectedClaim.card_last4})
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium block">Merchant (Auto-Fetched)</span>
                <span className="text-sm font-bold text-white mt-1 block font-heading">{selectedClaim.merchant}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium block">Coverage Limit (Policy Auto-Mapped)</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block font-heading">₹{selectedClaim.coverage_limit?.toLocaleString()}</span>
              </div>
            </div>

            {/* Incident Description Textarea */}
            <div className="mb-6">
              <label className="text-xs text-slate-300 font-bold block mb-2 font-heading">Claim Incident Details</label>
              <textarea 
                rows={3}
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none transition"
                placeholder="Describe what happened (e.g., accidental damage, flight delay reason)..."
              />
            </div>

            {/* Receipt / OCR Verification Attachment */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">Receipt & Policy Document OCR Verification</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {ocrVerified ? "✓ Document verified & OCR matched with transaction." : "Attach store invoice or delay certificate for instant validation."}
                </p>
              </div>

              <button
                onClick={handleSimulateOcrUpload}
                disabled={uploadingDoc || ocrVerified}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  ocrVerified 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-md'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingDoc ? "Parsing OCR..." : ocrVerified ? "Verified" : "Attach Receipt"}</span>
              </button>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close
              </button>

              {selectedClaim.status === 'DRAFT' && (
                <button
                  onClick={handleSubmitClaim}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-cyan-200" />
                  <span>{submitting ? "Submitting..." : "1-Click Submit Claim"}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
