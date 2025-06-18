
import React from "react";
import { History, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import ProfileDropdown from "@/components/ProfileDropdown";
import { cn } from "@/lib/utils";

interface ModernNavbarProps {
  className?: string;
}

const ModernNavbar = ({ className }: ModernNavbarProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-900 dark:via-purple-900 dark:to-blue-950">
      <header className={cn("backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20", className)}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Logo variant="white" />
            
            <div className="flex items-center space-x-4">
              <button
                className="rounded-full p-2 hover:bg-black hover:text-white transition-colors text-white"
                onClick={() => navigate("/dashboard")}
                title="Dashboard"
              >
                <LayoutDashboard className="h-5 w-5" />
              </button>
              
              <button
                className="rounded-full p-2 hover:bg-black hover:text-white transition-colors text-white"
                onClick={() => navigate("/history")}
                title="History"
              >
                <History className="h-5 w-5" />
              </button>
              
              <ProfileDropdown 
                name="Moin Arian" 
                email="moin@example.com"
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default ModernNavbar;
