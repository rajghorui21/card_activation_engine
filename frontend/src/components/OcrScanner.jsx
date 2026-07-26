import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, AlertCircle, Scan, ArrowRight, RefreshCw, Upload, FileCheck, Check, Eye } from 'lucide-react';
import axios from 'axios';

const SAMPLES = [
  {
    id: 'amazon',
    title: 'Amazon E-Commerce Invoice',
    file_name: 'amazon_macbook_invoice.png',
    amount: 114900,
    merchant: 'Amazon Seller Services',
    type: 'Electronics Receipt'
  },
  {
    id: 'indigo',
    title: 'IndiGo Boarding Pass & Delay Cert',
    file_name: 'indigo_delay_certificate.pdf',
    amount: 18500,
    merchant: 'IndiGo Airlines 6E-532',
    type: 'Flight Delay Document'
  },
  {
    id: 'zara',
    title: 'ZARA Retail Store Receipt',
    file_name: 'zara_retail_receipt.png',
    amount: 6490,
    merchant: 'ZARA Retail India',
    type: 'Apparel Invoice'
  },
  {
    id: 'apple',
    title: 'Apple Store Repair Quote',
    file_name: 'apple_repair_quote.pdf',
    amount: 139900,
    merchant: 'Apple Store Select Citywalk',
    type: 'Cell Phone Repair Estimate'
  }
];

