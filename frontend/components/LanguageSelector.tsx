'use client';

import { Language } from '@/utils/translations';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-2 py-1">
      <Globe className="w-4 h-4 text-white" />
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="text-gray-900">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

