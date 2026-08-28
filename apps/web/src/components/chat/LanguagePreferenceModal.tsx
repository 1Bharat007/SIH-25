'use client';

import React from 'react';
import { Globe, Check, X } from 'lucide-react';
import { SupportedLanguage } from '@sikkim-yatra/shared';

interface LanguagePreferenceModalProps {
  isOpen?: boolean;
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
    subtext: 'Mountain logistics, permit guides & cultural lore',
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
  isOpen = true,
  currentLanguage,
  onSelectLanguage,
  onClose,
}: LanguagePreferenceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] p-5 sm:p-6 shadow-xl space-y-4 text-[#202124]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0B3D91]" />
            <h3 className="text-[16px] font-medium text-[#202124]">
              Select Language Preference
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-[4px] text-[#5F6368] hover:text-[#202124] hover:bg-[#F8F9FA]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-2">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className={`w-full p-3 rounded-[4px] border text-left transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-[#0B3D91] bg-[#E8F0FE] ring-1 ring-[#0B3D91]'
                    : 'border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-[#202124]">
                      {lang.name}
                    </span>
                    <span className="text-[12px] text-[#5F6368]">
                      ({lang.nativeName})
                    </span>
                  </div>
                  <p className="text-[12px] text-[#5F6368] mt-0.5">
                    {lang.subtext}
                  </p>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-[#0B3D91] shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#DADCE0] flex justify-end">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-[4px] bg-[#0B3D91] text-[#FFFFFF] text-[12px] font-medium hover:bg-[#082E6E]"
            >
              Confirm Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