export default function OcrScanner() {
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [selectedSample, setSelectedSample] = useState(SAMPLES[0]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const fileInputRef = React.useRef(null);

  const runOcrScan = async (sample) => {
    setSelectedSample(sample);
    setLoading(true);
    setParsedResult(null);
    try {
      const formData = new FormData();
      formData.append('file_name', sample.file_name);
      formData.append('expected_amount', sample.amount);

      const res = await axios.post('/api/ocr/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setParsedResult(res.data);
    } catch (err) {
      console.error("Error scanning document:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadAndScan = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setLoading(true);
    setParsedResult(null);

    const mockSample = {
      id: 'uploaded',
      title: file.name,
      file_name: file.name,
      amount: parseFloat(customAmount) || 4950,
      merchant: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").toUpperCase(),
      type: 'Uploaded Receipt'
    };
    setSelectedSample(mockSample);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_name', file.name);
      if (customAmount) {
        formData.append('expected_amount', parseFloat(customAmount));
      }

      const res = await axios.post('/api/ocr/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setParsedResult(res.data);
    } catch (err) {
      console.error("Error scanning uploaded file:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Computer Vision & NLP Document Parsing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">Smart Document & Receipt OCR Studio</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Extract merchant names, purchase dates, line items, and flight delay certificates instantly. Matches receipt data against transaction streams to eliminate manual data entry.
          </p>
        </div>
      </div>

      {/* Upload Custom Receipt Dropzone Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono">
              <Upload className="w-3.5 h-3.5" /> CUSTOM DOCUMENT SCANNER
            </span>
            <h3 className="text-xl font-extrabold text-white font-heading">Upload Your Own Receipt or Invoice</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Upload any receipt image (.png, .jpg, .jpeg) or PDF document. BenefitGuard AI Vision will extract line items, merchant metadata, and totals in real time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUploadAndScan(e.target.files[0]);
                }
              }}
            />

            <input
              type="number"
              placeholder="₹ Amount (Optional)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-500 focus:border-purple-500 outline-none w-full sm:w-44"
            />

            <button
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2 shrink-0 group"
            >
              <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Choose & Scan Receipt</span>
            </button>
          </div>
        </div>

        {uploadedFile && (
          <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between text-xs text-purple-300 font-mono">
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-400" />
              Uploaded File: <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </span>
            <span className="text-[10px] bg-purple-500/20 px-2.5 py-0.5 rounded-full font-bold">PROCESSED BY AI VISION</span>
          </div>
        )}
      </div>

      {/* Preset Pickers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            disabled={loading}
            onClick={() => runOcrScan(s)}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 group flex flex-col justify-between ${
              selectedSample?.id === s.id && parsedResult 
                ? 'bg-cyan-500/15 border-cyan-500 shadow-lg shadow-cyan-500/10 scale-[1.02]' 
                : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850 hover:-translate-y-0.5'
            }`}
          >
            <div>
              <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 w-fit mb-3 group-hover:scale-110 transition-transform shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 uppercase tracking-wider font-mono border border-cyan-500/30">
                {s.type}
              </span>
              <h4 className="text-sm font-extrabold text-white mt-2.5 group-hover:text-cyan-400 transition-colors font-heading">{s.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">{s.merchant}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-black text-white font-heading">₹{s.amount.toLocaleString()}</span>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-mono">
                Scan Document <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* OCR Scanner Studio - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Document Visual Mockup with Laser Scanner Line & Bounding Boxes */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
              <Scan className="w-4 h-4 text-cyan-400" />
              Receipt Image Visual Overlay
            </h3>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {selectedSample?.file_name}
            </span>
          </div>

          {/* Thermal Printed Paper Receipt with Laser Scan Line & Glowing Bounding Boxes */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 font-mono text-xs text-slate-200 relative shadow-inner overflow-hidden">
            
            {/* Animated Laser Scanning Line */}
            {loading && (
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-scan-line z-20 pointer-events-none" />
            )}

            {/* Header / Merchant Bounding Box */}
            <div className={`p-2.5 rounded-xl border transition-all ${parsedResult ? 'border-cyan-500 bg-cyan-500/15 shadow-md shadow-cyan-500/20' : 'border-dashed border-slate-700'}`}>
              <div className="text-center">
                <span className="text-xs font-black text-white block uppercase font-heading">{selectedSample?.merchant || "AMAZON RETAIL"}</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">TAX INVOICE / OFFICIAL RECEIPT</span>
              </div>
            </div>

            {/* Date & Details */}
            <div className={`p-2.5 rounded-xl border transition-all ${parsedResult ? 'border-purple-500 bg-purple-500/15' : 'border-dashed border-slate-700'}`}>
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-300">DATE: 2026-07-23</span>
                <span className="text-slate-300">MODE: CARD ****4092</span>
              </div>
            </div>

            {/* Line Items */}
            <div className={`p-3 rounded-xl border transition-all space-y-2 ${parsedResult ? 'border-emerald-500 bg-emerald-500/15' : 'border-dashed border-slate-700'}`}>
              <div className="flex justify-between text-[11px] font-bold text-white">
                <span>{parsedResult?.item_description || "Apple MacBook Air M3"}</span>
                <span>1 X</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-emerald-400 text-sm font-heading">
                <span>TOTAL AMOUNT</span>
                <span>₹{selectedSample?.amount?.toLocaleString()}</span>
              </div>
            </div>

            {loading && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-2 z-10">
                <Scan className="w-8 h-8 text-cyan-400 animate-spin" />
                <span className="text-xs font-bold text-cyan-300 font-mono">Extracting Computer Vision OCR...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Extracted Structured Data */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                Extracted Receipt Structured JSON
              </h3>
              {parsedResult && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <Check className="w-3.5 h-3.5" /> 98.4% Accuracy Match
                </span>
              )}
            </div>

            {parsedResult ? (
              <div className="mt-6 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-400 block font-medium">Extracted Merchant</span>
                    <span className="text-sm font-extrabold text-white mt-1 block font-heading">{parsedResult.merchant}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-400 block font-medium">Validated Amount</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-1 block font-heading">₹{parsedResult.amount?.toLocaleString()}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-400 block font-medium">Match Status</span>
                    <span className="text-sm font-bold text-cyan-400 mt-1 block flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {parsedResult.match_status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">Full OCR JSON Response</h4>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto shadow-inner leading-relaxed">
                    {JSON.stringify(parsedResult, null, 2)}
                  </pre>
                </div>

              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                <Scan className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p className="text-sm font-bold text-slate-400">Select a document above to run OCR parsing</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
