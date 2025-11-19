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
import LiquidGlassHeader from "@/components/LiquidGlassHeader";
import { Mail, Globe, User, Puzzle, MessageSquare, Calendar, FileText, Image, Info, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { theme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [outlookDialogOpen, setOutlookDialogOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<LanguageType>("en");
  const [calendarConnectDialogOpen, setCalendarConnectDialogOpen] = useState(false);
  const [sharepointConnectDialogOpen, setSharepointConnectDialogOpen] = useState(false);
  const [gmailConnectDialogOpen, setGmailConnectDialogOpen] = useState(false);
  const [notionConnectDialogOpen, setNotionConnectDialogOpen] = useState(false);
  
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
  
  // Connection status for each integration
  const [integrationStatus, setIntegrationStatus] = useState({
    outlook: true,
    calendar: true,
    sharepoint: false,
    gmail: true,
    notion: false
  });
  
  // Assistant integration toggles
  const [assistantIntegrations, setAssistantIntegrations] = useState({
    gmail: false,
    slack: false,
    github: false,
    outlook: false,
    calendar: false,
    sharepoint: false,
    notion: false,
    trello: false,
    asana: false,
    jira: false,
    aws: false
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
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Tool Integrations</h2>
              <p className="text-muted-foreground">
                Connect your favorite apps so your assistant can access their information, based on what you're authorized to view.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 hover:bg-muted/50 transition-colors group relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOutlookActionsDialogOpen(true);
                  }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full hover:bg-muted/20 flex items-center justify-center transition-colors z-10"
                >
                  <Info className="w-3 h-3 text-muted-foreground" />
                </button>
                
                <div 
                  className="flex flex-col items-center text-center space-y-2 cursor-pointer"
                  onClick={() => integrationStatus.outlook ? setOutlookPermissionsDialogOpen(true) : setOutlookDialogOpen(true)}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary">Microsoft Outlook</h3>
                  <p className={`text-xs font-medium ${integrationStatus.outlook ? 'text-foreground' : 'text-red-500'}`}>
                    {integrationStatus.outlook ? 'Connected' : 'Not Connected'}
                  </p>
                  {integrationStatus.outlook && (
                    <p className="text-xs text-muted-foreground">5 permissions</p>
                  )}
                </div>
              </Card>

              <Card className="p-4 hover:bg-muted/50 transition-colors group relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCalendarActionsDialogOpen(true);
                  }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full hover:bg-muted/20 flex items-center justify-center transition-colors z-10"
                >
                  <Info className="w-3 h-3 text-muted-foreground" />
                </button>
                
                <div 
                  className="flex flex-col items-center text-center space-y-2 cursor-pointer"
                  onClick={() => integrationStatus.calendar ? setCalendarPermissionsDialogOpen(true) : setCalendarConnectDialogOpen(true)}
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary">Microsoft Calendar</h3>
                  <p className={`text-xs font-medium ${integrationStatus.calendar ? 'text-foreground' : 'text-red-500'}`}>
                    {integrationStatus.calendar ? 'Connected' : 'Not Connected'}
                  </p>
                  {integrationStatus.calendar && (
                    <p className="text-xs text-muted-foreground">5 permissions</p>
                  )}
                </div>
              </Card>

              <Card className="p-4 hover:bg-muted/50 transition-colors group relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSharepointActionsDialogOpen(true);
                  }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full hover:bg-muted/20 flex items-center justify-center transition-colors z-10"
                >
                  <Info className="w-3 h-3 text-muted-foreground" />
                </button>
                
                <div 
                  className="flex flex-col items-center text-center space-y-2 cursor-pointer"
                  onClick={() => integrationStatus.sharepoint ? setSharepointPermissionsDialogOpen(true) : setSharepointConnectDialogOpen(true)}
                >
                  <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary">SharePoint</h3>
                  <p className={`text-xs font-medium ${integrationStatus.sharepoint ? 'text-foreground' : 'text-red-500'}`}>
                    {integrationStatus.sharepoint ? 'Connected' : 'Not Connected'}
                  </p>
                  {integrationStatus.sharepoint && (
                    <p className="text-xs text-muted-foreground">5 permissions</p>
                  )}
                </div>
              </Card>

              <Card className="p-4 hover:bg-muted/50 transition-colors group relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGmailActionsDialogOpen(true);
                  }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full hover:bg-muted/20 flex items-center justify-center transition-colors z-10"
                >
                  <Info className="w-3 h-3 text-muted-foreground" />
                </button>
                
                <div 
                  className="flex flex-col items-center text-center space-y-2 cursor-pointer"
                  onClick={() => integrationStatus.gmail ? setGmailPermissionsDialogOpen(true) : setGmailConnectDialogOpen(true)}
                >
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary">Gmail</h3>
                  <p className={`text-xs font-medium ${integrationStatus.gmail ? 'text-foreground' : 'text-red-500'}`}>
                    {integrationStatus.gmail ? 'Connected' : 'Not Connected'}
                  </p>
                  {integrationStatus.gmail && (
                    <p className="text-xs text-muted-foreground">5 permissions</p>
                  )}
                </div>
              </Card>

              <Card className="p-4 hover:bg-muted/50 transition-colors group relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotionActionsDialogOpen(true);
                  }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full hover:bg-muted/20 flex items-center justify-center transition-colors z-10"
                >
                  <Info className="w-3 h-3 text-muted-foreground" />
                </button>
                
                <div 
                  className="flex flex-col items-center text-center space-y-2 cursor-pointer"
                  onClick={() => integrationStatus.notion ? setNotionPermissionsDialogOpen(true) : setNotionConnectDialogOpen(true)}
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-base">N</span>
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary">Notion</h3>
                  <p className={`text-xs font-medium ${integrationStatus.notion ? 'text-foreground' : 'text-red-500'}`}>
                    {integrationStatus.notion ? 'Connected' : 'Not Connected'}
                  </p>
                  {integrationStatus.notion && (
                    <p className="text-xs text-muted-foreground">5 permissions</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Assistant Integration Configuration */}
            <div className="mt-10">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Configure Assistant Integrations</h2>
                <p className="text-muted-foreground">
                  Select which integrations your new assistant will have access to
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {/* Microsoft Office */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center">Microsoft Office</span>
                  <Switch 
                    checked={assistantIntegrations.outlook}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, outlook: checked})}
                  />
                </Card>

                {/* Notion */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">N</span>
                  </div>
                  <span className="text-sm font-medium text-center">Notion</span>
                  <Switch 
                    checked={assistantIntegrations.notion}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, notion: checked})}
                  />
                </Card>

                {/* Gmail */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center">Gmail</span>
                  <Switch 
                    checked={assistantIntegrations.gmail}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, gmail: checked})}
                  />
                </Card>

                {/* GitHub */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-center">GitHub</span>
                  <Switch 
                    checked={assistantIntegrations.github}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, github: checked})}
                  />
                </Card>

                {/* AWS */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.144.24l-.479.319c-.064.048-.128.063-.183.063-.08 0-.16-.04-.239-.112-.112-.12-.207-.248-.279-.383-.08-.135-.16-.287-.256-.455-.639.76-1.44 1.135-2.399 1.135-.687 0-1.232-.2-1.64-.6-.407-.399-.615-.936-.615-1.599 0-.711.255-1.287.775-1.727.52-.44 1.215-.664 2.096-.664.287 0 .583.024.895.064.312.04.632.104.967.16v-.528c0-.543-.112-.92-.32-1.135-.216-.215-.583-.32-1.111-.32-.24 0-.487.032-.743.08-.255.047-.504.112-.743.199-.112.048-.199.08-.248.096-.048.016-.08.024-.104.024-.096 0-.144-.072-.144-.208v-.32c0-.111.016-.191.056-.24.04-.048.112-.096.239-.144.24-.127.527-.232.863-.32.336-.08.695-.12 1.08-.12.824 0 1.424.191 1.816.576.391.384.583.968.583 1.75v2.303zm-3.295 1.231c.279 0 .567-.048.879-.144.312-.096.591-.28.831-.535.144-.16.248-.336.296-.535.048-.2.08-.44.08-.72v-.335c-.24-.048-.495-.088-.767-.12-.271-.031-.535-.047-.791-.047-.559 0-.967.111-1.231.343-.263.232-.391.56-.391.984 0 .408.104.712.319.927.215.216.527.32.967.32zm6.606.896c-.112 0-.192-.024-.248-.064-.056-.048-.104-.144-.152-.263l-1.687-5.543c-.048-.16-.072-.263-.072-.319 0-.128.064-.2.192-.2h.783c.12 0 .2.024.247.064.048.048.096.144.144.263l1.207 4.752 1.119-4.752c.032-.16.08-.215.127-.263.048-.048.136-.064.256-.064h.639c.12 0 .207.024.255.064.048.048.104.144.128.263l1.135 4.8 1.239-4.8c.048-.16.104-.215.151-.263.048-.048.128-.064.248-.064h.743c.127 0 .2.064.2.2 0 .04-.008.08-.016.127-.008.048-.024.112-.056.192L18.442 13.86c-.048.16-.104.215-.151.263-.048.048-.128.064-.248.064h-.687c-.12 0-.207-.024-.255-.064-.048-.048-.104-.144-.128-.263L15.847 9.16l-1.111 4.727c-.032.16-.08.215-.127.263-.048.048-.136.064-.256.064h-.688zm10.695.271c-.431 0-.863-.048-1.279-.144-.416-.096-.735-.208-.951-.335-.128-.08-.215-.167-.247-.231-.032-.064-.048-.136-.048-.2v-.335c0-.136.056-.2.151-.2.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.56.215.863.279.304.064.608.096.911.096.511 0 .911-.088 1.191-.264.287-.176.424-.448.424-.8 0-.24-.08-.44-.239-.6-.16-.159-.48-.311-.96-.455l-1.375-.431c-.695-.216-1.207-.536-1.527-.96-.32-.416-.479-.872-.479-1.367 0-.4.087-.751.263-1.055.176-.304.415-.567.719-.791.304-.224.655-.391 1.063-.495.408-.104.847-.159 1.319-.159.184 0 .375.008.567.032.192.024.375.056.56.088.175.04.343.08.502.127.16.048.295.096.415.144.112.064.2.127.247.192.048.064.072.152.072.263v.311c0 .136-.056.208-.151.208-.064 0-.168-.032-.295-.096-.495-.224-1.031-.336-1.615-.336-.464 0-.831.072-1.095.224-.264.151-.391.392-.391.727 0 .24.087.447.263.623.176.176.511.36 1.015.536l1.351.431c.687.22 1.191.527 1.495.927.304.4.455.88.455 1.439 0 .416-.087.791-.255 1.127-.176.336-.415.631-.727.879-.312.248-.687.44-1.127.583-.448.135-.936.207-1.463.207z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-center">AWS</span>
                  <Switch 
                    checked={assistantIntegrations.aws}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, aws: checked})}
                  />
                </Card>

                {/* Slack */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center">Slack</span>
                  <Switch 
                    checked={assistantIntegrations.slack}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, slack: checked})}
                  />
                </Card>

                {/* Calendar */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center">Calendar</span>
                  <Switch 
                    checked={assistantIntegrations.calendar}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, calendar: checked})}
                  />
                </Card>

                {/* SharePoint */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-blue-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center">SharePoint</span>
                  <Switch 
                    checked={assistantIntegrations.sharepoint}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, sharepoint: checked})}
                  />
                </Card>

                {/* Trello */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-center">Trello</span>
                  <Switch 
                    checked={assistantIntegrations.trello}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, trello: checked})}
                  />
                </Card>

                {/* Asana */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.78 12.653c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.338-5.22-5.22-5.22zm-13.56 0c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.338-5.22-5.22-5.22zM12 .907C9.118.907 6.78 3.243 6.78 6.127s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22S14.882.907 12 .907z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-center">Asana</span>
                  <Switch 
                    checked={assistantIntegrations.asana}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, asana: checked})}
                  />
                </Card>

                {/* Jira */}
                <Card className="p-6 flex flex-col items-center justify-center space-y-3 aspect-square">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.757a1 1 0 0 0-1.001-1zm5.7-5.756H11.436a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057a5.215 5.215 0 0 0 5.215 5.215V1a1 1 0 0 0-1.001-1z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-center">Jira</span>
                  <Switch 
                    checked={assistantIntegrations.jira}
                    onCheckedChange={(checked) => setAssistantIntegrations({...assistantIntegrations, jira: checked})}
                  />
                </Card>
              </div>
            </div>

            {/* Outlook Permissions Dialog */}
            <Dialog open={outlookPermissionsDialogOpen} onOpenChange={setOutlookPermissionsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Microsoft Outlook Permissions</DialogTitle>
                      <DialogDescription>Manage what Outlook can access</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Read emails</p>
                      <p className="text-sm text-muted-foreground">Access and view your email messages</p>
                    </div>
                    <Switch 
                      checked={outlookPermissions.readEmails}
                      onCheckedChange={(checked) => setOutlookPermissions({...outlookPermissions, readEmails: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Draft emails</p>
                      <p className="text-sm text-muted-foreground">Create draft messages in your mailbox</p>
                    </div>
                    <Switch 
                      checked={outlookPermissions.draftEmails}
                      onCheckedChange={(checked) => setOutlookPermissions({...outlookPermissions, draftEmails: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Send emails</p>
                      <p className="text-sm text-muted-foreground">Send emails on your behalf</p>
                    </div>
                    <Switch 
                      checked={outlookPermissions.sendEmails}
                      onCheckedChange={(checked) => setOutlookPermissions({...outlookPermissions, sendEmails: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Search emails</p>
                      <p className="text-sm text-muted-foreground">Search through your mailbox</p>
                    </div>
                    <Switch 
                      checked={outlookPermissions.searchEmails}
                      onCheckedChange={(checked) => setOutlookPermissions({...outlookPermissions, searchEmails: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Manage labels</p>
                      <p className="text-sm text-muted-foreground">Add or remove email labels</p>
                    </div>
                    <Switch 
                      checked={outlookPermissions.manageLabels}
                      onCheckedChange={(checked) => setOutlookPermissions({...outlookPermissions, manageLabels: checked})}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setOutlookPermissionsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setOutlookPermissionsDialogOpen(false);
                    toast.success("Outlook permissions updated");
                  }}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Calendar Permissions Dialog */}
            <Dialog open={calendarPermissionsDialogOpen} onOpenChange={setCalendarPermissionsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Microsoft Calendar Permissions</DialogTitle>
                      <DialogDescription>Manage what Calendar can access</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Read events</p>
                      <p className="text-sm text-muted-foreground">View your calendar and events</p>
                    </div>
                    <Switch 
                      checked={calendarPermissions.readEvents}
                      onCheckedChange={(checked) => setCalendarPermissions({...calendarPermissions, readEvents: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Create events</p>
                      <p className="text-sm text-muted-foreground">Add new events to your calendar</p>
                    </div>
                    <Switch 
                      checked={calendarPermissions.createEvents}
                      onCheckedChange={(checked) => setCalendarPermissions({...calendarPermissions, createEvents: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Update events</p>
                      <p className="text-sm text-muted-foreground">Modify existing calendar events</p>
                    </div>
                    <Switch 
                      checked={calendarPermissions.updateEvents}
                      onCheckedChange={(checked) => setCalendarPermissions({...calendarPermissions, updateEvents: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Delete events</p>
                      <p className="text-sm text-muted-foreground">Remove events from calendar</p>
                    </div>
                    <Switch 
                      checked={calendarPermissions.deleteEvents}
                      onCheckedChange={(checked) => setCalendarPermissions({...calendarPermissions, deleteEvents: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Find availability</p>
                      <p className="text-sm text-muted-foreground">Check free time slots</p>
                    </div>
                    <Switch 
                      checked={calendarPermissions.findAvailability}
                      onCheckedChange={(checked) => setCalendarPermissions({...calendarPermissions, findAvailability: checked})}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setCalendarPermissionsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setCalendarPermissionsDialogOpen(false);
                    toast.success("Calendar permissions updated");
                  }}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* SharePoint Permissions Dialog */}
            <Dialog open={sharepointPermissionsDialogOpen} onOpenChange={setSharepointPermissionsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">SharePoint Permissions</DialogTitle>
                      <DialogDescription>Manage what SharePoint can access</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">List documents</p>
                      <p className="text-sm text-muted-foreground">View all documents in libraries</p>
                    </div>
                    <Switch 
                      checked={sharepointPermissions.listDocuments}
                      onCheckedChange={(checked) => setSharepointPermissions({...sharepointPermissions, listDocuments: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Upload documents</p>
                      <p className="text-sm text-muted-foreground">Add new files to SharePoint</p>
                    </div>
                    <Switch 
                      checked={sharepointPermissions.uploadDocuments}
                      onCheckedChange={(checked) => setSharepointPermissions({...sharepointPermissions, uploadDocuments: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Download documents</p>
                      <p className="text-sm text-muted-foreground">Download files from SharePoint</p>
                    </div>
                    <Switch 
                      checked={sharepointPermissions.downloadDocuments}
                      onCheckedChange={(checked) => setSharepointPermissions({...sharepointPermissions, downloadDocuments: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Search documents</p>
                      <p className="text-sm text-muted-foreground">Search across SharePoint sites</p>
                    </div>
                    <Switch 
                      checked={sharepointPermissions.searchDocuments}
                      onCheckedChange={(checked) => setSharepointPermissions({...sharepointPermissions, searchDocuments: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Share documents</p>
                      <p className="text-sm text-muted-foreground">Share files with others</p>
                    </div>
                    <Switch 
                      checked={sharepointPermissions.shareDocuments}
                      onCheckedChange={(checked) => setSharepointPermissions({...sharepointPermissions, shareDocuments: checked})}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setSharepointPermissionsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setSharepointPermissionsDialogOpen(false);
                    toast.success("SharePoint permissions updated");
                  }}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Gmail Permissions Dialog */}
            <Dialog open={gmailPermissionsDialogOpen} onOpenChange={setGmailPermissionsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Gmail Permissions</DialogTitle>
                      <DialogDescription>Manage what Gmail can access</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Read emails</p>
                      <p className="text-sm text-muted-foreground">Access and view your email messages</p>
                    </div>
                    <Switch 
                      checked={gmailPermissions.readEmails}
                      onCheckedChange={(checked) => setGmailPermissions({...gmailPermissions, readEmails: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Draft emails</p>
                      <p className="text-sm text-muted-foreground">Create draft messages in your mailbox</p>
                    </div>
                    <Switch 
                      checked={gmailPermissions.draftEmails}
                      onCheckedChange={(checked) => setGmailPermissions({...gmailPermissions, draftEmails: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Send emails</p>
                      <p className="text-sm text-muted-foreground">Send emails on your behalf</p>
                    </div>
                    <Switch 
                      checked={gmailPermissions.sendEmails}
                      onCheckedChange={(checked) => setGmailPermissions({...gmailPermissions, sendEmails: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Search emails</p>
                      <p className="text-sm text-muted-foreground">Search through your mailbox</p>
                    </div>
                    <Switch 
                      checked={gmailPermissions.searchEmails}
                      onCheckedChange={(checked) => setGmailPermissions({...gmailPermissions, searchEmails: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Manage labels</p>
                      <p className="text-sm text-muted-foreground">Add or remove email labels</p>
                    </div>
                    <Switch 
                      checked={gmailPermissions.manageLabels}
                      onCheckedChange={(checked) => setGmailPermissions({...gmailPermissions, manageLabels: checked})}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setGmailPermissionsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setGmailPermissionsDialogOpen(false);
                    toast.success("Gmail permissions updated");
                  }}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Notion Permissions Dialog */}
            <Dialog open={notionPermissionsDialogOpen} onOpenChange={setNotionPermissionsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">N</span>
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Notion Permissions</DialogTitle>
                      <DialogDescription>Manage what Notion can access</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Search pages</p>
                      <p className="text-sm text-muted-foreground">Search across your workspace</p>
                    </div>
                    <Switch 
                      checked={notionPermissions.searchPages}
                      onCheckedChange={(checked) => setNotionPermissions({...notionPermissions, searchPages: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Create pages</p>
                      <p className="text-sm text-muted-foreground">Add new pages to workspace</p>
                    </div>
                    <Switch 
                      checked={notionPermissions.createPages}
                      onCheckedChange={(checked) => setNotionPermissions({...notionPermissions, createPages: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Update pages</p>
                      <p className="text-sm text-muted-foreground">Modify existing pages</p>
                    </div>
                    <Switch 
                      checked={notionPermissions.updatePages}
                      onCheckedChange={(checked) => setNotionPermissions({...notionPermissions, updatePages: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium">Query database</p>
                      <p className="text-sm text-muted-foreground">Access database content</p>
                    </div>
                    <Switch 
                      checked={notionPermissions.queryDatabase}
                      onCheckedChange={(checked) => setNotionPermissions({...notionPermissions, queryDatabase: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Create entries</p>
                      <p className="text-sm text-muted-foreground">Add entries to databases</p>
                    </div>
                    <Switch 
                      checked={notionPermissions.createEntries}
                      onCheckedChange={(checked) => setNotionPermissions({...notionPermissions, createEntries: checked})}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setNotionPermissionsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setNotionPermissionsDialogOpen(false);
                    toast.success("Notion permissions updated");
                  }}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Outlook Connection Dialog */}
            <Dialog open={outlookDialogOpen} onOpenChange={setOutlookDialogOpen}>
              <DialogContent className="max-w-md mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <DialogTitle className="text-xl font-semibold">Connect Microsoft Outlook</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Developed by Panta Flows
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      This page will redirect to Microsoft for sign-in and permissions.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your Microsoft Calendar data is private and only used to answer your prompts — never to train models, unless you share it as feedback.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You're in control: deleting a conversation also deletes any linked Microsoft data.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    className="flex-1 bg-black hover:bg-black/90 text-white font-medium py-3 rounded-xl"
                    onClick={() => {
                      setOutlookDialogOpen(false);
                      toast.success("Redirecting to Microsoft Outlook...");
                    }}
                  >
                    Continue to Microsoft Outlook
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Calendar Connection Dialog */}
            <Dialog open={calendarConnectDialogOpen} onOpenChange={setCalendarConnectDialogOpen}>
              <DialogContent className="max-w-md mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <DialogTitle className="text-xl font-semibold">Connect Microsoft Calendar</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Developed by Panta Flows
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      This page will redirect to Microsoft for sign-in and permissions.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your Microsoft Calendar data is private and only used to answer your prompts — never to train models, unless you share it as feedback.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You're in control: deleting a conversation also deletes any linked Microsoft data.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    className="flex-1 bg-black hover:bg-black/90 text-white font-medium py-3 rounded-xl"
                    onClick={() => {
                      setCalendarConnectDialogOpen(false);
                      toast.success("Redirecting to Microsoft Calendar...");
                    }}
                  >
                    Continue to Microsoft Calendar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* SharePoint Connection Dialog */}
            <Dialog open={sharepointConnectDialogOpen} onOpenChange={setSharepointConnectDialogOpen}>
              <DialogContent className="max-w-md mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <DialogTitle className="text-xl font-semibold">Connect SharePoint</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Developed by Panta Flows
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      This page will redirect to Microsoft for sign-in and permissions.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your SharePoint data is private and only used to answer your prompts — never to train models, unless you share it as feedback.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You're in control: deleting a conversation also deletes any linked SharePoint data.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    className="flex-1 bg-black hover:bg-black/90 text-white font-medium py-3 rounded-xl"
                    onClick={() => {
                      setSharepointConnectDialogOpen(false);
                      toast.success("Redirecting to SharePoint...");
                    }}
                  >
                    Continue to SharePoint
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Gmail Connection Dialog */}
            <Dialog open={gmailConnectDialogOpen} onOpenChange={setGmailConnectDialogOpen}>
              <DialogContent className="max-w-md mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <DialogTitle className="text-xl font-semibold">Connect Gmail</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Developed by Panta Flows
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      This page will redirect to Google for sign-in and permissions.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your Gmail data is private and only used to answer your prompts — never to train models, unless you share it as feedback.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You're in control: deleting a conversation also deletes any linked Gmail data.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    className="flex-1 bg-black hover:bg-black/90 text-white font-medium py-3 rounded-xl"
                    onClick={() => {
                      setGmailConnectDialogOpen(false);
                      toast.success("Redirecting to Gmail...");
                    }}
                  >
                    Continue to Gmail
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Notion Connection Dialog */}
            <Dialog open={notionConnectDialogOpen} onOpenChange={setNotionConnectDialogOpen}>
              <DialogContent className="max-w-md mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">N</span>
                    </div>
                  </div>
                  <DialogTitle className="text-xl font-semibold">Connect Notion</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Developed by Panta Flows
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      This page will redirect to Notion for sign-in and permissions.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your Notion data is private and only used to answer your prompts — never to train models, unless you share it as feedback.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You're in control: deleting a conversation also deletes any linked Notion data.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    className="flex-1 bg-black hover:bg-black/90 text-white font-medium py-3 rounded-xl"
                    onClick={() => {
                      setNotionConnectDialogOpen(false);
                      toast.success("Redirecting to Notion...");
                    }}
                  >
                    Continue to Notion
                  </Button>
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
  }, [activeTab, availableLanguages, language, userProfile, handleLanguageChange, chatLanguage, integrationToggles, handleToggleIntegration, handleChatLanguageChange, calendarConnectDialogOpen, sharepointConnectDialogOpen, gmailConnectDialogOpen, notionConnectDialogOpen]);
  
  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 ${theme.isDarkMode ? 'dark' : ''}`}>
      <LiquidGlassHeader
        title="Settings"
        subtitle="Configure your preferences and personalize your workspace."
        currentUser={currentUser}
        showBackButton={!isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showSidebarToggle={true}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Card className={`border border-slate-200/50 dark:border-slate-700/50 shadow-lg bg-white dark:bg-slate-800 ${isMobile ? 'min-h-[calc(100vh-140px)]' : 'min-h-[700px]'} rounded-2xl`}>
            <div className="flex h-full">
              {/* Mobile Sidebar Overlay */}
              {isMobile && sidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              {/* Sidebar */}
              <div className={`${
                isMobile 
                  ? `fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 ${
                      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`
                  : 'w-72 border-r border-slate-200 dark:border-slate-800'
              } ${isMobile ? 'pt-16' : ''}`}>
                <div className="p-6">
                  {!isMobile && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Settings</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Customize your experience</p>
                    </div>
                  )}
                  
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "hover:bg-black hover:text-white text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <Icon className={`w-5 h-5 mt-0.5 ${isActive ? "text-primary-foreground" : "group-hover:text-white dark:group-hover:text-white"}`} />
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium ${isActive ? "text-primary-foreground" : "group-hover:text-white dark:group-hover:text-white"}`}>
                              {tab.label}
                            </div>
                            <div className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-slate-500 dark:text-slate-400 group-hover:text-white/80 dark:group-hover:text-white/80"}`}>
                              {tab.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-4xl">
                  {renderContent()}
                </div>
              </div>
            </div>

          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;