import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useLanguage, type LanguageType } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import LiquidGlassHeader from "@/components/LiquidGlassHeader";
import { Camera, Trash2, Key, Mail } from "lucide-react";

const Settings = () => {
  const { theme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  
  // Mock user data
  const currentUser = {
    firstName: "Moin",
    lastName: "Arian",
    email: "moin@example.com",
    userType: "Admin"
  };

  const [userProfile, setUserProfile] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    profilePicture: ""
  });
  
  // Define available languages
  const availableLanguages = [
    { code: "en" as LanguageType, name: "English" },
    { code: "de" as LanguageType, name: "Deutsch" },
    { code: "fr" as LanguageType, name: "Français" },
    { code: "es" as LanguageType, name: "Español" },
  ];
  
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    chatNotifications: true,
    workflowNotifications: true,
    updateNotifications: false,
    assistantVisibility: 'private' as 'public' | 'private'
  });
  
  const handleLanguageChange = useCallback((languageCode: LanguageType) => {
    changeLanguage(languageCode);
    toast.success(`Language changed to ${languageCode.toUpperCase()}`);
  }, [changeLanguage]);
  
  const handleProfileChange = useCallback((field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleProfilePictureChange = useCallback(() => {
    // Mock file input trigger
    toast.success("Profile picture updated!");
  }, []);

  const handleClearHistory = useCallback(() => {
    toast.success("Conversation history cleared!");
  }, []);

  const handleChangePassword = useCallback(() => {
    toast.info("Redirecting to password change...");
  }, []);

  const handleChangeEmail = useCallback(() => {
    toast.info("Email verification sent!");
  }, []);
  
  const handleSettingChange = useCallback((key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const handleSaveSettings = useCallback(() => {
    toast.success("Settings saved successfully!");
  }, []);
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.isDarkMode ? 'dark' : ''}`}>
      <LiquidGlassHeader
        title="Settings"
        subtitle="Customize your experience and preferences"
        currentUser={currentUser}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <Tabs defaultValue="general" className="w-full">
              <div className="border-b border-border p-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-6">
                <TabsContent value="general" className="space-y-6 mt-0">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Language Preferences</h2>
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
                  </Card>
                </TabsContent>
                
                <TabsContent value="account" className="space-y-6 mt-0">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                    
                    {/* Profile Picture Section */}
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={userProfile.profilePicture} />
                        <AvatarFallback className="text-lg">
                          {userProfile.firstName[0]}{userProfile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button
                          variant="outline"
                          onClick={handleProfilePictureChange}
                          className="hover:bg-black hover:text-white"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Change Picture
                        </Button>
                      </div>
                    </div>

                    <Separator className="mb-6" />
                    
                    {/* Name and Email Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="firstName" className="text-base font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          value={userProfile.firstName}
                          onChange={(e) => handleProfileChange('firstName', e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-base font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          value={userProfile.lastName}
                          onChange={(e) => handleProfileChange('lastName', e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Assistant Visibility</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-medium mb-2">Admin Visibility</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Control whether administrators can view your assistant activities and conversations.
                        </p>
                        <div className="flex items-center space-x-4">
                          <Button
                            variant={settings.assistantVisibility === 'private' ? "default" : "outline"}
                            onClick={() => handleSettingChange('assistantVisibility', 'private')}
                            className="hover:bg-black hover:text-white"
                          >
                            Private
                          </Button>
                          <Button
                            variant={settings.assistantVisibility === 'public' ? "default" : "outline"}
                            onClick={() => handleSettingChange('assistantVisibility', 'public')}
                            className="hover:bg-black hover:text-white"
                          >
                            Public
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {settings.assistantVisibility === 'private' 
                            ? 'Your assistant activities are only visible to you.' 
                            : 'Administrators can view your assistant activities for support and improvement purposes.'}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-medium mb-2">Conversation History</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          We securely store your conversations to provide personalized experiences. 
                          You can clear your data at any time.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={handleClearHistory}
                          className="hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All History
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Account Security</h2>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          variant="outline" 
                          onClick={handleChangePassword}
                          className="hover:bg-black hover:text-white"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleChangeEmail}
                          className="hover:bg-black hover:text-white"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Change Email Address
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </div>
              
              <div className="border-t border-border p-6 flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-primary hover:bg-black hover:text-white"
                >
                  Save All Settings
                </Button>
              </div>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;