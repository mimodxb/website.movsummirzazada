import React from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/contexts/TranslationContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'az', label: 'Azerbaijani' },
    { code: 'ru', label: 'Russian' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0 hover:text-[#E0A995] hover:bg-transparent transition-colors">
          <Globe className={`h-4 w-4 ${language !== 'en' ? 'text-[#E0A995]' : ''}`} />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#0A1612] border-[#E0A995]/20 text-[#EBE8E3]">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`focus:bg-[#E0A995]/20 focus:text-[#E0A995] cursor-pointer ${
              language === lang.code ? 'text-[#E0A995] font-semibold bg-[#E0A995]/10' : ''
            }`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;