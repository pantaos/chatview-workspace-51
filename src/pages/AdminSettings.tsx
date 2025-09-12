
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Workflow, UsersIcon, CreditCard, Menu, X, Puzzle, Mail, Shield, ArrowRight, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminWorkflows from "@/components/admin/AdminWorkflows";
import AdminTeams from "@/components/admin/AdminTeams";
import AdminCreditUsage from "@/components/admin/AdminCreditUsage";
import LiquidGlassHeader from "@/components/LiquidGlassHeader";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [outlookDialogOpen, setOutlookDialogOpen] = useState(false);
  const [manageAccessDialogOpen, setManageAccessDialogOpen] = useState(false);
  
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
      id: "integrations", 
      label: "Integrations", 
      icon: Puzzle,
      description: "Connected Services"
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
      case "workflows":
        return <AdminWorkflows />;
      case "integrations":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Tool Integrations</h2>
              <p className="text-muted-foreground">
                Connect your favorite apps so your assistant can access their information, based on what you're authorized to view.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card 
                className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => setOutlookDialogOpen(true)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-base group-hover:text-primary">Microsoft Outlook</h3>
                </div>
              </Card>

              <Card 
                className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => toast.success("Notion integration coming soon!")}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">N</span>
                  </div>
                  <h3 className="font-medium text-base group-hover:text-primary">Notion</h3>
                </div>
              </Card>
            </div>

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

            {/* Manage Access Dialog */}
            <Dialog open={manageAccessDialogOpen} onOpenChange={setManageAccessDialogOpen}>
              <DialogContent className="max-w-4xl mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <DialogTitle className="text-2xl font-semibold">Manage Integration Access</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Control which assistants, workflows, and users have access to integrated services
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Assistants Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Assistants (8)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { name: "Customer Support Bot", status: "Connected", users: 12 },
                        { name: "Sales Assistant", status: "Connected", users: 8 },
                        { name: "HR Helper", status: "Pending", users: 0 },
                        { name: "Marketing AI", status: "Connected", users: 5 }
                      ].map((assistant, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{assistant.name}</h4>
                              <p className="text-sm text-muted-foreground">{assistant.users} users</p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assistant.status === 'Connected' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {assistant.status}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Workflows Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Workflow className="w-5 h-5" />
                      Workflows (15)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { name: "Email Campaign Automation", status: "Connected", users: 25 },
                        { name: "Lead Generation Flow", status: "Connected", users: 18 },
                        { name: "Onboarding Process", status: "Connected", users: 32 },
                        { name: "Report Generation", status: "Pending", users: 0 }
                      ].map((workflow, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{workflow.name}</h4>
                              <p className="text-sm text-muted-foreground">{workflow.users} users</p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              workflow.status === 'Connected'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {workflow.status}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Users Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Users (47)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { name: "Sarah Chen", email: "sarah@company.com", status: "Connected", integrations: 3 },
                        { name: "Mike Johnson", email: "mike@company.com", status: "Connected", integrations: 2 },
                        { name: "Emma Wilson", email: "emma@company.com", status: "Pending", integrations: 0 },
                        { name: "David Lee", email: "david@company.com", status: "Connected", integrations: 1 },
                        { name: "Lisa Brown", email: "lisa@company.com", status: "Connected", integrations: 4 },
                        { name: "Tom Davis", email: "tom@company.com", status: "Connected", integrations: 2 }
                      ].map((user, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{user.name}</h4>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === 'Connected'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {user.status}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">{user.integrations} integrations</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  <Button className="bg-black hover:bg-black/90 text-white">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Access Management Section */}
            <div className="space-y-4 mt-8">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Access Management</h3>
                <p className="text-muted-foreground text-sm">
                  Control which users and teams have access to integrated services and their data.
                </p>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Microsoft Outlook Access</h4>
                      <p className="text-sm text-muted-foreground">Manage who can connect and use Outlook integration</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="hover:bg-black hover:text-white" 
                      onClick={() => {
                        console.log("Manage Access clicked - Microsoft Outlook");
                        setManageAccessDialogOpen(true);
                      }}
                    >
                      Manage Access
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notion Access</h4>
                      <p className="text-sm text-muted-foreground">Manage who can connect and use Notion integration</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="hover:bg-black hover:text-white" 
                      onClick={() => {
                        console.log("Manage Access clicked - Notion");
                        setManageAccessDialogOpen(true);
                      }}
                    >
                      Manage Access
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      case "credits":
        return <AdminCreditUsage />;
      default:
        return <AdminDashboard onNavigateToUsers={handleNavigateToUsers} />;
    }
  }, [activeTab, handleNavigateToUsers]);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 ${theme.isDarkMode ? 'dark' : ''}`}>
      <LiquidGlassHeader
        title="Admin Panel"
        subtitle="Manage users, teams, workflows, and system settings"
        currentUser={currentUser}
        showBackButton={!isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showSidebarToggle={true}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 pb-8 -mt-8 relative z-10">
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
                      <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Administration</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Manage your platform</p>
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
                  
                  {/* Quick Stats */}
                  {!isMobile && (
                    <div className="mt-8 p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
                      <h4 className="text-sm font-medium mb-3 text-slate-900 dark:text-slate-100">Quick Stats</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Total Users:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">147</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Active Teams:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">12</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Credits Used:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">6.7k</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main content area */}
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
