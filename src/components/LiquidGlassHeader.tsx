
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

interface LiquidGlassHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showProfileDropdown?: boolean;
  currentUser?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  showSidebarToggle?: boolean;
}

const LiquidGlassHeader = ({
  title,
  subtitle,
  showBackButton = true,
  showProfileDropdown = true,
  currentUser,
  sidebarOpen,
  setSidebarOpen,
  showSidebarToggle = false
}: LiquidGlassHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-900 dark:via-purple-900 dark:to-blue-950">
      <header className="backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showSidebarToggle && isMobile ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen?.(!sidebarOpen)}
                  className="hover:bg-black hover:text-white text-white"
                >
                  {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              ) : showBackButton ? (
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "icon"}
                  className="hover:bg-black hover:text-white text-white"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isMobile && <span className="ml-1">Back</span>}
                </Button>
              ) : null}
              <Logo variant="white" />
            </div>
            
            {/* Mobile title */}
            {isMobile && title && (
              <div className="text-center">
                <h1 className="text-lg font-semibold text-white">
                  {title}
                </h1>
              </div>
            )}
            
            {showProfileDropdown && currentUser && !isMobile && (
              <ProfileDropdown 
                name={`${currentUser.firstName} ${currentUser.lastName}`} 
                email={currentUser.email} 
              />
            )}
          </div>
        </div>
      </header>
      
      {/* Page title section for desktop */}
      {!isMobile && title && (
        <div className="bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center text-slate-900 dark:text-white">
              <h1 className="text-4xl font-bold mb-2">{title}</h1>
              {subtitle && <p className="text-slate-600 dark:text-slate-400 text-lg">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiquidGlassHeader;
