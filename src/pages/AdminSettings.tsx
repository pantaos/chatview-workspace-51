import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, UsersIcon, Puzzle, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import MainLayout from "@/components/MainLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminTeams from "@/components/admin/AdminTeams";
import CommunityFeed from "@/components/admin/CommunityFeed";
import AdminIntegrations from "@/components/admin/AdminIntegrations";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const currentUser = useMemo(() => ({
    firstName: "Moin",
    lastName: "Arian",
    email: "moin@example.com",
    userType: "Admin"
  }), []);

  if (currentUser.userType !== "Admin" && currentUser.userType !== "Super Admin") {
    navigate("/dashboard");
    return null;
  }

  const tabs = useMemo(() => [
    { 
      id: "dashboard", 
      label: "Analytics", 
      shortLabel: "Analytics",
      icon: TrendingUp,
      description: "Overview & Analytics"
    },
    { 
      id: "users", 
      label: "Users", 
      shortLabel: "Users",
      icon: Users,
      description: "User Management"
    },
    { 
      id: "teams", 
      label: "Teams", 
      shortLabel: "Teams",
      icon: UsersIcon,
      description: "Team Organization"
    },
    { 
      id: "community",
      label: "Community Feed", 
      shortLabel: "Community",
      icon: MessageSquare,
      description: "Community Posts & Updates"
    },
    { 
      id: "integrations", 
      label: "Integrations", 
      shortLabel: "Integr.",
      icon: Puzzle,
      description: "Connected Services"
    }
  ], []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const handleNavigateToUsers = useCallback(() => {
    setActiveTab("users");
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard onNavigateToUsers={handleNavigateToUsers} />;
      case "users":
        return <AdminUsers />;
      case "teams":
        return <AdminTeams />;
      case "community":
        return <CommunityFeed />;
      case "integrations":
        return <AdminIntegrations />;
      default:
        return <AdminDashboard onNavigateToUsers={handleNavigateToUsers} />;
    }
  }, [activeTab, handleNavigateToUsers]);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage users, teams, workflows, and system settings</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex overflow-x-auto scrollbar-hide bg-transparent border-b border-border rounded-none p-0 h-auto mb-6 md:mb-8 w-full">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 md:px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary whitespace-nowrap min-h-[44px]"
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <AdminDashboard onNavigateToUsers={handleNavigateToUsers} />
          </TabsContent>
          <TabsContent value="users" className="mt-0">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="teams" className="mt-0">
            <AdminTeams />
          </TabsContent>
          <TabsContent value="community" className="mt-0">
            <CommunityFeed />
          </TabsContent>
          <TabsContent value="integrations" className="mt-0">
            <AdminIntegrations />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminSettings;
