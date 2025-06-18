
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Database, Settings, TrendingUp, UserPlus, Workflow, UsersIcon, CreditCard } from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";
import Logo from "@/components/Logo";
import { useTheme } from "@/contexts/ThemeContext";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminWorkflows from "@/components/admin/AdminWorkflows";
import AdminTeams from "@/components/admin/AdminTeams";
import AdminCreditUsage from "@/components/admin/AdminCreditUsage";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Mock user data - in real app this would come from auth context
  const currentUser = {
    firstName: "Moin",
    lastName: "Arian",
    email: "moin@example.com",
    userType: "Admin"
  };

  // Only allow admin users
  if (currentUser.userType !== "Admin" && currentUser.userType !== "Super Admin") {
    navigate("/dashboard");
    return null;
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
    { id: "teams", label: "Teams", icon: UsersIcon },
    { id: "workflows", label: "Workflows & Assistants", icon: Workflow },
    { id: "credits", label: "Credit Usage", icon: CreditCard }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard onNavigateToUsers={() => setActiveTab("users")} />;
      case "users":
        return <AdminUsers />;
      case "teams":
        return <AdminTeams />;
      case "workflows":
        return <AdminWorkflows />;
      case "credits":
        return <AdminCreditUsage />;
      default:
        return <AdminDashboard onNavigateToUsers={() => setActiveTab("users")} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.isDarkMode ? 'dark' : ''}`}>
      {/* Header with liquid glass style */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-900 dark:via-purple-900 dark:to-blue-950">
        <header className="liquid-glass-header">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-black hover:text-white text-white"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Logo variant="white" />
            </div>
            <ProfileDropdown 
              name={`${currentUser.firstName} ${currentUser.lastName}`} 
              email={currentUser.email} 
            />
          </div>
        </header>
        
        {/* Page title section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Admin Settings</h1>
            <p className="text-white/80 text-lg">Manage users, teams, workflows, and system settings</p>
          </div>
        </div>
      </div>

      {/* Main content with sidebar */}
      <main className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm min-h-[600px]">
            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 border-r border-border p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-black hover:text-white text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Main content area */}
              <div className="flex-1 p-6">
                {renderContent()}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
