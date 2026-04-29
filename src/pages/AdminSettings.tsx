import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, UsersIcon, Puzzle, MessageSquare, Shield, Gauge } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import MainLayout from "@/components/MainLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminTeams from "@/components/admin/AdminTeams";
import AdminApprovals from "@/components/admin/AdminApprovals";
import CommunityFeed from "@/components/admin/CommunityFeed";
import AdminIntegrations from "@/components/admin/AdminIntegrations";
import AdminSkills from "@/components/admin/AdminSkills";
import AdminTokenLimits from "@/components/admin/AdminTokenLimits";

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
      id: "approvals",
      label: "Approvals & Handovers", 
      shortLabel: "Approvals",
      icon: Shield,
      description: "Approval & Handover Gates"
    },
    { 
      id: "community",
      label: "Community Feed", 
      shortLabel: "Community",
      icon: MessageSquare,
      description: "Community Posts & Updates"
    },
    { 
      id: "skills",
      label: "Skills", 
      shortLabel: "Skills",
      icon: Puzzle,
      description: "Skill Management"
    },
    { 
      id: "integrations", 
      label: "Integrations", 
      shortLabel: "Integr.",
      icon: Puzzle,
      description: "Connected Services"
    },
    {
      id: "token-limits",
      label: "Token Limits",
      shortLabel: "Tokens",
      icon: Gauge,
      description: "Token Usage & Limits"
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Sticky Header */}
        <div className="sticky top-0 md:top-0 top-14 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
          <div className="max-w-6xl px-4 md:px-8 pt-4 md:pt-6 pb-0">
            <div className="mb-3">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground leading-tight">Admin Panel</h1>
              <p className="text-muted-foreground mt-0.5 text-xs md:text-sm">Manage users, teams, workflows, and system settings</p>
            </div>
            <TabsList className="flex overflow-x-auto scrollbar-hide bg-transparent border-b-0 rounded-none p-0 h-auto w-full -mb-px">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 md:px-4 pb-2.5 pt-1 text-sm text-muted-foreground data-[state=active]:text-primary whitespace-nowrap min-h-[40px]"
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-6xl">
          <TabsContent value="dashboard" className="mt-0">
            <AdminDashboard onNavigateToUsers={handleNavigateToUsers} />
          </TabsContent>
          <TabsContent value="users" className="mt-0">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="teams" className="mt-0">
            <AdminTeams />
          </TabsContent>
          <TabsContent value="approvals" className="mt-0">
            <AdminApprovals />
          </TabsContent>
          <TabsContent value="community" className="mt-0">
            <CommunityFeed />
          </TabsContent>
          <TabsContent value="skills" className="mt-0">
            <AdminSkills />
          </TabsContent>
          <TabsContent value="integrations" className="mt-0">
            <AdminIntegrations />
          </TabsContent>
          <TabsContent value="token-limits" className="mt-0">
            <AdminTokenLimits />
          </TabsContent>
        </div>
      </Tabs>
    </MainLayout>
  );
};

export default AdminSettings;
