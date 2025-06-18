
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, User, Mail, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileDropdown from "@/components/ProfileDropdown";
import Logo from "@/components/Logo";
import AdminSettings from "@/components/AdminSettings";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

const Profile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [firstName, setFirstName] = useState("Moin");
  const [lastName, setLastName] = useState("Arian");
  const [email] = useState("moin@example.com"); // Email is read-only
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg");
  const [isUploading, setIsUploading] = useState(false);
  const [userType] = useState("Admin"); // This would come from user context/auth
  
  const fullName = `${firstName} ${lastName}`;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      
      // Simulate file upload
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
    <div className={`min-h-screen transition-colors duration-300 ${theme.isDarkMode ? 'dark' : ''}`}>
      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-900 dark:via-purple-900 dark:to-blue-950">
        <header className="backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/20 text-white"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Logo />
            </div>
            <ProfileDropdown 
              name={fullName} 
              email={email} 
              avatarUrl={avatarUrl}
            />
          </div>
        </header>
        
        {/* Page title section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
            <p className="text-white/80 text-lg">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Admin Settings */}
          <AdminSettings userType={userType} />

          {/* Profile Information Card */}
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <User className="w-5 h-5" />
                </div>
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="relative group">
                  <Avatar className="w-32 h-32 ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                    <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-accent text-white">
                      {firstName[0]}{lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center w-full h-full">
                      <Upload className="text-white w-8 h-8" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Profile Picture</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload a new profile picture or use your initials as a fallback
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={isUploading}
                      className="hover:bg-primary/5"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Change Picture"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setAvatarUrl("/placeholder.svg")}
                      className="hover:bg-destructive/5 hover:text-destructive"
                    >
                      Use Initials
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border"></div>

              {/* Personal Information */}
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="pl-10 h-12 bg-muted/30 text-muted-foreground cursor-not-allowed"
                      placeholder="Email address (read-only)"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed. Contact your administrator if needed.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">User Type</Label>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={getUserTypeVariant(userType)} 
                      className="px-4 py-2 text-sm font-medium"
                    >
                      {userType}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Your current access level and permissions
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border"></div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
