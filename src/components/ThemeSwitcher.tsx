
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getClientTheme, clientThemes } from "@/lib/client-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Palette, Moon, Sun } from "lucide-react";

interface ThemeSwitcherProps {
  visible?: boolean;
}

const ThemeSwitcher = ({ visible = false }: ThemeSwitcherProps) => {
  const { theme, updateTheme, toggleDarkMode } = useTheme();
  
  if (!visible) return null;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-card border border-border">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium flex items-center gap-2">
          {theme.isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
          Dark Mode
        </div>
        <Switch 
          checked={theme.isDarkMode} 
          onCheckedChange={toggleDarkMode}
        />
      </div>
      
      <div className="text-sm font-medium mb-2 flex items-center gap-2">
        <Palette size={14} /> Client Theme
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(clientThemes).map((clientId) => (
          <Button
            key={clientId}
            size="sm"
            variant="outline"
            onClick={() => updateTheme(getClientTheme(clientId))}
          >
            {clientThemes[clientId].clientName}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
