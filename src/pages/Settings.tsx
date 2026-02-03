import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage, type LanguageType } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, Globe, User, Puzzle, MessageSquare, Image, Sun, Moon, HelpCircle, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MicrosoftIntegrationDialog } from "@/components/integrations/MicrosoftIntegrationDialog";
import { GoogleIntegrationDialog } from "@/components/integrations/GoogleIntegrationDialog";
import { NotionIntegrationDialog } from "@/components/integrations/NotionIntegrationDialog";

const Settings = () => {
  const { theme, toggleDarkMode } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(
    tabFromUrl && ["general", "profile", "integrations"].includes(tabFromUrl)
      ? tabFromUrl
      : "general"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<LanguageType>("en");
  
  // Sync tab with URL
  useEffect(() => {
    if (tabFromUrl && ["general", "profile", "integrations"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Integration dialog states
  const [microsoftDialogOpen, setMicrosoftDialogOpen] = useState(false);
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);
  const [notionDialogOpen, setNotionDialogOpen] = useState(false);
  
  // Microsoft permissions
  const [microsoftPermissions, setMicrosoftPermissions] = useState({
    outlook: { readEmails: true, draftEmails: true, sendEmails: true, searchEmails: true, manageLabels: false },
    calendar: { readEvents: true, createEvents: true, updateEvents: true, deleteEvents: false, findAvailability: true },
    sharepoint: { listDocuments: true, uploadDocuments: true, downloadDocuments: true, searchDocuments: true, shareDocuments: false },
  });
  
  // Google permissions
  const [googlePermissions, setGooglePermissions] = useState({
    gmail: { readEmails: true, draftEmails: true, sendEmails: true, searchEmails: true, manageLabels: true },
  });
  
  // Notion permissions
  const [notionPermissions, setNotionPermissions] = useState({
    notion: { searchPages: true, createPages: true, updatePages: true, queryDatabase: true, createEntries: false },
  });
  
  // Platform connection status
  const [platformStatus, setPlatformStatus] = useState({
    microsoft: true,
    google: true,
    notion: false
  });

  // App enablement within each platform
  const [microsoftApps, setMicrosoftApps] = useState({
    outlook: true,
    calendar: true,
    sharepoint: false
  });

  const [googleApps, setGoogleApps] = useState({
    gmail: true
  });

  const [notionApps, setNotionApps] = useState({
    notion: false
  });
  
  const [integrationToggles, setIntegrationToggles] = useState({
    outlook: true,
    zapier: false,
    slack: false,
    images: false,
  });
  
  // Mock user data
  const currentUser = {
    firstName: "Moin",
    lastName: "Arian",
    email: "moin@example.com",
    userType: "Admin"
  };

  const [userProfile] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    profilePicture: ""
  });
  
  // Define available languages
  const availableLanguages = [
    { code: "en" as LanguageType, name: "English" },
    { code: "de" as LanguageType, name: "Deutsch" },
  ];
  
  const handleLanguageChange = useCallback((languageCode: LanguageType) => {
    changeLanguage(languageCode);
    toast.success(`Language changed to ${languageCode.toUpperCase()}`);
  }, [changeLanguage]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSearchParams]);

  const handleToggleIntegration = useCallback((integration: string) => {
    setIntegrationToggles(prev => ({
      ...prev,
      [integration]: !prev[integration as keyof typeof prev]
    }));
    toast.success(`${integration.charAt(0).toUpperCase() + integration.slice(1)} integration ${!integrationToggles[integration as keyof typeof integrationToggles] ? 'enabled' : 'disabled'}`);
  }, [integrationToggles]);

  const handleChatLanguageChange = useCallback((languageCode: LanguageType) => {
    setChatLanguage(languageCode);
    toast.success(`Chat system prompts language changed to ${languageCode.toUpperCase()}`);
  }, []);

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Einstellungen</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Verwalte deine Einstellungen und Integrationen</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="flex justify-start overflow-x-auto scrollbar-hide bg-transparent border-b border-border rounded-none p-0 h-auto mb-6 md:mb-8 w-full">
            <TabsTrigger 
              value="general" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 md:px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary whitespace-nowrap min-h-[44px]"
            >
              Allgemein
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 md:px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary whitespace-nowrap min-h-[44px]"
            >
              Profil
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 md:px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary whitespace-nowrap min-h-[44px]"
            >
              Integrationen
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="mt-0 space-y-6">
            {/* Theme & Language */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  {theme.isDarkMode ? (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Dunkles Erscheinungsbild</p>
                  </div>
                </div>
                <Switch
                  checked={theme.isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Sprache</p>
                    <p className="text-xs text-muted-foreground">App-Sprache wählen</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {availableLanguages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.code.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Hilfe & Support</p>
                    <p className="text-xs text-muted-foreground">support@pantaflows.com</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://help.pantaflows.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-0">
            <p className="text-xs text-muted-foreground mb-4">
              Nur durch Admin änderbar
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">E-Mail</span>
                <span className="text-sm font-medium">{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Rolle</span>
                <Badge variant="secondary">{currentUser.userType}</Badge>
              </div>
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Microsoft */}
              <div 
                className="aspect-square flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer text-center"
                onClick={() => setMicrosoftDialogOpen(true)}
              >
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <p className="font-medium text-sm mb-1">Microsoft</p>
                <p className="text-[10px] text-muted-foreground mb-2">
                  {Object.values(microsoftApps).filter(Boolean).length} Apps aktiv
                </p>
                <Badge variant={platformStatus.microsoft ? "default" : "secondary"} className="text-[9px] px-1.5 py-0">
                  {platformStatus.microsoft ? 'Verbunden' : 'Nicht verbunden'}
                </Badge>
              </div>

              {/* Google */}
              <div 
                className="aspect-square flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer text-center"
                onClick={() => setGoogleDialogOpen(true)}
              >
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <p className="font-medium text-sm mb-1">Google</p>
                <p className="text-[10px] text-muted-foreground mb-2">
                  {Object.values(googleApps).filter(Boolean).length} Apps aktiv
                </p>
                <Badge variant={platformStatus.google ? "default" : "secondary"} className="text-[9px] px-1.5 py-0">
                  {platformStatus.google ? 'Verbunden' : 'Nicht verbunden'}
                </Badge>
              </div>

              {/* Notion */}
              <div 
                className="aspect-square flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer text-center"
                onClick={() => setNotionDialogOpen(true)}
              >
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <p className="font-medium text-sm mb-1">Notion</p>
                <p className="text-[10px] text-muted-foreground mb-2">
                  {Object.values(notionApps).filter(Boolean).length} Apps aktiv
                </p>
                <Badge variant={platformStatus.notion ? "default" : "secondary"} className="text-[9px] px-1.5 py-0">
                  {platformStatus.notion ? 'Verbunden' : 'Nicht verbunden'}
                </Badge>
              </div>
            </div>

            {/* Integration Dialogs */}
            <MicrosoftIntegrationDialog
              open={microsoftDialogOpen}
              onOpenChange={setMicrosoftDialogOpen}
              apps={microsoftApps}
              onAppsChange={setMicrosoftApps}
              permissions={microsoftPermissions}
              onPermissionsChange={setMicrosoftPermissions}
              isConnected={platformStatus.microsoft}
              onDisconnect={() => {
                setPlatformStatus({ ...platformStatus, microsoft: false });
                toast.success("Microsoft disconnected");
              }}
            />

            <GoogleIntegrationDialog
              open={googleDialogOpen}
              onOpenChange={setGoogleDialogOpen}
              apps={googleApps}
              onAppsChange={setGoogleApps}
              permissions={googlePermissions}
              onPermissionsChange={setGooglePermissions}
              isConnected={platformStatus.google}
              onDisconnect={() => {
                setPlatformStatus({ ...platformStatus, google: false });
                toast.success("Google disconnected");
              }}
            />

            <NotionIntegrationDialog
              open={notionDialogOpen}
              onOpenChange={setNotionDialogOpen}
              apps={notionApps}
              onAppsChange={setNotionApps}
              permissions={notionPermissions}
              onPermissionsChange={setNotionPermissions}
              isConnected={platformStatus.notion}
              onDisconnect={() => {
                setPlatformStatus({ ...platformStatus, notion: false });
                toast.success("Notion disconnected");
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
