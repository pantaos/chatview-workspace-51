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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import MainLayout from "@/components/MainLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminWorkflows from "@/components/admin/AdminWorkflows";
import AdminTeams from "@/components/admin/AdminTeams";
import AdminCreditUsage from "@/components/admin/AdminCreditUsage";
import CommunityFeed from "@/components/admin/CommunityFeed";

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
  const [grantOrgAccess, setGrantOrgAccess] = useState(false);
  
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
              <DialogContent className="max-w-sm mx-auto rounded-xl border-border/60 shadow-xl shadow-black/5 p-0 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground/90">Connect Microsoft Outlook</h3>
                      <p className="text-[11px] text-muted-foreground/70">Developed by Panta Flows</p>
                    </div>
                  </div>
                  <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
                    <X className="h-3.5 w-3.5" />
                  </DialogClose>
                </div>
                
                <div className="px-5 py-4 space-y-2.5">
                  <p className="text-[12px] text-muted-foreground/80 leading-relaxed">
                    This page will redirect to Microsoft for sign-in and permissions.
                  </p>
                  <p className="text-[12px] text-muted-foreground/80 leading-relaxed">
                    Your data is private and only used to answer your prompts — never to train models.
                  </p>
                  <p className="text-[12px] text-muted-foreground/80 leading-relaxed">
                    You're in control: deleting a conversation also deletes any linked data.
                  </p>
                </div>

                <div className="flex justify-end gap-2 px-5 py-3 border-t border-border/40">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="text-xs h-8">Cancel</Button>
                  </DialogClose>
                  <Button 
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => {
                      setOutlookDialogOpen(false);
                      toast.success("Redirecting to Microsoft Outlook...");
                    }}
                  >
                    Continue to Outlook
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Manage Access Dialog */}
            <Dialog open={manageAccessDialogOpen} onOpenChange={setManageAccessDialogOpen}>
              <DialogContent className="max-w-sm mx-auto rounded-xl border-border/60 shadow-xl shadow-black/5 p-0 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/90">Manage Integration Access</h3>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">Select what to manage</p>
                  </div>
                  <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
                    <X className="h-3.5 w-3.5" />
                  </DialogClose>
                </div>

                <div className="flex items-center gap-2 px-5 py-2.5 border-b border-border/40 bg-muted/30">
                  <Checkbox
                    id="org-access"
                    checked={grantOrgAccess}
                    onCheckedChange={(checked) => setGrantOrgAccess(checked === true)}
                    className="h-3.5 w-3.5"
                  />
                  <Label htmlFor="org-access" className="text-[11px] text-muted-foreground/70 cursor-pointer">
                    Grant entire organization access
                  </Label>
                </div>
                
                <div className="p-3 space-y-1">
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-all text-left group"
                    onClick={() => {
                      setManageAccessDialogOpen(false);
                      setUsersDialogOpen(true);
                    }}
                  >
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-medium text-foreground/90 group-hover:text-foreground">Users</h4>
                      <p className="text-[11px] text-muted-foreground/70">Manage user access</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground/60" />
                  </button>

                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-all text-left group"
                    onClick={() => {
                      setManageAccessDialogOpen(false);
                      setUserGroupsDialogOpen(true);
                    }}
                  >
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-medium text-foreground/90 group-hover:text-foreground">User Groups</h4>
                      <p className="text-[11px] text-muted-foreground/70">Manage group access</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground/60" />
                  </button>
                </div>

                <div className="flex justify-end px-5 py-3 border-t border-border/40">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="text-xs h-8">Close</Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            {/* Assistants Access Dialog */}
            <Dialog open={assistantsDialogOpen} onOpenChange={setAssistantsDialogOpen}>
              <DialogContent className="max-w-md mx-auto rounded-xl border-border/60 shadow-xl shadow-black/5 p-0 overflow-hidden max-h-[85vh]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/90">Manage Assistant Access</h3>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">8 assistants available</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[11px] h-7 px-2"
                      onClick={() => {
                        const assistantCount = 8;
                        if (selectedAssistants.length === assistantCount) {
                          setSelectedAssistants([]);
                        } else {
                          setSelectedAssistants(Array.from({ length: assistantCount }, (_, i) => i));
                        }
                      }}
                    >
                      {selectedAssistants.length === 8 ? "Deselect All" : "Select All"}
                    </Button>
                    <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
                      <X className="h-3.5 w-3.5" />
                    </DialogClose>
                  </div>
                </div>
                
                <div className="p-3 space-y-1 overflow-y-auto max-h-[50vh]">
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
                    <button 
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted/50 transition-all text-left"
                      onClick={() => {
                        if (selectedAssistants.includes(index)) {
                          setSelectedAssistants(selectedAssistants.filter(i => i !== index));
                        } else {
                          setSelectedAssistants([...selectedAssistants, index]);
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedAssistants.includes(index)}
                        className="h-3.5 w-3.5"
                      />
                      <div className="flex-1">
                        <h4 className="text-[13px] font-medium text-foreground/90">{assistant.name}</h4>
                        <p className="text-[11px] text-muted-foreground/70">{assistant.users} users</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-2 px-5 py-3 border-t border-border/40">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="text-xs h-8">Close</Button>
                  </DialogClose>
                  <Button size="sm" className="text-xs h-8">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Users Access Dialog */}
            <Dialog open={usersDialogOpen} onOpenChange={setUsersDialogOpen}>
              <DialogContent className="max-w-md mx-auto rounded-xl border-border/60 shadow-xl shadow-black/5 p-0 overflow-hidden max-h-[85vh]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/90">Manage User Access</h3>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">47 users available</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[11px] h-7 px-2"
                      onClick={() => {
                        const userCount = 9;
                        if (selectedUsers.length === userCount) {
                          setSelectedUsers([]);
                        } else {
                          setSelectedUsers(Array.from({ length: userCount }, (_, i) => i));
                        }
                      }}
                    >
                      {selectedUsers.length === 9 ? "Deselect All" : "Select All"}
                    </Button>
                    <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
                      <X className="h-3.5 w-3.5" />
                    </DialogClose>
                  </div>
                </div>
                
                <div className="p-3 space-y-1 overflow-y-auto max-h-[50vh]">
                  {[
                    { name: "Sarah Chen", email: "sarah@company.com", integrations: 3 },
                    { name: "Mike Johnson", email: "mike@company.com", integrations: 2 },
                    { name: "Emma Wilson", email: "emma@company.com", integrations: 0 },
                    { name: "David Lee", email: "david@company.com", integrations: 1 },
                    { name: "Lisa Brown", email: "lisa@company.com", integrations: 4 },
                    { name: "Tom Davis", email: "tom@company.com", integrations: 2 },
                    { name: "Anna Rodriguez", email: "anna@company.com", integrations: 3 },
                    { name: "James Wilson", email: "james@company.com", integrations: 0 },
                    { name: "Sophie Turner", email: "sophie@company.com", integrations: 1 }
                  ].map((user, index) => (
                    <button 
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted/50 transition-all text-left"
                      onClick={() => {
                        if (selectedUsers.includes(index)) {
                          setSelectedUsers(selectedUsers.filter(i => i !== index));
                        } else {
                          setSelectedUsers([...selectedUsers, index]);
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedUsers.includes(index)}
                        className="h-3.5 w-3.5"
                      />
                      <div className="flex-1">
                        <h4 className="text-[13px] font-medium text-foreground/90">{user.name}</h4>
                        <p className="text-[11px] text-muted-foreground/70">{user.email}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60">{user.integrations} int.</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-2 px-5 py-3 border-t border-border/40">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="text-xs h-8">Close</Button>
                  </DialogClose>
                  <Button size="sm" className="text-xs h-8">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* User Groups Access Dialog */}
            <Dialog open={userGroupsDialogOpen} onOpenChange={setUserGroupsDialogOpen}>
              <DialogContent className="max-w-md mx-auto rounded-xl border-border/60 shadow-xl shadow-black/5 p-0 overflow-hidden max-h-[85vh]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/90">Manage User Group Access</h3>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">12 groups available</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[11px] h-7 px-2"
                      onClick={() => {
                        const groupCount = 12;
                        if (selectedUserGroups.length === groupCount) {
                          setSelectedUserGroups([]);
                        } else {
                          setSelectedUserGroups(Array.from({ length: groupCount }, (_, i) => i));
                        }
                      }}
                    >
                      {selectedUserGroups.length === 12 ? "Deselect All" : "Select All"}
                    </Button>
                    <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
                      <X className="h-3.5 w-3.5" />
                    </DialogClose>
                  </div>
                </div>
                
                <div className="p-3 space-y-1 overflow-y-auto max-h-[50vh]">
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
                    <button 
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted/50 transition-all text-left"
                      onClick={() => {
                        if (selectedUserGroups.includes(index)) {
                          setSelectedUserGroups(selectedUserGroups.filter(i => i !== index));
                        } else {
                          setSelectedUserGroups([...selectedUserGroups, index]);
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedUserGroups.includes(index)}
                        className="h-3.5 w-3.5"
                      />
                      <div className="flex-1">
                        <h4 className="text-[13px] font-medium text-foreground/90">{group.name}</h4>
                        <p className="text-[11px] text-muted-foreground/70">{group.members} members</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-2 px-5 py-3 border-t border-border/40">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="text-xs h-8">Close</Button>
                  </DialogClose>
                  <Button size="sm" className="text-xs h-8">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Images Access Selection Dialog */}
            <Dialog open={imagesAccessDialogOpen} onOpenChange={setImagesAccessDialogOpen}>
              <DialogContent className="max-w-sm mx-auto rounded-xl border-border/60 shadow-xl shadow-black/5 p-0 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/90">Manage Images Access</h3>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">Configure generation limits</p>
                  </div>
                  <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
                    <X className="h-3.5 w-3.5" />
                  </DialogClose>
                </div>

                <div className="flex items-center gap-2 px-5 py-2.5 border-b border-border/40 bg-muted/30">
                  <Checkbox
                    id="org-access-images"
                    checked={grantOrgAccess}
                    onCheckedChange={(checked) => setGrantOrgAccess(checked === true)}
                    className="h-3.5 w-3.5"
                  />
                  <Label htmlFor="org-access-images" className="text-[11px] text-muted-foreground/70 cursor-pointer">
                    Grant entire organization access
                  </Label>
                </div>
                
                <div className="p-3 space-y-1">
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-all text-left group"
                    onClick={() => {
                      setImagesAccessDialogOpen(false);
                      setImagesUserGroupsDialogOpen(true);
                    }}
                  >
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-medium text-foreground/90 group-hover:text-foreground">User Groups</h4>
                      <p className="text-[11px] text-muted-foreground/70">Group image limits</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground/60" />
                  </button>

                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-all text-left group"
                    onClick={() => {
                      setImagesAccessDialogOpen(false);
                      setImagesUsersDialogOpen(true);
                    }}
                  >
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-medium text-foreground/90 group-hover:text-foreground">Users</h4>
                      <p className="text-[11px] text-muted-foreground/70">User image limits</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground/60" />
                  </button>
                </div>

                <div className="flex justify-end px-5 py-3 border-t border-border/40">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="text-xs h-8">Close</Button>
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
                <div className="mb-4">
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
                <div className="mb-4">
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
                <div className="mb-4">
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
                      <DialogTitle className="text-2xl">AI Workflow Controls</DialogTitle>
                      <DialogDescription>
                        Choose which tasks the AI can handle on its own and which ones you want to review first.
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
    <MainLayout>
      <div className="p-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage users, teams, workflows, and system settings</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto mb-8">
            <TabsTrigger value="dashboard" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">Analytics</TabsTrigger>
            <TabsTrigger value="users" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">Users</TabsTrigger>
            <TabsTrigger value="teams" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">Teams</TabsTrigger>
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminSettings;
