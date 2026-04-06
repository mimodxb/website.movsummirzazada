import React, { useEffect } from 'react';

const GoogleTranslateWidget = () => {
  useEffect(() => {
    // Define the global callback for Google Translate initialization
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { 
          pageLanguage: 'en', 
          includedLanguages: 'en,ru,az', 
          autoDisplay: false 
        },
        'google_translate_element'
      );
    };

    // Add styles to hide the Google Translate toolbar and widget frame
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      .goog-logo-link { display: none !important; }
      .goog-te-gadget { color: transparent !important; overflow: hidden; }
      .goog-te-balloon-frame { display: none !important; }
      
      /* Prevent Google Translate from shifting the body down */
      body { top: 0 !important; }
      
      /* Hide the tooltip that shows original text */
      #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup styles on unmount
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="hidden" 
      aria-hidden="true" 
      style={{ display: 'none' }}
    />
  );
};

export default GoogleTranslateWidget;