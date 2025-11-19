
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Workflow, UsersIcon, CreditCard, Menu, X, Puzzle, Mail, Shield, ArrowRight, User, MessageSquare, Image, Calendar, FileText, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminWorkflows from "@/components/admin/AdminWorkflows";
import AdminTeams from "@/components/admin/AdminTeams";
import AdminCreditUsage from "@/components/admin/AdminCreditUsage";
import CommunityFeed from "@/components/admin/CommunityFeed";
import LiquidGlassHeader from "@/components/LiquidGlassHeader";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [outlookDialogOpen, setOutlookDialogOpen] = useState(false);
  const [manageAccessDialogOpen, setManageAccessDialogOpen] = useState(false);
  const [assistantsDialogOpen, setAssistantsDialogOpen] = useState(false);
  const [usersDialogOpen, setUsersDialogOpen] = useState(false);
  const [userGroupsDialogOpen, setUserGroupsDialogOpen] = useState(false);
  const [imagesAccessDialogOpen, setImagesAccessDialogOpen] = useState(false);
  const [imagesAssistantsDialogOpen, setImagesAssistantsDialogOpen] = useState(false);
  const [imagesUsersDialogOpen, setImagesUsersDialogOpen] = useState(false);
  const [imagesUserGroupsDialogOpen, setImagesUserGroupsDialogOpen] = useState(false);
  const [gmailActionsDialogOpen, setGmailActionsDialogOpen] = useState(false);
  
  // State for managing access selections
  const [selectedAssistants, setSelectedAssistants] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedUserGroups, setSelectedUserGroups] = useState<number[]>([]);
  
  // State for image generation limits
  const [defaultImageLimit, setDefaultImageLimit] = useState(10);
  const [assistantImageLimits, setAssistantImageLimits] = useState<{ [key: number]: number }>({});
  const [userImageLimits, setUserImageLimits] = useState<{ [key: number]: number }>({});
  const [groupImageLimits, setGroupImageLimits] = useState<{ [key: number]: number }>({});
  
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
      id: "community", 
      label: "Community Feed", 
      icon: MessageSquare,
      description: "Community Posts & Updates"
    },
    { 
      id: "integrations", 
      label: "Tenant Integrations", 
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
      case "community":
        return <CommunityFeed />;
      case "workflows":
        return <AdminWorkflows />;
      case "integrations":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Manage Access</h2>
              <p className="text-muted-foreground">
                Control which teams, users, and assistants have access to each integration and their data.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Card 
                className="p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex flex-col items-center text-center space-y-3 h-full">
                  <div 
                    className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => setOutlookDialogOpen(true)}
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm">Microsoft Outlook</h3>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="w-full text-xs hover:bg-black hover:text-white mt-auto" 
                    onClick={() => setManageAccessDialogOpen(true)}
                  >
                    Manage Access
                  </Button>
                </div>
              </Card>

              <Card 
                className="p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex flex-col items-center text-center space-y-3 h-full">
                  <div 
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => toast.success("Microsoft Calendar integration coming soon!")}
                  >
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm">Microsoft Calendar</h3>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="w-full text-xs hover:bg-black hover:text-white mt-auto" 
                    onClick={() => setManageAccessDialogOpen(true)}
                  >
                    Manage Access
                  </Button>
                </div>
              </Card>

              <Card 
                className="p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex flex-col items-center text-center space-y-3 h-full">
                  <div 
                    className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => toast.success("SharePoint integration coming soon!")}
                  >
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm">SharePoint</h3>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="w-full text-xs hover:bg-black hover:text-white mt-auto" 
                    onClick={() => setManageAccessDialogOpen(true)}
                  >
                    Manage Access
                  </Button>
                </div>
              </Card>

              <Card 
                className="p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex flex-col items-center text-center space-y-3 h-full">
                  <div 
                    className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => toast.success("Gmail integration coming soon!")}
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm">Gmail</h3>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="w-full text-xs hover:bg-black hover:text-white mt-auto" 
                    onClick={() => setManageAccessDialogOpen(true)}
                  >
                    Manage Access
                  </Button>
                </div>
              </Card>

              <Card 
                className="p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex flex-col items-center text-center space-y-3 h-full">
                  <div 
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => toast.success("Notion integration coming soon!")}
                  >
                    <span className="text-white font-bold text-base">N</span>
                  </div>
                  <h3 className="font-medium text-sm">Notion</h3>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="w-full text-xs hover:bg-black hover:text-white mt-auto" 
                    onClick={() => setManageAccessDialogOpen(true)}
                  >
                    Manage Access
                  </Button>
                </div>
              </Card>

              <Card 
                className="p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex flex-col items-center text-center space-y-3 h-full">
                  <div 
                    className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => toast.success("Images integration coming soon!")}
                  >
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm">Images</h3>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="w-full text-xs hover:bg-black hover:text-white mt-auto" 
                    onClick={() => setImagesAccessDialogOpen(true)}
                  >
                    Manage Access
                  </Button>
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
              <DialogContent className="max-w-2xl mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <DialogTitle className="text-2xl font-semibold">Manage Integration Access</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Select what you'd like to manage for integrated services
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card 
                      className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => {
                        setManageAccessDialogOpen(false);
                        setAssistantsDialogOpen(true);
                      }}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <Shield className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <h3 className="font-medium text-base group-hover:text-primary">Assistants</h3>
                        <p className="text-sm text-muted-foreground">Manage assistant access permissions</p>
                      </div>
                    </Card>

                    <Card 
                      className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => {
                        setManageAccessDialogOpen(false);
                        setUsersDialogOpen(true);
                      }}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <h3 className="font-medium text-base group-hover:text-primary">Users</h3>
                        <p className="text-sm text-muted-foreground">Manage user access permissions</p>
                      </div>
                    </Card>

                    <Card 
                      className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => {
                        setManageAccessDialogOpen(false);
                        setUserGroupsDialogOpen(true);
                      }}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <h3 className="font-medium text-base group-hover:text-primary">User Groups</h3>
                        <p className="text-sm text-muted-foreground">Manage group access permissions</p>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            {/* Assistants Access Dialog */}
            <Dialog open={assistantsDialogOpen} onOpenChange={setAssistantsDialogOpen}>
              <DialogContent className="max-w-4xl mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <DialogTitle className="text-2xl font-semibold">Manage Assistant Access</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Control which assistants have access to integrated services
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Assistants (8)
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const assistantCount = 8;
                          if (selectedAssistants.length === assistantCount) {
                            setSelectedAssistants([]);
                          } else {
                            setSelectedAssistants(Array.from({ length: assistantCount }, (_, i) => i));
                          }
                        }}
                      >
                        Select All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { name: "Customer Support Bot", status: "Connected", users: 12 },
                        { name: "Sales Assistant", status: "Connected", users: 8 },
                        { name: "HR Helper", status: "Pending", users: 0 },
                        { name: "Marketing AI", status: "Connected", users: 5 },
                        { name: "Data Analyst", status: "Connected", users: 15 },
                        { name: "Content Creator", status: "Pending", users: 0 },
                        { name: "Project Manager", status: "Connected", users: 7 },
                        { name: "Financial Advisor", status: "Connected", users: 3 }
                      ].map((assistant, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium">{assistant.name}</h4>
                              <p className="text-sm text-muted-foreground">{assistant.users} users</p>
                            </div>
                            <Checkbox
                              checked={selectedAssistants.includes(index)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedAssistants([...selectedAssistants, index]);
                                } else {
                                  setSelectedAssistants(selectedAssistants.filter(i => i !== index));
                                }
                              }}
                            />
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

            {/* Users Access Dialog */}
            <Dialog open={usersDialogOpen} onOpenChange={setUsersDialogOpen}>
              <DialogContent className="max-w-4xl mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <DialogTitle className="text-2xl font-semibold">Manage User Access</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Control which users have access to integrated services
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Users (47)
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const userCount = 9;
                          if (selectedUsers.length === userCount) {
                            setSelectedUsers([]);
                          } else {
                            setSelectedUsers(Array.from({ length: userCount }, (_, i) => i));
                          }
                        }}
                      >
                        Select All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { name: "Sarah Chen", email: "sarah@company.com", status: "Connected", integrations: 3 },
                        { name: "Mike Johnson", email: "mike@company.com", status: "Connected", integrations: 2 },
                        { name: "Emma Wilson", email: "emma@company.com", status: "Pending", integrations: 0 },
                        { name: "David Lee", email: "david@company.com", status: "Connected", integrations: 1 },
                        { name: "Lisa Brown", email: "lisa@company.com", status: "Connected", integrations: 4 },
                        { name: "Tom Davis", email: "tom@company.com", status: "Connected", integrations: 2 },
                        { name: "Anna Rodriguez", email: "anna@company.com", status: "Connected", integrations: 3 },
                        { name: "James Wilson", email: "james@company.com", status: "Pending", integrations: 0 },
                        { name: "Sophie Turner", email: "sophie@company.com", status: "Connected", integrations: 1 }
                      ].map((user, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">{user.integrations} integrations</p>
                            </div>
                            <Checkbox
                              checked={selectedUsers.includes(index)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUsers([...selectedUsers, index]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(i => i !== index));
                                }
                              }}
                            />
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

            {/* User Groups Access Dialog */}
            <Dialog open={userGroupsDialogOpen} onOpenChange={setUserGroupsDialogOpen}>
              <DialogContent className="max-w-4xl mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <DialogTitle className="text-2xl font-semibold">Manage User Group Access</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Control which user groups have access to integrated services
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        User Groups (12)
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const groupCount = 12;
                          if (selectedUserGroups.length === groupCount) {
                            setSelectedUserGroups([]);
                          } else {
                            setSelectedUserGroups(Array.from({ length: groupCount }, (_, i) => i));
                          }
                        }}
                      >
                        Select All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { name: "Sales Team", members: 15, status: "Connected", integrations: 4 },
                        { name: "Marketing Department", members: 22, status: "Connected", integrations: 3 },
                        { name: "Customer Support", members: 18, status: "Pending", integrations: 0 },
                        { name: "HR Team", members: 8, status: "Connected", integrations: 2 },
                        { name: "Engineering", members: 35, status: "Connected", integrations: 5 },
                        { name: "Finance Department", members: 12, status: "Connected", integrations: 3 },
                        { name: "Operations Team", members: 14, status: "Pending", integrations: 0 },
                        { name: "Executive Team", members: 6, status: "Connected", integrations: 4 },
                        { name: "Product Management", members: 10, status: "Connected", integrations: 3 },
                        { name: "Quality Assurance", members: 16, status: "Connected", integrations: 2 },
                        { name: "Business Development", members: 9, status: "Pending", integrations: 0 },
                        { name: "Research & Development", members: 20, status: "Connected", integrations: 4 }
                      ].map((group, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium">{group.name}</h4>
                              <p className="text-sm text-muted-foreground">{group.members} members</p>
                              <p className="text-xs text-muted-foreground">{group.integrations} integrations</p>
                            </div>
                            <Checkbox
                              checked={selectedUserGroups.includes(index)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUserGroups([...selectedUserGroups, index]);
                                } else {
                                  setSelectedUserGroups(selectedUserGroups.filter(i => i !== index));
                                }
                              }}
                            />
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

            {/* Images Access Selection Dialog */}
            <Dialog open={imagesAccessDialogOpen} onOpenChange={setImagesAccessDialogOpen}>
              <DialogContent className="max-w-2xl mx-auto rounded-2xl">
                <DialogHeader className="text-center space-y-4">
                  <DialogTitle className="text-2xl font-semibold">Manage Images Access & Limits</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Select what you'd like to manage for image generation access and limits
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card 
                      className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => {
                        setImagesAccessDialogOpen(false);
                        setImagesAssistantsDialogOpen(true);
                      }}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <Shield className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <h3 className="font-medium text-base group-hover:text-primary">Assistants</h3>
                        <p className="text-sm text-muted-foreground">Manage assistant image generation limits</p>
                      </div>
                    </Card>

                    <Card 
                      className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => {
                        setImagesAccessDialogOpen(false);
                        setImagesUserGroupsDialogOpen(true);
                      }}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <h3 className="font-medium text-base group-hover:text-primary">User Groups</h3>
                        <p className="text-sm text-muted-foreground">Manage group image generation limits</p>
                      </div>
                    </Card>

                    <Card 
                      className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => {
                        setImagesAccessDialogOpen(false);
                        setImagesUsersDialogOpen(true);
                      }}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <h3 className="font-medium text-base group-hover:text-primary">Users</h3>
                        <p className="text-sm text-muted-foreground">Manage user image generation limits</p>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            {/* Images Assistants Limits Dialog */}
            <Dialog open={imagesAssistantsDialogOpen} onOpenChange={setImagesAssistantsDialogOpen}>
              <DialogContent className="max-w-4xl mx-auto rounded-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center space-y-4">
                  <DialogTitle className="text-2xl font-semibold">Manage Assistant Image Generation Limits</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Set daily image generation limits for assistants
                  </DialogDescription>
                </DialogHeader>
                
                {/* Default Limit Setting */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <Label htmlFor="defaultLimit" className="text-sm font-semibold mb-1 block">
                    Default Daily Image Generation Limit
                  </Label>
                  <Input
                    id="defaultLimit"
                    type="number"
                    min="0"
                    value={defaultImageLimit}
                    onChange={(e) => setDefaultImageLimit(parseInt(e.target.value) || 0)}
                    className="max-w-[150px] h-9"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Assistants (8)
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const assistantCount = 8;
                        if (selectedAssistants.length === assistantCount) {
                          setSelectedAssistants([]);
                        } else {
                          setSelectedAssistants(Array.from({ length: assistantCount }, (_, i) => i));
                        }
                      }}
                    >
                      Select All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[
                      { name: "Customer Support Bot", users: 12 },
                      { name: "Sales Assistant", users: 8 },
                      { name: "HR Helper", users: 0 },
                      { name: "Marketing AI", users: 5 },
                      { name: "Data Analyst", users: 15 },
                      { name: "Content Creator", users: 0 },
                      { name: "Project Manager", users: 7 },
                      { name: "Financial Advisor", users: 3 }
                    ].map((assistant, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{assistant.name}</h4>
                            <p className="text-xs text-muted-foreground">{assistant.users} users</p>
                          </div>
                          <Checkbox
                            checked={selectedAssistants.includes(index)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAssistants([...selectedAssistants, index]);
                              } else {
                                setSelectedAssistants(selectedAssistants.filter(i => i !== index));
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`assistant-limit-${index}`} className="text-xs">
                            Limit
                          </Label>
                          <Input
                            id={`assistant-limit-${index}`}
                            type="number"
                            min="0"
                            placeholder={defaultImageLimit.toString()}
                            value={assistantImageLimits[index] || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setAssistantImageLimits({ ...assistantImageLimits, [index]: value });
                            }}
                            className="h-8 text-sm"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  <Button 
                    className="bg-black hover:bg-black/90 text-white"
                    onClick={() => {
                      toast.success("Assistant image generation limits updated successfully");
                      setImagesAssistantsDialogOpen(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Images User Groups Limits Dialog */}
            <Dialog open={imagesUserGroupsDialogOpen} onOpenChange={setImagesUserGroupsDialogOpen}>
              <DialogContent className="max-w-4xl mx-auto rounded-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center space-y-4">
                  <DialogTitle className="text-2xl font-semibold">Manage User Group Image Generation Limits</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Set daily image generation limits for user groups
                  </DialogDescription>
                </DialogHeader>
                
                {/* Default Limit Setting */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <Label htmlFor="defaultLimitGroups" className="text-sm font-semibold mb-1 block">
                    Default Daily Image Generation Limit
                  </Label>
                  <Input
                    id="defaultLimitGroups"
                    type="number"
                    min="0"
                    value={defaultImageLimit}
                    onChange={(e) => setDefaultImageLimit(parseInt(e.target.value) || 0)}
                    className="max-w-[150px] h-9"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Groups (12)
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const groupCount = 12;
                        if (selectedUserGroups.length === groupCount) {
                          setSelectedUserGroups([]);
                        } else {
                          setSelectedUserGroups(Array.from({ length: groupCount }, (_, i) => i));
                        }
                      }}
                    >
                      Select All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[
                      { name: "Sales Team", members: 15 },
                      { name: "Marketing Department", members: 22 },
                      { name: "Customer Support", members: 18 },
                      { name: "HR Team", members: 8 },
                      { name: "Engineering", members: 35 },
                      { name: "Finance Department", members: 12 },
                      { name: "Operations Team", members: 14 },
                      { name: "Executive Team", members: 6 },
                      { name: "Product Management", members: 10 },
                      { name: "Quality Assurance", members: 16 },
                      { name: "Business Development", members: 9 },
                      { name: "Research & Development", members: 20 }
                    ].map((group, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{group.name}</h4>
                            <p className="text-xs text-muted-foreground">{group.members} members</p>
                          </div>
                          <Checkbox
                            checked={selectedUserGroups.includes(index)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUserGroups([...selectedUserGroups, index]);
                              } else {
                                setSelectedUserGroups(selectedUserGroups.filter(i => i !== index));
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`group-limit-${index}`} className="text-xs">
                            Limit
                          </Label>
                          <Input
                            id={`group-limit-${index}`}
                            type="number"
                            min="0"
                            placeholder={defaultImageLimit.toString()}
                            value={groupImageLimits[index] || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setGroupImageLimits({ ...groupImageLimits, [index]: value });
                            }}
                            className="h-8 text-sm"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  <Button 
                    className="bg-black hover:bg-black/90 text-white"
                    onClick={() => {
                      toast.success("Group image generation limits updated successfully");
                      setImagesUserGroupsDialogOpen(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Images Users Limits Dialog */}
            <Dialog open={imagesUsersDialogOpen} onOpenChange={setImagesUsersDialogOpen}>
              <DialogContent className="max-w-5xl mx-auto rounded-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center space-y-4">
                  <DialogTitle className="text-2xl font-semibold">Manage User Image Generation Limits</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Set daily image generation limits for individual users
                  </DialogDescription>
                </DialogHeader>
                
                {/* Default Limit Setting */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <Label htmlFor="defaultLimitUsers" className="text-sm font-semibold mb-1 block">
                    Default Daily Image Generation Limit
                  </Label>
                  <Input
                    id="defaultLimitUsers"
                    type="number"
                    min="0"
                    value={defaultImageLimit}
                    onChange={(e) => setDefaultImageLimit(parseInt(e.target.value) || 0)}
                    className="max-w-[150px] h-9"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Users (47)
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const userCount = 9;
                        if (selectedUsers.length === userCount) {
                          setSelectedUsers([]);
                        } else {
                          setSelectedUsers(Array.from({ length: userCount }, (_, i) => i));
                        }
                      }}
                    >
                      Select All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[
                      { name: "Sarah Chen", email: "sarah@company.com" },
                      { name: "Mike Johnson", email: "mike@company.com" },
                      { name: "Emma Wilson", email: "emma@company.com" },
                      { name: "David Lee", email: "david@company.com" },
                      { name: "Lisa Brown", email: "lisa@company.com" },
                      { name: "Tom Davis", email: "tom@company.com" },
                      { name: "Anna Rodriguez", email: "anna@company.com" },
                      { name: "James Wilson", email: "james@company.com" },
                      { name: "Sophie Turner", email: "sophie@company.com" }
                    ].map((user, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{user.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <Checkbox
                            checked={selectedUsers.includes(index)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUsers([...selectedUsers, index]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(i => i !== index));
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`user-limit-${index}`} className="text-xs">
                            Limit
                          </Label>
                          <Input
                            id={`user-limit-${index}`}
                            type="number"
                            min="0"
                            placeholder={defaultImageLimit.toString()}
                            value={userImageLimits[index] || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setUserImageLimits({ ...userImageLimits, [index]: value });
                            }}
                            className="h-8 text-sm"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  <Button 
                    className="bg-black hover:bg-black/90 text-white"
                    onClick={() => {
                      toast.success("User image generation limits updated successfully");
                      setImagesUsersDialogOpen(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Gmail Actions Dialog */}
            <Dialog open={gmailActionsDialogOpen} onOpenChange={setGmailActionsDialogOpen}>
              <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Gmail</DialogTitle>
                      <DialogDescription>
                        Google's email service for sending, receiving, and managing emails
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* List labels */}
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">List labels</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Lists all labels in the user's mailbox. Agents can call this to find the right label for organizing emails.
                              </p>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">Associated Features</h4>
                                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>• Retrieve all user labels</li>
                                    <li>• Filter by label type</li>
                                    <li>• Get label metadata</li>
                                    <li>• Search labels by name</li>
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Update label */}
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">Update label</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Add/remove labels on a message or a thread. First call 'Get email' to find the message ID.
                              </p>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">Associated Features</h4>
                                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>• Add labels to emails</li>
                                    <li>• Remove labels from emails</li>
                                    <li>• Bulk label operations</li>
                                    <li>• Label thread management</li>
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Send email */}
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">Send email</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Creates and immediately sends an email from your Gmail account
                              </p>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">Associated Features</h4>
                                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>• Send to multiple recipients</li>
                                    <li>• Add CC and BCC</li>
                                    <li>• Attach files</li>
                                    <li>• HTML formatting support</li>
                                    <li>• Schedule send time</li>
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Search emails */}
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">Search emails</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Searches through your Gmail inbox and returns emails matching your query
                              </p>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">Associated Features</h4>
                                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>• Advanced search queries</li>
                                    <li>• Filter by sender/recipient</li>
                                    <li>• Date range filtering</li>
                                    <li>• Search attachments</li>
                                    <li>• Label-based search</li>
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Create email draft */}
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">Create email draft</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Creates a draft email in your Gmail account without sending it
                              </p>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">Associated Features</h4>
                                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>• Save email drafts</li>
                                    <li>• Edit draft content</li>
                                    <li>• Add attachments to drafts</li>
                                    <li>• Store multiple drafts</li>
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Reply to email */}
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">Reply to email</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Creates and immediately sends an email from your Gmail account
                              </p>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">Associated Features</h4>
                                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>• Reply to sender</li>
                                    <li>• Reply all to thread</li>
                                    <li>• Include original message</li>
                                    <li>• Forward emails</li>
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Get email with attachments */}
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">Get email with attachments</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Retrieves a single email thread or message with full content including attachments
                              </p>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">Associated Features</h4>
                                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>• Download attachments</li>
                                    <li>• View attachment metadata</li>
                                    <li>• Extract inline images</li>
                                    <li>• Get full email headers</li>
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Create draft reply */}
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">Create draft reply</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Creates a draft reply for an email.
                              </p>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">Associated Features</h4>
                                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>• Save reply drafts</li>
                                    <li>• Include original message</li>
                                    <li>• Edit before sending</li>
                                    <li>• Add attachments to reply</li>
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      case "credits":
        return <AdminCreditUsage />;
      default:
        return <AdminDashboard onNavigateToUsers={handleNavigateToUsers} />;
    }
  }, [activeTab, handleNavigateToUsers, outlookDialogOpen, manageAccessDialogOpen, assistantsDialogOpen, usersDialogOpen, userGroupsDialogOpen, imagesAccessDialogOpen, imagesAssistantsDialogOpen, imagesUsersDialogOpen, imagesUserGroupsDialogOpen, gmailActionsDialogOpen, selectedAssistants, selectedUsers, selectedUserGroups, defaultImageLimit, assistantImageLimits, userImageLimits, groupImageLimits]);

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
