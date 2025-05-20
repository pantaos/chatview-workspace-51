
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ProfileDropdown from '@/components/ProfileDropdown';
import Logo from '@/components/Logo';

interface TrendcastLayoutProps {
  children: React.ReactNode;
  title: string;
  currentStep: number;
  goBack?: () => void;
}

const TrendcastLayout = ({ 
  children, 
  title, 
  currentStep, 
  goBack 
}: TrendcastLayoutProps) => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const { theme } = useTheme();
  
  // Default goBack function
  const handleGoBack = goBack || (() => {
    if (currentStep === 1) {
      navigate('/dashboard');
    } else {
      const previousRoutes = [
        '/trendcast',
        '/trendcast/script',
        '/trendcast/audio',
        '/trendcast/video',
        '/trendcast/preview'
      ];
      navigate(previousRoutes[currentStep - 2]);
    }
  });

  // Step labels
  const stepLabels = [
    translate('trendcast.inputLinks'),
    translate('trendcast.editScript'),
    translate('trendcast.generateAudio'),
    translate('trendcast.createVideo'),
    translate('trendcast.preview')
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      {/* Modern header with workflow name */}
      <header className="bg-white bg-opacity-90 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="text-gray-500 hover:text-gray-800 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
          
          <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">
            VERSA Trendcast
          </h1>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 rounded-full"
              onClick={() => navigate("/history")}
            >
              <History className="h-5 w-5" />
            </Button>
            <ProfileDropdown 
              name="Moin Arian" 
              email="moin@example.com"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Modern step bubbles */}
        <div className="flex justify-center mb-12 overflow-x-auto py-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                {step > 1 && (
                  <div 
                    className={`h-[2px] w-8 md:w-12 ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-purple-400 to-indigo-500' 
                        : 'bg-gray-200'
                    }`} 
                  />
                )}
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      step === currentStep 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white scale-110 shadow-lg' 
                        : step < currentStep 
                          ? 'bg-gradient-to-r from-purple-200 to-indigo-200 text-white' 
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
                    {step}
                  </div>
                  <span className={`text-xs whitespace-nowrap ${
                    step === currentStep ? 'text-gray-800 font-medium' : 'text-gray-500'
                  }`}>
                    {stepLabels[step-1]}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TrendcastLayout;
