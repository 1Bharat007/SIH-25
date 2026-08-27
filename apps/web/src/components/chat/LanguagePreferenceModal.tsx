'use client';

import React from 'react';
import { Languages, Globe, Check, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '@sikkim-yatra/shared';

interface LanguagePreferenceModalProps {
  isOpen: boolean;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (language: SupportedLanguage) => void;
  onClose?: () => void;
}

const LANGUAGE_OPTIONS: {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  subtext: string;
}[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    subtext: 'Global mountain logistics, permit guides & cultural lore',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    subtext: 'सिक्किम पर्यटन, मठों का इतिहास और आपातकालीन सहायता',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    subtext: 'सिक्किमका पर्यटकीय स्थलहरू, परमिट र स्थानीय संस्कृति',
  },
];

export default function LanguagePreferenceModal({
  isOpen,
  currentLanguage,
  onSelectLanguage,
  onClose,
}: LanguagePreferenceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-slate-950 border border-teal-500/30 p-6 shadow-2xl space-y-5 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Preferred Language Selection
            </h3>
            <p className="text-xs text-white/60">
              Select your language for the AI Travel Companion
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-teal-950/50 border-teal-400 ring-1 ring-teal-400/50 text-white'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-white/10 text-white/80 hover:text-white'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-white">
                      {lang.nativeName}
                    </strong>
                    <span className="text-xs text-white/40">({lang.name})</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    {lang.subtext}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border flex-shrink-0 ${
                    isSelected
                      ? 'bg-teal-500 border-teal-300 text-slate-950 font-bold'
                      : 'border-white/20 text-transparent'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-white/50">
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>You can change this anytime inside the chat</span>
          </div>

          <button
            onClick={() => {
              onSelectLanguage(currentLanguage);
              if (onClose) onClose();
            }}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
