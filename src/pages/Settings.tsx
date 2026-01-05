import React, { useState, useCallback, useMemo } from "react";
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
import { Mail, Globe, User, Puzzle, MessageSquare, Image, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MicrosoftIntegrationDialog } from "@/components/integrations/MicrosoftIntegrationDialog";
import { GoogleIntegrationDialog } from "@/components/integrations/GoogleIntegrationDialog";
import { NotionIntegrationDialog } from "@/components/integrations/NotionIntegrationDialog";

const Settings = () => {
  const { theme, toggleDarkMode } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<LanguageType>("en");
  
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

  const tabs = useMemo(() => [
    { 
      id: "account", 
      label: "Account", 
      icon: User,
      description: "Profile & Security"
    },
    { 
      id: "integrations", 
      label: "Integrations", 
      icon: Puzzle,
      description: "Connected Services"
    },
    { 
      id: "chat-config", 
      label: "General Chat", 
      icon: MessageSquare,
      description: "Chat Settings & Integrations"
    },
    { 
      id: "languages", 
      label: "Languages", 
      icon: Globe,
      description: "Language Preferences"
    }
  ], []);
  
  const handleLanguageChange = useCallback((languageCode: LanguageType) => {
    changeLanguage(languageCode);
    toast.success(`Language changed to ${languageCode.toUpperCase()}`);
  }, [changeLanguage]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

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

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case "chat-config":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">General Chat</h2>
              <p className="text-muted-foreground">
                Configure your chat integrations and language settings
              </p>
            </div>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Chat Integrations</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Enable or disable integrations for your main chat interface
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 border-2 transition-colors hover:bg-muted/50">
                  <div className="flex flex-col items-center text-center space-y-3 h-full">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Microsoft Outlook</p>
                    </div>
                    <Switch
                      checked={integrationToggles.outlook}
                      onCheckedChange={() => handleToggleIntegration('outlook')}
                    />
                  </div>
                </Card>

                <Card className="p-4 border-2 transition-colors hover:bg-muted/50">
                  <div className="flex flex-col items-center text-center space-y-3 h-full">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Puzzle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Zapier</p>
                    </div>
                    <Switch
                      checked={integrationToggles.zapier}
                      onCheckedChange={() => handleToggleIntegration('zapier')}
                    />
                  </div>
                </Card>

                <Card className="p-4 border-2 transition-colors hover:bg-muted/50">
                  <div className="flex flex-col items-center text-center space-y-3 h-full">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Slack</p>
                    </div>
                    <Switch
                      checked={integrationToggles.slack}
                      onCheckedChange={() => handleToggleIntegration('slack')}
                    />
                  </div>
                </Card>

                <Card className="p-4 border-2 transition-colors hover:bg-muted/50">
                  <div className="flex flex-col items-center text-center space-y-3 h-full">
                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Images</p>
                    </div>
                    <Switch
                      checked={integrationToggles.images || false}
                      onCheckedChange={() => handleToggleIntegration('images')}
                    />
                  </div>
                </Card>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Chat Language Settings</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select the language for chat system prompts and responses
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableLanguages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={chatLanguage === lang.code ? "default" : "outline"}
                    onClick={() => handleChatLanguageChange(lang.code)}
                    className="w-full hover:bg-black hover:text-white"
                  >
                    {lang.name}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        );
      case "languages":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Language Preferences</h2>
              <p className="text-muted-foreground">
                Select your preferred language for Panta Flows
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableLanguages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-full hover:bg-black hover:text-white"
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>
        );
      case "account":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Account</h2>
              <p className="text-muted-foreground">
                Control your profile, password, and preferences here.
              </p>
            </div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              {/* Name and Email Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="firstName" className="text-base font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    value={userProfile.firstName}
                    readOnly
                    className="mt-2 bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-base font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userProfile.lastName}
                    readOnly
                    className="mt-2 bg-muted"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  readOnly
                  className="mt-2 bg-muted"
                />
              </div>
            </Card>
          </div>
        );
      case "integrations":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, availableLanguages, language, userProfile, handleLanguageChange, chatLanguage, integrationToggles, handleToggleIntegration, handleChatLanguageChange]);
  
  return (
    <MainLayout>
      <div className="p-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your preferences and integrations.</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-transparent border-b border-border rounded-none p-0 h-auto">
            <TabsTrigger 
              value="account" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary"
            >
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-0">
            <div className="space-y-8">
              {/* Theme Mode */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Theme Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose between light and dark mode for the interface</p>
                <div className="flex gap-3">
                  <Button
                    variant={!theme.isDarkMode ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => theme.isDarkMode && toggleDarkMode?.()}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme.isDarkMode ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => !theme.isDarkMode && toggleDarkMode?.()}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </div>

              {/* Language Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Language Preferences</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose your language</p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-3">
                    {availableLanguages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={language === lang.code ? "default" : "outline"}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    className="ml-auto"
                    onClick={() => toast.success("Language saved!")}
                  >
                    Save Language
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="mt-0">
            {renderContent()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;