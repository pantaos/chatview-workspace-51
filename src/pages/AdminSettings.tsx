
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, TrendingUp, Workflow, UsersIcon, CreditCard, Settings } from "lucide-react";
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
  const currentUser = useMemo(() => ({
    firstName: "Moin",
    lastName: "Arian",
    email: "moin@example.com",
    userType: "Admin"
  }), []);

  // Only allow admin users
  if (currentUser.userType !== "Admin" && currentUser.userType !== "Super Admin") {
    navigate("/dashboard");
    return null;
  }

  const tabs = useMemo(() => [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: TrendingUp,
      description: "Overview & Analytics"
    },
    { 
      id: "users", 
      label: "Users", 
      icon: Users,
      description: "User Management"
    },
    { 
      id: "teams", 
      label: "Teams", 
      icon: UsersIcon,
      description: "Team Organization"
    },
    { 
      id: "workflows", 
      label: "Workflows", 
      icon: Workflow,
      description: "AI Workflows & Assistants"
    },
    { 
      id: "credits", 
      label: "Credits", 
      icon: CreditCard,
      description: "Usage & Billing"
    },
    { 
      id: "system", 
      label: "System", 
      icon: Settings,
      description: "System Configuration"
    }
  ], []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleNavigateToUsers = useCallback(() => {
    setActiveTab("users");
  }, []);

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard onNavigateToUsers={handleNavigateToUsers} />;
      case "users":
        return <AdminUsers />;
      case "teams":
        return <AdminTeams />;
      case "workflows":
        return <AdminWorkflows />;
      case "credits":
        return <AdminCreditUsage />;
      case "system":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">System Configuration</h2>
              <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
            </div>
            <Card className="p-6">
              <p className="text-muted-foreground">System settings will be available in future updates.</p>
            </Card>
          </div>
        );
      default:
        return <AdminDashboard onNavigateToUsers={handleNavigateToUsers} />;
    }
  }, [activeTab, handleNavigateToUsers]);

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
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-white/80 text-lg">Manage users, teams, workflows, and system settings</p>
          </div>
        </div>
      </div>

      {/* Main content with optimized sidebar */}
      <main className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm min-h-[700px]">
            <div className="flex">
              {/* Optimized Sidebar */}
              <div className="w-72 border-r border-border p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Administration</h3>
                  <p className="text-sm text-muted-foreground">Manage your platform</p>
                </div>
                
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-black hover:text-white text-muted-foreground"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mt-0.5 ${isActive ? "text-primary-foreground" : "group-hover:text-white"}`} />
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${isActive ? "text-primary-foreground" : "group-hover:text-white"}`}>
                            {tab.label}
                          </div>
                          <div className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground group-hover:text-white/80"}`}>
                            {tab.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
                
                {/* Quick Stats in Sidebar */}
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Quick Stats</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total Users:</span>
                      <span className="font-medium">147</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Teams:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credits Used:</span>
                      <span className="font-medium">6.7k</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content area with better spacing */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-6xl">
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

export default AdminSettings;
