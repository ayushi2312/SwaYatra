'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Globe } from 'lucide-react';
import { generateResponse, ChatResponse } from '@/utils/responseGenerator';
import { Language } from '@/utils/translations';
import ResponseDisplay from './ResponseDisplay';
import LanguageSelector from './LanguageSelector';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatResponse[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    const welcome = generateResponse('', language);
    setMessages([welcome]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const response = generateResponse(input, language);
    setMessages(prev => [...prev, response]);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-r from-saffron to-green p-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-saffron" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">SWA-YATRA</h2>
            <p className="text-white/80 text-xs">Tour Guide Assistant</p>
          </div>
        </div>
        <LanguageSelector language={language} onLanguageChange={setLanguage} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
        {messages.map((msg, idx) => (
          <ResponseDisplay key={idx} response={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              language === 'hi' 
                ? 'किलों, आस-पास की जगहों, भोजन या जयपुर के बारे में कुछ भी पूछें...'
                : language === 'fr'
                ? 'Demandez sur les monuments, lieux à proximité, nourriture ou tout sur Jaipur...'
                : 'Ask about monuments, nearby places, food, or anything about Jaipur...'
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-gradient-to-r from-saffron to-green text-white rounded-lg hover:shadow-lg transition-shadow font-medium flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'भेजें' : language === 'fr' ? 'Envoyer' : 'Send'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

