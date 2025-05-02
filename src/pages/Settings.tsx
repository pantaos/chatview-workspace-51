
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ModernNavbar from "@/components/ModernNavbar";
import { useLanguage, type LanguageType } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const Settings = () => {
  const { theme, updateTheme } = useTheme();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [selectedColor, setSelectedColor] = useState(theme.primaryColor);
  
  const handleLanguageChange = (language: LanguageType) => {
    changeLanguage(language);
    toast.success(`Language changed to ${language}`);
  };
  
  const handleThemeChange = (color: string) => {
    setSelectedColor(color);
    updateTheme({ primaryColor: color });
    toast.success("Theme color updated");
  };
  
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Language</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={currentLanguage === lang.code ? "default" : "outline"}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-full"
                  >
                    {lang.name}
                  </Button>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Auto Save</h2>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Enable auto-save for conversations</Label>
                <Switch 
                  id="auto-save" 
                  checked={autoSaveEnabled}
                  onCheckedChange={setAutoSaveEnabled}
                />
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Theme</h2>
              <div className="flex items-center justify-between mb-6">
                <Label htmlFor="dark-mode">Dark mode</Label>
                <Switch 
                  id="dark-mode" 
                  checked={darkModeEnabled}
                  onCheckedChange={setDarkModeEnabled}
                />
              </div>
              
              <h3 className="text-lg font-medium mb-3">Primary Color</h3>
              <div className="grid grid-cols-5 gap-3">
                {["#1CB5E0", "#FF8C00", "#26A69A", "#7C4DFF", "#F44336"].map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color ? "border-black" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleThemeChange(color)}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-notifs">Enable notifications</Label>
                <Switch 
                  id="enable-notifs" 
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              {notificationsEnabled && (
                <div className="mt-6 space-y-4">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chat-notifs">Chat messages</Label>
                    <Switch id="chat-notifs" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="workflow-notifs">Workflow completions</Label>
                    <Switch id="workflow-notifs" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="update-notifs">Product updates</Label>
                    <Switch id="update-notifs" />
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Data Storage</h2>
              <p className="text-gray-600 mb-6">
                We store your conversations securely to provide personalized experiences.
                You can clear your data at any time.
              </p>
              <Button variant="outline">Clear Conversation History</Button>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Account Security</h2>
              <div className="space-y-4">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Enable Two-Factor Authentication</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
