
import { ThemeConfig } from "../contexts/ThemeContext";

interface ClientTheme {
  [clientId: string]: ThemeConfig;
}

// Sample client themes
export const clientThemes: ClientTheme = {
  panta: {
    primaryColor: "#5673eb",
    secondaryColor: "#FF8C00",
    accentColor: "#26A69A",
    logo: "/panta-logo.png",
    clientName: "PANTA",
    tagline: "discover designInspiration",
    isDarkMode: false
  },
  acme: {
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    accentColor: "#8B5CF6",
    logo: "https://placehold.co/200x200?text=ACME",
    clientName: "ACME Corp",
    tagline: "Build better, faster",
    isDarkMode: false
  },
  globex: {
    primaryColor: "#EC4899",
    secondaryColor: "#8B5CF6",
    accentColor: "#F59E0B",
    logo: "https://placehold.co/200x200?text=GLOBEX",
    clientName: "Globex",
    tagline: "Future-ready solutions",
    isDarkMode: false
  }
};

export const getClientTheme = (clientId: string): ThemeConfig => {
  return clientThemes[clientId] || clientThemes.panta;
};
