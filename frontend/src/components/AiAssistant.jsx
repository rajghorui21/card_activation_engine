import React, { useState } from 'react';
import { User, Send, Sparkles, ShieldCheck, Zap, Bot, CornerDownLeft } from 'lucide-react';
import axios from 'axios';

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hi Sayan! I'm **BenefitGuard AI Assistant**. Ask me anything about your credit card protection benefits, policy coverage limits, or why a purchase qualified for insurance!",
      suggested: ["Why is my MacBook purchase eligible?", "How does Travel Delay coverage work?", "What is my Benefit Health Score?"]
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    // Append user message
    const updatedMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(updatedMsgs);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat/query', {
        message: query,
        user_id: 1
      });

      setMessages([
        ...updatedMsgs,
        {
          sender: 'bot',
          text: res.data.response,
          suggested: res.data.suggested_actions || []
        }
      ]);
    } catch (err) {
      console.error("Error in chat assistant:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Explainable AI & Policy Assistant</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-heading">AI Benefit Assistant</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Conversational assistant explaining complex card benefit rules, claim eligibility, coverage limits, and document requirements.
          </p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 flex flex-col h-[540px] shadow-2xl relative overflow-hidden">

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 shadow-md ${msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-cyan-400'
                }`}>
                {msg.sender === 'user' ? 'SR' : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${msg.sender === 'user'
                  ? 'chat-user-bubble bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-100 border border-cyan-500/40 rounded-tr-none font-medium'
                  : 'chat-bot-bubble bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none font-medium'
                }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Suggested Chips */}
                {msg.suggested && msg.suggested.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                    {msg.suggested.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => sendMessage(s)}
                        className="chat-chip-button px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-cyan-500/20 text-[11px] text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition text-left font-bold shadow-xs"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-cyan-400 animate-pulse p-2 font-mono">
              <Bot className="w-4 h-4" />
              <span>Analyzing policy terms & coverage terms...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }} className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about card benefits, eligibility rules, or claims..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-cyan-500 focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition flex items-center justify-center"
          >
            <Send className="w-4 h-4 text-cyan-100" />
          </button>
        </form>

      </div>

    </div>
  );
}
