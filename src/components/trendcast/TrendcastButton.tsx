
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface TrendcastButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

const TrendcastButton = ({
  children,
  onClick,
  icon = <ArrowRight className="ml-2 h-4 w-4" />,
  disabled = false,
  loading = false
}: TrendcastButtonProps) => {
  const { theme } = useTheme();
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="rounded-full px-6 py-2 text-white flex items-center gap-2 transition-all duration-300"
      style={{
        background: `linear-gradient(90deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)`,
      }}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-white" />
      ) : (
        <>
          {children}
          {icon}
        </>
      )}
    </Button>
  );
};

export default TrendcastButton;
