import React, { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('selectedLanguage', lang);
    
    // Trigger Google Translate widget if available
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  };

  useEffect(() => {
    // Initial sync if not english and widget has loaded
    const syncTimeout = setTimeout(() => {
      if (language !== 'en') {
        const select = document.querySelector('.goog-te-combo');
        if (select && select.value !== language) {
          select.value = language;
          select.dispatchEvent(new Event('change'));
        }
      }
    }, 2000); // Give the widget time to load

    return () => clearTimeout(syncTimeout);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};