
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X, LayoutDashboard, History } from "lucide-react";
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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center">
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
            
            {/* Right side - Navigation and Profile */}
            <div className="flex items-center gap-2">
              {!isMobile && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard")}
                    className="hover:bg-white/20 text-white transition-all duration-200 rounded-lg"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/history")}
                    className="hover:bg-white/20 text-white transition-all duration-200 rounded-lg mr-2"
                    title="History"
                  >
                    <History className="h-5 w-5" />
                  </Button>
                </>
              )}
              
              {showProfileDropdown && currentUser && !isMobile && (
                <ProfileDropdown 
                  name={`${currentUser.firstName} ${currentUser.lastName}`} 
                  email={currentUser.email} 
                />
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Page title section for desktop */}
      {!isMobile && title && (
        <div className="bg-gray-100 dark:bg-slate-900">
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
