import React, { useState } from 'react';
import { User, ShieldCheck, CreditCard, Mail, Phone, MapPin, Award, CheckCircle2, Bell, Lock, KeyRound, Sparkles, ArrowRight, Activity, ShieldAlert, Edit2, Save, FileText, TrendingUp, Check, Plus, X, AlertCircle, Camera } from 'lucide-react';

export default function UserProfile({ userProfile, selectedCard, setSelectedCard }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const avatarInputRef = React.useRef(null);

  const [profileData, setProfileData] = useState({
    name: userProfile?.name || 'Sayan Rudra',
    email: userProfile?.email || 'sayan@benefitguard.ai',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra, India',
    autoClaimEnabled: true,
    smsAlerts: true,
    whatsappAlerts: true
  });

  const handleAvatarUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const initialCards = userProfile?.cards || [
    { id: 1, card_name: 'American Express Platinum Reserve', card_number_prefix: '3782', card_number_last4: '4092', issuer: 'American Express', card_holder_name: 'Sayan Rudra', is_active: true },
    { id: 2, card_name: 'Chase Sapphire Reserve Metal', card_number_prefix: '4111', card_number_last4: '8821', issuer: 'Chase Bank', card_holder_name: 'Sayan Rudra', is_active: true },
    { id: 3, card_name: 'Capital One Venture X World Elite', card_number_prefix: '4532', card_number_last4: '1094', issuer: 'Capital One', card_holder_name: 'Sayan Rudra', is_active: true }
  ];

  const [cardList, setCardList] = useState(initialCards);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [addCardError, setAddCardError] = useState('');
  const [newCard, setNewCard] = useState({
    card_name: '',
    card_number_prefix: '3782',
    card_number_last4: '',
    issuer: 'American Express',
    card_holder_name: 'Sayan Rudra'
  });

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    if (!newCard.card_name.trim()) {
      setAddCardError('Please enter card name');
      return;
    }
    if (!newCard.card_number_last4.trim() || newCard.card_number_last4.trim().length < 4) {
      setAddCardError('Please enter valid 4-digit last number');
      return;
    }

    const createdCard = {
      id: Date.now(),
      card_name: newCard.card_name.trim(),
      card_number_prefix: newCard.card_number_prefix.trim() || '3782',
      card_number_last4: newCard.card_number_last4.trim(),
      issuer: newCard.issuer,
      card_holder_name: newCard.card_holder_name || 'Sayan Rudra',
      is_active: true
    };

    const updated = [createdCard, ...cardList];
    setCardList(updated);
    if (setSelectedCard) setSelectedCard(createdCard);

    // Reset form and close modal
    setNewCard({
      card_name: '',
      card_number_prefix: '3782',
      card_number_last4: '',
      issuer: 'American Express',
      card_holder_name: 'Sayan Rudra'
    });
    setAddCardError('');
    setShowAddCardModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Profile Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            
            {/* User Avatar Circle with Image Upload Option */}
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />

              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-1 shadow-xl shadow-cyan-500/25 relative overflow-hidden group-hover:scale-105 transition-all duration-300">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={profileData.name}
                    className="w-full h-full rounded-[22px] object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-3xl font-black text-white font-heading uppercase">
                    {profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'SR'}
                  </div>
                )}

                {/* Camera Hover Overlay */}
                <div className="absolute inset-0 rounded-[22px] bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 mb-0.5" />
                  <span className="text-[9px] font-bold font-mono text-white">CHANGE</span>
                </div>
              </div>

              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white border-2 border-slate-950 shadow-md" title="AMEX Verified Member">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Info Display vs Editing Mode */}
            {isEditing ? (
              <div className="space-y-3 w-full max-w-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 text-xs font-bold text-white outline-none font-heading"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">{profileData.name}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 font-mono">
                    <Award className="w-3.5 h-3.5 text-cyan-400" /> AMEX Platinum Member
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-4 font-medium">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-cyan-400" /> {profileData.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-purple-400" /> {profileData.phone}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> {profileData.location}</span>
                </p>
              </div>
            )}

          </div>

          {/* Action Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-3 rounded-2xl border text-xs font-extrabold transition flex items-center gap-2 shadow-lg ${
              isEditing 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-emerald-400/40 shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 hover:border-cyan-500/40 text-white'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 text-white" />
                <span>Save Profile Changes</span>
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 text-cyan-400" />
                <span>Edit Profile Info</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Account Details & Insurance Telemetry */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Linked Payment Cards Header & Section */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                Linked Premium Credit Cards
              </h3>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {cardList.length} Cards Active
                </span>
                
                {/* Add Card Button */}
                <button
                  onClick={() => setShowAddCardModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Card</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {cardList.map((c) => {
                const isSelected = selectedCard?.id === c.id || selectedCard?.card_name === c.card_name;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCard && setSelectedCard(c)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                        : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 via-slate-900 to-slate-950 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-md">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-heading">{c.card_name}</h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          BIN: {c.card_number_prefix || '3782'} •••• •••• {c.card_number_last4 || '4092'} • <span className="text-emerald-400 font-bold">Active</span>
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-mono">
                        <Check className="w-3.5 h-3.5 text-cyan-400" /> Default
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefit Protection Telemetry Summary */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Insurance Protection Coverage
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-mono uppercase block">Total Settled</span>
                <span className="text-xl font-extrabold text-emerald-400 mt-1 block font-heading">₹3,45,000</span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">100% Payout Rate</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-mono uppercase block">Active Policies</span>
                <span className="text-xl font-extrabold text-cyan-400 mt-1 block font-heading">12 Benefits</span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">Instant AI Trigger</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-mono uppercase block">Verification Speed</span>
                <span className="text-xl font-extrabold text-purple-400 mt-1 block font-heading">&lt; 3 Sec</span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">Zero Manual Paperwork</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Notification Preferences & Account Settings */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <Bell className="w-5 h-5 text-purple-400" />
              Automation & Notification Preferences
            </h3>

            <div className="space-y-5">
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white font-heading">Auto-Claim Generator</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pre-fills metadata when eligible purchase occurs</p>
                </div>
                <button
                  onClick={() => setProfileData({ ...profileData, autoClaimEnabled: !profileData.autoClaimEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    profileData.autoClaimEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white font-heading">Instant SMS Alerts</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Alerts sent to +91 98765 43210</p>
                </div>
                <button
                  onClick={() => setProfileData({ ...profileData, smsAlerts: !profileData.smsAlerts })}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    profileData.smsAlerts ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white font-heading">WhatsApp Smart Notifications</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Receive claim status and payout receipts</p>
                </div>
                <button
                  onClick={() => setProfileData({ ...profileData, whatsappAlerts: !profileData.whatsappAlerts })}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    profileData.whatsappAlerts ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Add New Credit Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-cyan-500/40 bg-slate-900/95 shadow-2xl p-6 sm:p-8 space-y-6">
            
            <button
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/25">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white font-heading">Link New Credit Card</h3>
              <p className="text-xs text-slate-400">
                Add your card to activate automatic purchase protection & instant delay insurance.
              </p>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                  Card Name / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. American Express Gold Reserve"
                  value={newCard.card_name}
                  onChange={(e) => setNewCard({ ...newCard, card_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                    Issuer Bank
                  </label>
                  <select
                    value={newCard.issuer}
                    onChange={(e) => setNewCard({ ...newCard, issuer: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                  >
                    <option value="American Express">American Express</option>
                    <option value="Chase Bank">Chase Bank</option>
                    <option value="Capital One">Capital One</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                    BIN Prefix
                  </label>
                  <input
                    type="text"
                    placeholder="3782"
                    value={newCard.card_number_prefix}
                    onChange={(e) => setNewCard({ ...newCard, card_number_prefix: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                    Last 4 Digits
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="9921"
                    value={newCard.card_number_last4}
                    onChange={(e) => setNewCard({ ...newCard, card_number_last4: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={newCard.card_holder_name}
                    onChange={(e) => setNewCard({ ...newCard, card_holder_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              {addCardError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addCardError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Link Card & Activate Insurance Benefits</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
