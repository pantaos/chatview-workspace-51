
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import LanguageSelector from '@/components/LanguageSelector';

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

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Dashboard button */}
      <div className="container mx-auto px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Home className="h-4 w-4" /> {translate('backToDashboard')}
        </Button>
      </div>

      <div className="flex-1">
        {/* Steps indicator */}
        <div className="container mx-auto pt-6 pb-4">
          <div className="flex justify-center items-center mb-4 gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                {step > 1 && (
                  <div className={`h-[2px] w-8 ${step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : step < currentStep 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              </React.Fragment>
            ))}
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-gray-500 text-lg font-medium">VERSA Trendcast</h1>
            <h2 
              className="text-4xl font-bold mt-2" 
              style={{ color: theme.primaryColor }}
            >
              {title}
            </h2>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendcastLayout;
