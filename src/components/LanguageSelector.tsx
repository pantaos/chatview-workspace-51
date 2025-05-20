
import React from 'react';
import { useLanguage, LanguageType } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, Globe } from 'lucide-react';

const languages: { code: LanguageType; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
];

const LanguageSelector = () => {
  const { language, changeLanguage, translate } = useLanguage();

  const handleChange = (lang: LanguageType) => {
    changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-black hover:text-white"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">{translate('app.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={language === lang.code ? 'bg-accent' : ''}
            onClick={() => handleChange(lang.code)}
          >
            <span className="flex items-center">
              {language === lang.code && <Check className="mr-2 h-4 w-4" />}
              {translate(`language.${lang.code}`)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
