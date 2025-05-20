
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white bg-opacity-80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-black hover:text-white rounded-full"
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

      <div className="flex-1">
        {/* Dashboard button */}
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Steps indicator */}
        <div className="container mx-auto pt-8 pb-4">
          <div className="text-center mb-6">
            <h2 
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500"
            >
              {title}
            </h2>
            <p className="text-gray-400 text-sm uppercase tracking-wider mt-2">VERSA Trendcast</p>
          </div>
          
          <div className="flex justify-center items-center mb-12 gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                {step > 1 && (
                  <div 
                    className={`h-[1px] w-12 ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-blue-400 to-indigo-500' 
                        : 'bg-gray-200'
                    }`} 
                  />
                )}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step === currentStep 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white scale-110 shadow-lg' 
                      : step < currentStep 
                        ? 'bg-gradient-to-r from-blue-200 to-indigo-200 text-white' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {step}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendcastLayout;
