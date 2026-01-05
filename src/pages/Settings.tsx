import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLanguage, type LanguageType } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, Globe, User, Puzzle, MessageSquare, Calendar, FileText, Image, Info, X, ArrowLeft, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { theme, toggleDarkMode } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<LanguageType>("en");
  
  // Platform app selection dialogs
  const [microsoftAppsDialogOpen, setMicrosoftAppsDialogOpen] = useState(false);
  const [googleAppsDialogOpen, setGoogleAppsDialogOpen] = useState(false);
  const [notionAppsDialogOpen, setNotionAppsDialogOpen] = useState(false);
  
  // Actions dialog states
  const [outlookActionsDialogOpen, setOutlookActionsDialogOpen] = useState(false);
  const [calendarActionsDialogOpen, setCalendarActionsDialogOpen] = useState(false);
  const [sharepointActionsDialogOpen, setSharepointActionsDialogOpen] = useState(false);
  const [gmailActionsDialogOpen, setGmailActionsDialogOpen] = useState(false);
  const [notionActionsDialogOpen, setNotionActionsDialogOpen] = useState(false);
  
  // Permissions dialog states
  const [outlookPermissionsDialogOpen, setOutlookPermissionsDialogOpen] = useState(false);
  const [calendarPermissionsDialogOpen, setCalendarPermissionsDialogOpen] = useState(false);
  const [sharepointPermissionsDialogOpen, setSharepointPermissionsDialogOpen] = useState(false);
  const [gmailPermissionsDialogOpen, setGmailPermissionsDialogOpen] = useState(false);
  const [notionPermissionsDialogOpen, setNotionPermissionsDialogOpen] = useState(false);
  
  // Permission states (example - can be expanded)
  const [outlookPermissions, setOutlookPermissions] = useState({
    readEmails: true,
    draftEmails: true,
    sendEmails: true,
    searchEmails: true,
    manageLabels: false
  });
  
  const [calendarPermissions, setCalendarPermissions] = useState({
    readEvents: true,
    createEvents: true,
    updateEvents: true,
    deleteEvents: false,
    findAvailability: true
  });
  
  const [sharepointPermissions, setSharepointPermissions] = useState({
    listDocuments: true,
    uploadDocuments: true,
    downloadDocuments: true,
    searchDocuments: true,
    shareDocuments: false
  });
  
  const [gmailPermissions, setGmailPermissions] = useState({
    readEmails: true,
    draftEmails: true,
    sendEmails: true,
    searchEmails: true,
    manageLabels: true
  });
  
  const [notionPermissions, setNotionPermissions] = useState({
    searchPages: true,
    createPages: true,
    updatePages: true,
    queryDatabase: true,
    createEntries: false
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
                  onClick={() => platformStatus.microsoft ? setMicrosoftAppsDialogOpen(true) : setMicrosoftAppsDialogOpen(true)}
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
                  onClick={() => platformStatus.google ? setGoogleAppsDialogOpen(true) : setGoogleAppsDialogOpen(true)}
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
                  onClick={() => platformStatus.notion ? setNotionAppsDialogOpen(true) : setNotionAppsDialogOpen(true)}
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

            {/* Microsoft Apps Selection Dialog */}
            <Dialog open={microsoftAppsDialogOpen} onOpenChange={setMicrosoftAppsDialogOpen}>
              <DialogContent className="max-w-md p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">M</span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">Microsoft</h3>
                      <p className="text-xs text-muted-foreground">Select apps to enable</p>
                    </div>
                  </div>
                  <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                
                <div className="py-2">
                  <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Outlook</p>
                        <p className="text-xs text-muted-foreground">Email management</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={!microsoftApps.outlook}
                        onClick={() => setOutlookPermissionsDialogOpen(true)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
                      >
                        Configure
                      </button>
                      <Switch 
                        checked={microsoftApps.outlook}
                        onCheckedChange={(checked) => {
                          setMicrosoftApps({...microsoftApps, outlook: checked});
                          if (checked) setTimeout(() => setOutlookPermissionsDialogOpen(true), 300);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Calendar</p>
                        <p className="text-xs text-muted-foreground">Events & scheduling</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={!microsoftApps.calendar}
                        onClick={() => setCalendarPermissionsDialogOpen(true)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
                      >
                        Configure
                      </button>
                      <Switch 
                        checked={microsoftApps.calendar}
                        onCheckedChange={(checked) => {
                          setMicrosoftApps({...microsoftApps, calendar: checked});
                          if (checked) setTimeout(() => setCalendarPermissionsDialogOpen(true), 300);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">SharePoint</p>
                        <p className="text-xs text-muted-foreground">Documents & files</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={!microsoftApps.sharepoint}
                        onClick={() => setSharepointPermissionsDialogOpen(true)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
                      >
                        Configure
                      </button>
                      <Switch 
                        checked={microsoftApps.sharepoint}
                        onCheckedChange={(checked) => {
                          setMicrosoftApps({...microsoftApps, sharepoint: checked});
                          if (checked) setTimeout(() => setSharepointPermissionsDialogOpen(true), 300);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 px-5 py-4 border-t border-border/40 bg-muted/20">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="h-8">Cancel</Button>
                  </DialogClose>
                  <Button size="sm" className="h-8" onClick={() => {
                    setMicrosoftAppsDialogOpen(false);
                    setPlatformStatus({...platformStatus, microsoft: true});
                    toast.success("Microsoft apps configured");
                  }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Google Apps Selection Dialog */}
            <Dialog open={googleAppsDialogOpen} onOpenChange={setGoogleAppsDialogOpen}>
              <DialogContent className="max-w-md p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">G</span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">Google</h3>
                      <p className="text-xs text-muted-foreground">Select apps to enable</p>
                    </div>
                  </div>
                  <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                
                <div className="py-2">
                  <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Gmail</p>
                        <p className="text-xs text-muted-foreground">Email management</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={!googleApps.gmail}
                        onClick={() => setGmailPermissionsDialogOpen(true)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
                      >
                        Configure
                      </button>
                      <Switch 
                        checked={googleApps.gmail}
                        onCheckedChange={(checked) => {
                          setGoogleApps({...googleApps, gmail: checked});
                          if (checked) setTimeout(() => setGmailPermissionsDialogOpen(true), 300);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 px-5 py-4 border-t border-border/40 bg-muted/20">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="h-8">Cancel</Button>
                  </DialogClose>
                  <Button size="sm" className="h-8" onClick={() => {
                    setGoogleAppsDialogOpen(false);
                    setPlatformStatus({...platformStatus, google: true});
                    toast.success("Google apps configured");
                  }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Notion Apps Selection Dialog */}
            <Dialog open={notionAppsDialogOpen} onOpenChange={setNotionAppsDialogOpen}>
              <DialogContent className="max-w-md p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">N</span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">Notion</h3>
                      <p className="text-xs text-muted-foreground">Select features to enable</p>
                    </div>
                  </div>
                  <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                
                <div className="py-2">
                  <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">N</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Notion</p>
                        <p className="text-xs text-muted-foreground">Pages & databases</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={!notionApps.notion}
                        onClick={() => setNotionPermissionsDialogOpen(true)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
                      >
                        Configure
                      </button>
                      <Switch 
                        checked={notionApps.notion}
                        onCheckedChange={(checked) => {
                          setNotionApps({...notionApps, notion: checked});
                          if (checked) setTimeout(() => setNotionPermissionsDialogOpen(true), 300);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 px-5 py-4 border-t border-border/40 bg-muted/20">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="h-8">Cancel</Button>
                  </DialogClose>
                  <Button size="sm" className="h-8" onClick={() => {
                    setNotionAppsDialogOpen(false);
                    setPlatformStatus({...platformStatus, notion: true});
                    toast.success("Notion configured");
                  }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>


            {/* Outlook Permissions Dialog */}
            <Dialog open={outlookPermissionsDialogOpen} onOpenChange={setOutlookPermissionsDialogOpen}>
              <DialogContent className="max-w-md p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">Outlook Controls</h3>
                      <p className="text-xs text-muted-foreground">AI workflow permissions</p>
                    </div>
                  </div>
                  <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                
                <div className="py-2 max-h-72 overflow-y-auto">
                  {[
                    { key: 'readEmails', label: 'Read emails', desc: 'View messages' },
                    { key: 'draftEmails', label: 'Draft emails', desc: 'Create drafts' },
                    { key: 'sendEmails', label: 'Send emails', desc: 'Send on your behalf' },
                    { key: 'searchEmails', label: 'Search emails', desc: 'Search mailbox' },
                    { key: 'manageLabels', label: 'Manage labels', desc: 'Add/remove labels' },
                  ].map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.desc}</p>
                      </div>
                      <Switch 
                        checked={outlookPermissions[perm.key as keyof typeof outlookPermissions]}
                        onCheckedChange={(checked) => setOutlookPermissions({...outlookPermissions, [perm.key]: checked})}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between gap-2 px-5 py-4 border-t border-border/40 bg-muted/20">
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => {
                    setOutlookPermissionsDialogOpen(false);
                    setMicrosoftAppsDialogOpen(true);
                  }}>
                    <ArrowLeft className="w-4 h-4 mr-1" />Back
                  </Button>
                  <Button size="sm" className="h-8" onClick={() => {
                    setOutlookPermissionsDialogOpen(false);
                    toast.success("Outlook permissions updated");
                  }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Calendar Permissions Dialog */}
            <Dialog open={calendarPermissionsDialogOpen} onOpenChange={setCalendarPermissionsDialogOpen}>
              <DialogContent className="max-w-md p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">Calendar Controls</h3>
                      <p className="text-xs text-muted-foreground">AI workflow permissions</p>
                    </div>
                  </div>
                  <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                
                <div className="py-2 max-h-72 overflow-y-auto">
                  {[
                    { key: 'readEvents', label: 'Read events', desc: 'View calendar' },
                    { key: 'createEvents', label: 'Create events', desc: 'Add new events' },
                    { key: 'updateEvents', label: 'Update events', desc: 'Modify events' },
                    { key: 'deleteEvents', label: 'Delete events', desc: 'Remove events' },
                    { key: 'findAvailability', label: 'Find availability', desc: 'Check free slots' },
                  ].map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.desc}</p>
                      </div>
                      <Switch 
                        checked={calendarPermissions[perm.key as keyof typeof calendarPermissions]}
                        onCheckedChange={(checked) => setCalendarPermissions({...calendarPermissions, [perm.key]: checked})}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between gap-2 px-5 py-4 border-t border-border/40 bg-muted/20">
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => {
                    setCalendarPermissionsDialogOpen(false);
                    setMicrosoftAppsDialogOpen(true);
                  }}>
                    <ArrowLeft className="w-4 h-4 mr-1" />Back
                  </Button>
                  <Button size="sm" className="h-8" onClick={() => {
                    setCalendarPermissionsDialogOpen(false);
                    toast.success("Calendar permissions updated");
                  }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* SharePoint Permissions Dialog */}
            <Dialog open={sharepointPermissionsDialogOpen} onOpenChange={setSharepointPermissionsDialogOpen}>
              <DialogContent className="max-w-md p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">SharePoint Controls</h3>
                      <p className="text-xs text-muted-foreground">AI workflow permissions</p>
                    </div>
                  </div>
                  <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                
                <div className="py-2 max-h-72 overflow-y-auto">
                  {[
                    { key: 'listDocuments', label: 'List documents', desc: 'View files' },
                    { key: 'uploadDocuments', label: 'Upload documents', desc: 'Add files' },
                    { key: 'downloadDocuments', label: 'Download documents', desc: 'Get files' },
                    { key: 'searchDocuments', label: 'Search documents', desc: 'Find files' },
                    { key: 'shareDocuments', label: 'Share documents', desc: 'Share with others' },
                  ].map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.desc}</p>
                      </div>
                      <Switch 
                        checked={sharepointPermissions[perm.key as keyof typeof sharepointPermissions]}
                        onCheckedChange={(checked) => setSharepointPermissions({...sharepointPermissions, [perm.key]: checked})}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between gap-2 px-5 py-4 border-t border-border/40 bg-muted/20">
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => {
                    setSharepointPermissionsDialogOpen(false);
                    setMicrosoftAppsDialogOpen(true);
                  }}>
                    <ArrowLeft className="w-4 h-4 mr-1" />Back
                  </Button>
                  <Button size="sm" className="h-8" onClick={() => {
                    setSharepointPermissionsDialogOpen(false);
                    toast.success("SharePoint permissions updated");
                  }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Gmail Permissions Dialog */}
            <Dialog open={gmailPermissionsDialogOpen} onOpenChange={setGmailPermissionsDialogOpen}>
              <DialogContent className="max-w-md p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">Gmail Controls</h3>
                      <p className="text-xs text-muted-foreground">AI workflow permissions</p>
                    </div>
                  </div>
                  <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                
                <div className="py-2 max-h-72 overflow-y-auto">
                  {[
                    { key: 'readEmails', label: 'Read emails', desc: 'View messages' },
                    { key: 'draftEmails', label: 'Draft emails', desc: 'Create drafts' },
                    { key: 'sendEmails', label: 'Send emails', desc: 'Send on your behalf' },
                    { key: 'searchEmails', label: 'Search emails', desc: 'Search mailbox' },
                    { key: 'manageLabels', label: 'Manage labels', desc: 'Add/remove labels' },
                  ].map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.desc}</p>
                      </div>
                      <Switch 
                        checked={gmailPermissions[perm.key as keyof typeof gmailPermissions]}
                        onCheckedChange={(checked) => setGmailPermissions({...gmailPermissions, [perm.key]: checked})}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between gap-2 px-5 py-4 border-t border-border/40 bg-muted/20">
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => {
                    setGmailPermissionsDialogOpen(false);
                    setGoogleAppsDialogOpen(true);
                  }}>
                    <ArrowLeft className="w-4 h-4 mr-1" />Back
                  </Button>
                  <Button size="sm" className="h-8" onClick={() => {
                    setGmailPermissionsDialogOpen(false);
                    toast.success("Gmail permissions updated");
                  }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Notion Permissions Dialog */}
            <Dialog open={notionPermissionsDialogOpen} onOpenChange={setNotionPermissionsDialogOpen}>
              <DialogContent className="max-w-md p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">Notion Controls</h3>
                      <p className="text-xs text-muted-foreground">AI workflow permissions</p>
                    </div>
                  </div>
                  <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                
                <div className="py-2 max-h-72 overflow-y-auto">
                  {[
                    { key: 'searchPages', label: 'Search pages', desc: 'Find pages' },
                    { key: 'createPages', label: 'Create pages', desc: 'Add new pages' },
                    { key: 'updatePages', label: 'Update pages', desc: 'Modify pages' },
                    { key: 'queryDatabase', label: 'Query database', desc: 'Access data' },
                    { key: 'createEntries', label: 'Create entries', desc: 'Add to databases' },
                  ].map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.desc}</p>
                      </div>
                      <Switch 
                        checked={notionPermissions[perm.key as keyof typeof notionPermissions]}
                        onCheckedChange={(checked) => setNotionPermissions({...notionPermissions, [perm.key]: checked})}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between gap-2 px-5 py-4 border-t border-border/40 bg-muted/20">
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => {
                    setNotionPermissionsDialogOpen(false);
                    setNotionAppsDialogOpen(true);
                  }}>
                    <ArrowLeft className="w-4 h-4 mr-1" />Back
                  </Button>
                  <Button size="sm" className="h-8" onClick={() => {
                    setNotionPermissionsDialogOpen(false);
                    toast.success("Notion permissions updated");
                  }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>


            {/* Outlook Actions Dialog */}
            <Dialog open={outlookActionsDialogOpen} onOpenChange={setOutlookActionsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <button
                  onClick={() => setOutlookActionsDialogOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <DialogHeader className="border-b pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Microsoft Outlook</DialogTitle>
                      <DialogDescription>Microsoft's email service for sending, receiving, and managing emails</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="mt-2">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">List folders</h4>
                          <p className="text-sm text-muted-foreground">Lists all mail folders in the user's mailbox</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Send email</h4>
                          <p className="text-sm text-muted-foreground">Creates and sends an email from your Outlook account</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Search emails</h4>
                          <p className="text-sm text-muted-foreground">Searches through your Outlook inbox and returns matching emails</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Create draft</h4>
                          <p className="text-sm text-muted-foreground">Creates a draft email without sending it</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Reply to email</h4>
                          <p className="text-sm text-muted-foreground">Reply to an existing email thread</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Get email with attachments</h4>
                          <p className="text-sm text-muted-foreground">Retrieves a single email with full content and attachments</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Calendar Actions Dialog */}
            <Dialog open={calendarActionsDialogOpen} onOpenChange={setCalendarActionsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <button
                  onClick={() => setCalendarActionsDialogOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <DialogHeader className="border-b pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Microsoft Calendar</DialogTitle>
                      <DialogDescription>Microsoft's calendar service for scheduling and managing events</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="mt-2">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">List calendars</h4>
                          <p className="text-sm text-muted-foreground">Lists all calendars in the user's account</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Create event</h4>
                          <p className="text-sm text-muted-foreground">Creates a new calendar event</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Update event</h4>
                          <p className="text-sm text-muted-foreground">Modifies an existing calendar event</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Delete event</h4>
                          <p className="text-sm text-muted-foreground">Removes an event from the calendar</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Find available times</h4>
                          <p className="text-sm text-muted-foreground">Finds free time slots for scheduling meetings</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">List upcoming events</h4>
                          <p className="text-sm text-muted-foreground">Retrieves upcoming events from the calendar</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* SharePoint Actions Dialog */}
            <Dialog open={sharepointActionsDialogOpen} onOpenChange={setSharepointActionsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <button
                  onClick={() => setSharepointActionsDialogOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <DialogHeader className="border-b pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">SharePoint</DialogTitle>
                      <DialogDescription>Microsoft's document management and collaboration platform</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="mt-2">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">List documents</h4>
                          <p className="text-sm text-muted-foreground">Lists all documents in a SharePoint library</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Upload document</h4>
                          <p className="text-sm text-muted-foreground">Uploads a new document to SharePoint</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Download document</h4>
                          <p className="text-sm text-muted-foreground">Downloads a document from SharePoint</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Search documents</h4>
                          <p className="text-sm text-muted-foreground">Searches for documents across SharePoint sites</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Create folder</h4>
                          <p className="text-sm text-muted-foreground">Creates a new folder in a document library</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Share document</h4>
                          <p className="text-sm text-muted-foreground">Shares a document with specified users</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Gmail Actions Dialog */}
            <Dialog open={gmailActionsDialogOpen} onOpenChange={setGmailActionsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <button
                  onClick={() => setGmailActionsDialogOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <DialogHeader className="border-b pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Gmail</DialogTitle>
                      <DialogDescription>Google's email service for sending, receiving, and managing emails</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="mt-2">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">List labels</h4>
                          <p className="text-sm text-muted-foreground">Lists all labels in the user's mailbox. Agents can call this to find the appropriate label for categorizing emails</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Update label</h4>
                          <p className="text-sm text-muted-foreground">Add/remove labels on a message or a thread. First call 'Get email with attachments' to find the message ID</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Send email</h4>
                          <p className="text-sm text-muted-foreground">Creates and immediately sends an email from your Gmail account</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Search emails</h4>
                          <p className="text-sm text-muted-foreground">Searches through your Gmail inbox and returns emails matching the search criteria</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Create email draft</h4>
                          <p className="text-sm text-muted-foreground">Creates a draft email in your Gmail account without sending it</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Reply to email</h4>
                          <p className="text-sm text-muted-foreground">Creates and immediately sends an email from your Gmail account</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Get email with attachments</h4>
                          <p className="text-sm text-muted-foreground">Retrieves a single email thread or message with full content including attachments</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Create draft reply</h4>
                          <p className="text-sm text-muted-foreground">Creates a draft reply for an email</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Notion Actions Dialog */}
            <Dialog open={notionActionsDialogOpen} onOpenChange={setNotionActionsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <button
                  onClick={() => setNotionActionsDialogOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <DialogHeader className="border-b pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">N</span>
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Notion</DialogTitle>
                      <DialogDescription>All-in-one workspace for notes, docs, and collaboration</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="mt-2">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-base">N</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Search pages</h4>
                          <p className="text-sm text-muted-foreground">Searches for pages across your Notion workspace</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-base">N</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Create page</h4>
                          <p className="text-sm text-muted-foreground">Creates a new page in your Notion workspace</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-base">N</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Update page</h4>
                          <p className="text-sm text-muted-foreground">Updates content of an existing Notion page</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-base">N</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Query database</h4>
                          <p className="text-sm text-muted-foreground">Queries a Notion database with filters and sorting</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-base">N</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Create database entry</h4>
                          <p className="text-sm text-muted-foreground">Adds a new entry to a Notion database</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-base">N</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Get page content</h4>
                          <p className="text-sm text-muted-foreground">Retrieves the full content of a Notion page</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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