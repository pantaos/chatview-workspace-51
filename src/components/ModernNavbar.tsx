
import React from "react";
import { History } from "lucide-react";
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
    <header className={cn("sticky top-0 z-50 w-full backdrop-blur-md bg-white/75 border-b border-gray-100 shadow-sm", className)}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          
          <div className="flex items-center space-x-4">
            <button
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              onClick={() => navigate("/history")}
              title="History"
            >
              <History className="h-5 w-5 text-gray-600" />
            </button>
            
            <ProfileDropdown 
              name="Moin Arian" 
              email="moin@example.com"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernNavbar;
