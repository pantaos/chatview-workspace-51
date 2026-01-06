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
          <TabsList className="flex overflow-x-auto scrollbar-hide bg-transparent border-b border-border rounded-none p-0 h-auto mb-6 md:mb-8 w-full">
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
            {/* Theme Settings */}
            <Card className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Erscheinungsbild</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme.isDarkMode ? (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm md:text-base">Dark Mode</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Dunkles Erscheinungsbild aktivieren</p>
                  </div>
                </div>
                <Switch
                  checked={theme.isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </Card>

            {/* Language Settings */}
            <Card className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Sprache</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">
                Wähle deine bevorzugte Sprache für Panta Flows
              </p>
              <div className="grid grid-cols-2 gap-3">
                {availableLanguages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={language === lang.code ? "default" : "outline"}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-full min-h-[44px]"
                  >
                    {lang.name}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Support Section */}
            <Card className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1 text-sm md:text-base">Hilfe & Support</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">
                    Bei Problemen oder Fragen kannst du dich jederzeit an uns wenden.
                  </p>
                  
                  <div className="space-y-3">
                    <a 
                      href="mailto:support@pantaflows.com" 
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">support@pantaflows.com</span>
                    </a>
                    
                    <a 
                      href="https://help.pantaflows.com" 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 shrink-0" />
                      <span>Help Center besuchen</span>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-0 space-y-6">
            <Card className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Profil-Informationen</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-6">
                Diese Informationen können nur von einem Administrator geändert werden.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Vorname</Label>
                  <Input 
                    value={currentUser.firstName} 
                    disabled 
                    className="mt-1.5 bg-muted text-muted-foreground cursor-not-allowed" 
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Nachname</Label>
                  <Input 
                    value={currentUser.lastName} 
                    disabled 
                    className="mt-1.5 bg-muted text-muted-foreground cursor-not-allowed" 
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label className="text-muted-foreground text-sm">E-Mail</Label>
                <Input 
                  value={currentUser.email} 
                  disabled 
                  className="mt-1.5 bg-muted text-muted-foreground cursor-not-allowed" 
                />
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Benutzertyp</Label>
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {currentUser.userType}
                  </Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Microsoft Platform Card */}
              <Card className="p-4 hover:bg-muted/50 transition-colors group">
                <div 
                  className="flex flex-col items-center text-center space-y-2 cursor-pointer"
                  onClick={() => setMicrosoftDialogOpen(true)}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary">Microsoft</h3>
                  <p className={`text-xs font-medium ${platformStatus.microsoft ? 'text-foreground' : 'text-red-500'}`}>
                    {platformStatus.microsoft ? 'Connected' : 'Not Connected'}
                  </p>
                  {platformStatus.microsoft && (
                    <p className="text-xs text-muted-foreground">
                      {Object.values(microsoftApps).filter(Boolean).length} apps enabled
                    </p>
                  )}
                </div>
              </Card>

              {/* Google Platform Card */}
              <Card className="p-4 hover:bg-muted/50 transition-colors group">
                <div 
                  className="flex flex-col items-center text-center space-y-2 cursor-pointer"
                  onClick={() => setGoogleDialogOpen(true)}
                >
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary">Google</h3>
                  <p className={`text-xs font-medium ${platformStatus.google ? 'text-foreground' : 'text-red-500'}`}>
                    {platformStatus.google ? 'Connected' : 'Not Connected'}
                  </p>
                  {platformStatus.google && (
                    <p className="text-xs text-muted-foreground">
                      {Object.values(googleApps).filter(Boolean).length} apps enabled
                    </p>
                  )}
                </div>
              </Card>

              {/* Notion Platform Card */}
              <Card className="p-4 hover:bg-muted/50 transition-colors group">
                <div 
                  className="flex flex-col items-center text-center space-y-2 cursor-pointer"
                  onClick={() => setNotionDialogOpen(true)}
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-base">N</span>
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary">Notion</h3>
                  <p className={`text-xs font-medium ${platformStatus.notion ? 'text-foreground' : 'text-red-500'}`}>
                    {platformStatus.notion ? 'Connected' : 'Not Connected'}
                  </p>
                  {platformStatus.notion && (
                    <p className="text-xs text-muted-foreground">
                      {Object.values(notionApps).filter(Boolean).length} apps enabled
                    </p>
                  )}
                </div>
              </Card>
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
