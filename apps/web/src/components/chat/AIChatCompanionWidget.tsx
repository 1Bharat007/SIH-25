'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Minimize2,
  Trash2,
  Globe,
  Bot,
  User,
  MapPin,
  Loader2,
} from 'lucide-react';
import { useAIChatCompanion } from '../../hooks/useAIChatCompanion';
import LanguagePreferenceModal from './LanguagePreferenceModal';

export default function AIChatCompanionWidget() {
  const {
    messages,
    isLoading,
    preferredLanguage,
    selectLanguage,
    hasPromptedLanguage,
    isWidgetOpen,
    setIsWidgetOpen,
    sendMessage,
    clearHistory,
    userLocation,
  } = useAIChatCompanion();

  const [inputVal, setInputVal] = useState<string>('');
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isWidgetOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isWidgetOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const currentLangLabel =
    preferredLanguage === 'hi' ? 'हिन्दी (Hindi)' : preferredLanguage === 'ne' ? 'नेपाली (Nepali)' : 'English';

  return (
    <>
      {/* First-time Language Onboarding Modal */}
      {!hasPromptedLanguage && (
        <LanguagePreferenceModal
          isOpen={!hasPromptedLanguage}
          currentLanguage={preferredLanguage}
          onSelectLanguage={(lang) => {
            selectLanguage(lang);
            setShowLanguageModal(false);
          }}
          onClose={() => selectLanguage(preferredLanguage)}
        />
      )}

      {/* Manual Language Modal Selector */}
      {showLanguageModal && (
        <LanguagePreferenceModal
          isOpen={showLanguageModal}
          currentLanguage={preferredLanguage}
          onSelectLanguage={(lang) => {
            selectLanguage(lang);
            setShowLanguageModal(false);
          }}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {/* Floating Chat Trigger Button */}
      {!isWidgetOpen && (
        <div className="fixed bottom-24 right-5 z-40">
          <button
            onClick={() => setIsWidgetOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-2xl shadow-teal-950/80 border border-teal-400/40 transition-all hover:scale-105 active:scale-95"
            title="Open AI Travel Companion"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-teal-100" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-pulse" />
            </div>
            <span className="hidden sm:inline font-extrabold tracking-wide text-white">
              AI Travel Companion
            </span>
          </button>
        </div>
      )}

      {/* Expandable Chat Drawer */}
      {isWidgetOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[88vh] rounded-3xl bg-slate-950/95 border border-teal-500/30 shadow-2xl shadow-black/80 backdrop-blur-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Widget Header */}
          <div className="p-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-950 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>Sikkim Yatra AI</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Grounded
                  </span>
                </h3>
                <p className="text-[11px] text-white/50 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-400" />
                  <span>
                    {userLocation ? 'Location Active' : 'Sikkim Grounded'} • Offline-Ready
                  </span>
                </p>
              </div>
            </div>

            {/* Actions: Language & Close */}
            <div className="flex items-center gap-1.5">
              {/* Language Switcher Button */}
              <button
                onClick={() => setShowLanguageModal(true)}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-teal-300 text-xs font-semibold border border-white/10 flex items-center gap-1 transition-colors"
                title="Change language"
              >
                <Globe className="w-3 h-3 text-teal-400" />
                <span className="text-[11px]">{currentLangLabel.split(' ')[0]}</span>
              </button>

              {/* Clear History */}
              <button
                onClick={clearHistory}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsWidgetOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Minimize chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-teal-600 text-white rounded-br-none shadow-md font-medium'
                        : 'bg-slate-900 border border-white/10 text-white/90 rounded-bl-none shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Source Tag for Bot */}
                    {!isUser && msg.source && (
                      <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/5">
                        <span className="capitalize">
                          {msg.source === 'claude_llm'
                            ? 'Claude AI Grounded'
                            : msg.source === 'offline_kb'
                            ? 'Offline Local Cache'
                            : 'Sikkim Yatra System'}
                        </span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}

                    {/* Suggested Follow-up chips */}
                    {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="pt-2 border-t border-white/10 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
                          Suggested Inquiries:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedFollowUps.map((sugg, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(sugg)}
                              className="px-2.5 py-1 rounded-lg text-[10px] bg-white/5 hover:bg-teal-500/20 text-teal-200 hover:text-teal-100 border border-teal-500/20 transition-colors text-left"
                            >
                              {sugg}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-white/10 text-white/80 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-teal-300 animate-pulse">
                <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-white/60 text-xs">
                  Sikkim Yatra AI is synthesizing response...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-slate-900 border-t border-white/10 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                preferredLanguage === 'hi'
                  ? 'सिक्किम के बारे में कुछ भी पूछें...'
                  : preferredLanguage === 'ne'
                  ? 'सिक्किमको बारेमा केही सोध्नुहोस्...'
                  : 'Ask about permits, roads, monasteries...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder-white/40 focus:outline-none focus:border-teal-400"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="p-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:hover:bg-teal-500 text-slate-950 font-bold transition-all flex items-center justify-center"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
