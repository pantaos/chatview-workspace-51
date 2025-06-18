
import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useLanguage, type LanguageType } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import LiquidGlassHeader from "@/components/LiquidGlassHeader";

const Settings = () => {
  const { theme, updateTheme, toggleDarkMode } = useTheme();
  const { language, changeLanguage } = useLanguage();
  
  // Mock user data
  const currentUser = {
    firstName: "Moin",
    lastName: "Arian",
    email: "moin@example.com",
    userType: "Admin"
  };
  
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
    updateNotifications: false
  });
  
  const handleLanguageChange = useCallback((languageCode: LanguageType) => {
    changeLanguage(languageCode);
    toast.success(`Language changed to ${languageCode.toUpperCase()}`);
  }, [changeLanguage]);
  
  const handleThemeChange = useCallback((color: string) => {
    updateTheme({ primaryColor: color });
    toast.success("Theme color updated");
  }, [updateTheme]);
  
  const handleSettingChange = useCallback((key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const handleSaveSettings = useCallback(() => {
    toast.success("Settings saved successfully!");
  }, []);

  const themeColors = [
    { color: "#1CB5E0", name: "PANTA Blue" },
    { color: "#FF8C00", name: "PANTA Orange" },
    { color: "#26A69A", name: "PANTA Teal" },
    { color: "#7C4DFF", name: "Purple" },
    { color: "#F44336", name: "Red" }
  ];
  
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
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
                  
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Workspace</h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-save" className="text-base font-medium">Auto Save</Label>
                        <p className="text-sm text-muted-foreground">Automatically save conversations and workflows</p>
                      </div>
                      <Switch 
                        id="auto-save" 
                        checked={settings.autoSave}
                        onCheckedChange={(value) => handleSettingChange('autoSave', value)}
                      />
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <Label htmlFor="dark-mode" className="text-base font-medium">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={theme.isDarkMode}
                        onCheckedChange={toggleDarkMode}
                      />
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-medium mb-4">Brand Colors</h3>
                    <div className="grid grid-cols-5 gap-4">
                      {themeColors.map(({ color, name }) => (
                        <button
                          key={color}
                          className={`group flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            theme.primaryColor === color 
                              ? "border-primary bg-primary/5" 
                              : "border-transparent hover:border-border hover:bg-muted/50"
                          }`}
                          onClick={() => handleThemeChange(color)}
                        >
                          <div 
                            className="w-8 h-8 rounded-full shadow-md"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs font-medium text-center">{name}</span>
                        </button>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-6 mt-0">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable-notifs" className="text-base font-medium">Enable Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications for important events</p>
                        </div>
                        <Switch 
                          id="enable-notifs" 
                          checked={settings.notifications}
                          onCheckedChange={(value) => handleSettingChange('notifications', value)}
                        />
                      </div>
                      
                      {settings.notifications && (
                        <>
                          <Separator />
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="chat-notifs" className="text-base font-medium">Chat Messages</Label>
                                <p className="text-sm text-muted-foreground">Get notified about new chat messages</p>
                              </div>
                              <Switch 
                                id="chat-notifs" 
                                checked={settings.chatNotifications}
                                onCheckedChange={(value) => handleSettingChange('chatNotifications', value)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="workflow-notifs" className="text-base font-medium">Workflow Updates</Label>
                                <p className="text-sm text-muted-foreground">Notifications when workflows complete</p>
                              </div>
                              <Switch 
                                id="workflow-notifs" 
                                checked={settings.workflowNotifications}
                                onCheckedChange={(value) => handleSettingChange('workflowNotifications', value)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="update-notifs" className="text-base font-medium">Product Updates</Label>
                                <p className="text-sm text-muted-foreground">News about new features and improvements</p>
                              </div>
                              <Switch 
                                id="update-notifs" 
                                checked={settings.updateNotifications}
                                onCheckedChange={(value) => handleSettingChange('updateNotifications', value)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="privacy" className="space-y-6 mt-0">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-medium mb-2">Conversation History</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          We securely store your conversations to provide personalized experiences. 
                          You can clear your data at any time.
                        </p>
                        <Button variant="outline" className="hover:bg-black hover:text-white">
                          Clear All History
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-base font-medium mb-2">Account Security</h3>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full sm:w-auto hover:bg-black hover:text-white">
                            Change Password
                          </Button>
                          <Button variant="outline" className="w-full sm:w-auto hover:bg-black hover:text-white">
                            Two-Factor Authentication
                          </Button>
                        </div>
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
