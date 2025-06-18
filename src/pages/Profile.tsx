
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, User, Mail, Edit, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import LiquidGlassHeader from "@/components/LiquidGlassHeader";

const Profile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [firstName, setFirstName] = useState("Moin");
  const [lastName, setLastName] = useState("Arian");
  const [email] = useState("moin@example.com");
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg");
  const [isUploading, setIsUploading] = useState(false);
  const [userType] = useState("Admin");
  
  const fullName = `${firstName} ${lastName}`;
  const currentUser = { firstName, lastName, email };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      
      setTimeout(() => {
        const file = e.target.files![0];
        const newAvatarUrl = URL.createObjectURL(file);
        setAvatarUrl(newAvatarUrl);
        setIsUploading(false);
        toast.success("Profile picture updated successfully!");
      }, 1000);
    }
  };

  const handleSave = () => {
    toast.success("Profile settings saved successfully!");
  };

  const getUserTypeVariant = (type: string) => {
    switch (type) {
      case "Super Admin":
        return "destructive";
      case "Admin":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300 ${theme.isDarkMode ? 'dark' : ''}`}>
      <LiquidGlassHeader
        title="Profile Settings"
        subtitle="Manage your account and preferences"
        currentUser={currentUser}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl -mt-8 relative z-10">
        <div className="space-y-6">
          {/* Profile Picture Card - Mobile Optimized */}
          <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className={`flex ${isMobile ? 'flex-col items-center text-center' : 'items-center'} gap-6`}>
                <div className="relative group">
                  <Avatar className={`${isMobile ? 'w-24 h-24' : 'w-20 h-20'} ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40`}>
                    <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-accent text-white">
                      {firstName[0]}{lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center w-full h-full">
                      <Camera className="text-white w-6 h-6" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </label>
                  </button>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {fullName}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {email}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={isUploading}
                      className="hover:bg-black hover:text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Change"}
                    </Button>
                    <Badge variant={getUserTypeVariant(userType)} className="px-3 py-1">
                      {userType}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <User className="w-4 h-4" />
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="pl-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-700"
                    placeholder="Email address (read-only)"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Email address cannot be changed. Contact your administrator if needed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-optimized Action Buttons */}
          <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'justify-end'}`}>
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className={`${isMobile ? 'order-2' : ''} bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-black hover:text-white`}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className={`${isMobile ? 'order-1' : ''} bg-gradient-to-r from-primary to-accent hover:bg-black hover:text-white shadow-lg`}
            >
              <Edit className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
