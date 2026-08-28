'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Trash2,
  Globe,
  Bot,
  User,
  MapPin,
  Loader2,
  X,
} from 'lucide-react';
import { useAIChatCompanion } from '../../hooks/useAIChatCompanion';
import LanguagePreferenceModal from './LanguagePreferenceModal';

export default function AIChatCompanionWidget() {
  const {
    messages,
    isLoading,
    preferredLanguage,
    selectLanguage,
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
    preferredLanguage === 'hi'
      ? 'हिंदी'
      : preferredLanguage === 'ne'
        ? 'नेपाली'
        : preferredLanguage === 'dz'
          ? 'Bhutia (Dzongkha)'
          : preferredLanguage === 'lep'
            ? 'Lepcha'
            : 'English';


  return (
    <>
      {/* Floating Assistant Trigger Button */}
      {!isWidgetOpen && (
        <div className="fixed bottom-5 left-5 z-[9980]">
          <button
            onClick={() => setIsWidgetOpen(true)}
            className="flex items-center gap-2 rounded-full border border-[#DADCE0] bg-[#0B3D91] hover:bg-[#082E6E] px-4 py-2.5 text-[#FFFFFF] shadow-[0_2px_6px_0_rgba(60,64,67,0.3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B3D91] cursor-pointer"
            aria-label="Open Tourism Assistant"
          >
            <Bot className="h-4 w-4 text-[#FFFFFF]" />
            <span className="text-[13px] font-medium tracking-wide">Tourist Assistant</span>
          </button>
        </div>
      )}

      {/* Main Assistant Chat Window */}
      {isWidgetOpen && (
        <div className="fixed bottom-5 left-5 z-[9980] w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] shadow-2xl flex flex-col overflow-hidden text-[#202124]">
          {/* Header Bar */}
          <div className="bg-[#0B3D91] px-4 py-3 text-[#FFFFFF] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[4px] bg-[#FFFFFF]/15 flex items-center justify-center text-[#FFFFFF]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-medium leading-none text-[#FFFFFF]">
                  Sikkim Tourist Assistant
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#D2E3FC]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#81C995]" />
                  <span>Multilingual Support</span>
                  {userLocation && (
                    <span className="flex items-center gap-0.5 ml-1">
                      <MapPin className="w-3 h-3" />
                      <span>GPS Context</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowLanguageModal(true)}
                className="p-1.5 rounded-[4px] hover:bg-[#FFFFFF]/10 text-[#D2E3FC] hover:text-[#FFFFFF] text-[11px] flex items-center gap-1"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLangLabel}</span>
              </button>

              <button
                onClick={() => clearHistory()}
                className="p-1.5 rounded-[4px] hover:bg-[#FFFFFF]/10 text-[#D2E3FC] hover:text-[#FFFFFF]"
                title="Clear Chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsWidgetOpen(false)}
                className="p-1.5 rounded-[4px] hover:bg-[#FFFFFF]/10 text-[#FFFFFF]"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F8F9FA] text-[13px]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-[4px] bg-[#0B3D91] text-[#FFFFFF] flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      SY
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-[4px] max-w-[82%] leading-relaxed ${
                      isUser
                        ? 'bg-[#0B3D91] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] border border-[#DADCE0] text-[#202124] shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span
                      className={`block text-[10px] mt-1 ${
                        isUser ? 'text-[#D2E3FC] text-right' : 'text-[#5F6368]'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>


                  {isUser && (
                    <div className="w-6 h-6 rounded-[4px] bg-[#E8F0FE] text-[#0B3D91] flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-[4px] bg-[#0B3D91] text-[#FFFFFF] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-[4px] bg-[#FFFFFF] border border-[#DADCE0] text-[#5F6368] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0B3D91]" />
                  <span className="text-[12px]">Consulting knowledge base...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="px-3 py-2 bg-[#FFFFFF] border-t border-[#DADCE0] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSuggestionClick('How to get Nathula Pass permit?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full border border-[#DADCE0] bg-[#F8F9FA] hover:bg-[#E8F0FE] text-[#5F6368] hover:text-[#0B3D91] transition-colors"
            >
              Nathula Permit?
            </button>
            <button
              onClick={() => handleSuggestionClick('Where can I rent traditional Bhutia Bakhu?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full border border-[#DADCE0] bg-[#F8F9FA] hover:bg-[#E8F0FE] text-[#5F6368] hover:text-[#0B3D91] transition-colors"
            >
              Rent Bakhu Outfit?
            </button>
            <button
              onClick={() => handleSuggestionClick('Emergency contact numbers in Gangtok')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full border border-[#DADCE0] bg-[#F8F9FA] hover:bg-[#E8F0FE] text-[#5F6368] hover:text-[#0B3D91] transition-colors"
            >
              Emergency Helpline
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-[#FFFFFF] border-t border-[#DADCE0] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about Sikkim..."
              className="flex-1 h-9 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#0B3D91]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="h-9 px-3 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[12px] font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <LanguagePreferenceModal
          currentLanguage={preferredLanguage}
          onSelectLanguage={(lang) => {
            selectLanguage(lang);
            setShowLanguageModal(false);
          }}
          onClose={() => setShowLanguageModal(false)}
        />
      )}
    </>
  );
}
