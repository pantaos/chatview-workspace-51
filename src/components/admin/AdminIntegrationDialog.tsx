import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, Building2, Users, Bot, User, Check } from "lucide-react";
import { toast } from "sonner";
import { Integration, IntegrationApp } from "./AdminIntegrations";

interface AdminIntegrationDialogProps {
  integration: Integration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIntegrationUpdate: (integration: Integration) => void;
}

type ScreenType = 
  | "general" 
  | string  // app IDs like "outlook", "calendar", etc.
  | `${string}-teams` 
  | `${string}-assistants` 
  | `${string}-users`;

// Mock data
const mockTeams = [
  { id: "1", name: "Engineering", memberCount: 35 },
  { id: "2", name: "Marketing", memberCount: 22 },
  { id: "3", name: "Sales Team", memberCount: 15 },
  { id: "4", name: "HR Team", memberCount: 8 },
  { id: "5", name: "Customer Support", memberCount: 18 },
  { id: "6", name: "Finance", memberCount: 12 }
];

const mockAssistants = [
  { id: "1", name: "Customer Support Bot", users: 12 },
  { id: "2", name: "Sales Assistant", users: 8 },
  { id: "3", name: "Marketing AI", users: 5 },
  { id: "4", name: "HR Helper", users: 3 },
  { id: "5", name: "Data Analyst", users: 15 }
];

const mockUsers = [
  { id: "1", name: "Sarah Chen", email: "sarah@company.com" },
  { id: "2", name: "Mike Johnson", email: "mike@company.com" },
  { id: "3", name: "Emma Wilson", email: "emma@company.com" },
  { id: "4", name: "David Lee", email: "david@company.com" },
  { id: "5", name: "Lisa Brown", email: "lisa@company.com" },
  { id: "6", name: "Tom Davis", email: "tom@company.com" }
];

export const AdminIntegrationDialog = ({ 
  integration, 
  open, 
  onOpenChange,
  onIntegrationUpdate 
}: AdminIntegrationDialogProps) => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: "General" },
    ...integration.apps.map(app => ({ id: app.id, label: app.name }))
  ];

  const isSubScreen = activeScreen.includes("-teams") || 
                      activeScreen.includes("-assistants") || 
                      activeScreen.includes("-users");

  const handleBack = () => {
    if (currentAppId) {
      setActiveScreen(currentAppId);
      setCurrentAppId(null);
      setSearchTerm("");
      setTempSelectedIds([]);
    }
  };

  const getScreenTitle = () => {
    if (activeScreen.includes("-teams")) return "Select Teams";
    if (activeScreen.includes("-assistants")) return "Select Assistants";
    if (activeScreen.includes("-users")) return "Select Users";
    return "";
  };

  const handleAppToggle = (appId: string, enabled: boolean) => {
    const updatedApps = integration.apps.map(app => 
      app.id === appId 
        ? { ...app, enabled, accessScope: enabled ? app.accessScope || "organization" : null } as IntegrationApp
        : app
    );
    onIntegrationUpdate({ ...integration, apps: updatedApps });
  };

  const handleScopeChange = (appId: string, scope: "organization" | "teams" | "assistants" | "users") => {
    const updatedApps = integration.apps.map(app => 
      app.id === appId ? { ...app, accessScope: scope } : app
    );
    onIntegrationUpdate({ ...integration, apps: updatedApps });
  };

  const handleSelectClick = (appId: string, type: "teams" | "assistants" | "users") => {
    const app = integration.apps.find(a => a.id === appId);
    if (app) {
      setCurrentAppId(appId);
      if (type === "teams") {
        setTempSelectedIds([...app.selectedTeams]);
      } else if (type === "assistants") {
        setTempSelectedIds([...app.selectedAssistants]);
      } else {
        setTempSelectedIds([...app.selectedUsers]);
      }
      setActiveScreen(`${appId}-${type}`);
    }
  };

  const handleSaveSelection = () => {
    if (!currentAppId) return;
    
    const type = activeScreen.split("-")[1] as "teams" | "assistants" | "users";
    const updatedApps = integration.apps.map(app => {
      if (app.id === currentAppId) {
        if (type === "teams") {
          return { ...app, selectedTeams: tempSelectedIds };
        } else if (type === "assistants") {
          return { ...app, selectedAssistants: tempSelectedIds };
        } else {
          return { ...app, selectedUsers: tempSelectedIds };
        }
      }
      return app;
    });
    
    onIntegrationUpdate({ ...integration, apps: updatedApps });
    toast.success(`${tempSelectedIds.length} ${type} selected`);
    handleBack();
  };

  const toggleSelection = (id: string) => {
    if (tempSelectedIds.includes(id)) {
      setTempSelectedIds(tempSelectedIds.filter(i => i !== id));
    } else {
      setTempSelectedIds([...tempSelectedIds, id]);
    }
  };

  const getFilteredItems = () => {
    const type = activeScreen.split("-")[1];
    if (type === "teams") {
      return mockTeams.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (type === "assistants") {
      return mockAssistants.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return mockUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  const getScopeCount = (app: IntegrationApp, scope: string) => {
    if (scope === "teams") return app.selectedTeams.length;
    if (scope === "assistants") return app.selectedAssistants.length;
    if (scope === "users") return app.selectedUsers.length;
    return 0;
  };

  const renderContent = () => {
    // Selection sub-screens
    if (isSubScreen) {
      const items = getFilteredItems();
      const type = activeScreen.split("-")[1];

      return (
        <div className="space-y-4 h-full flex flex-col">
          <Input
            placeholder={`Search ${type}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <p className="text-sm text-muted-foreground">{items.length} {type} available</p>

          <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
                onClick={() => toggleSelection(item.id)}
              >
                <Checkbox checked={tempSelectedIds.includes(item.id)} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.email || `${item.memberCount || item.users} ${item.memberCount ? 'members' : 'users'}`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <p className="text-sm text-muted-foreground">{tempSelectedIds.length} selected</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleBack}>Cancel</Button>
              <Button size="sm" onClick={handleSaveSelection}>
                Save
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // General screen
    if (activeScreen === "general") {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-1">General</h2>
            <p className="text-sm text-muted-foreground">Integration overview and status</p>
          </div>
          
          <div className="h-px bg-border/50" />

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${integration.iconBg} rounded-xl flex items-center justify-center`}>
              {integration.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{integration.name}</h3>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Status</span>
              <Badge variant={integration.connected ? "default" : "secondary"}>
                {integration.connected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Apps Enabled</span>
              <span className="text-sm text-muted-foreground">
                {integration.apps.filter(a => a.enabled).length} of {integration.apps.length}
              </span>
            </div>
          </div>

          <div className="h-px bg-border/50" />

          <div>
            <h4 className="text-sm font-medium mb-2">Use Cases</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                Draft and send emails automatically
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                Schedule meetings based on availability
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                Search and organize documents
              </li>
            </ul>
          </div>

          {integration.connected && (
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => toast.info("Disconnect functionality coming soon")}
            >
              Disconnect {integration.name}
            </Button>
          )}
        </div>
      );
    }

    // App screens
    const app = integration.apps.find(a => a.id === activeScreen);
    if (app) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-1">{app.name}</h2>
            <p className="text-sm text-muted-foreground">{app.description}</p>
          </div>
          
          <div className="h-px bg-border/50" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable {app.name}</p>
              <p className="text-xs text-muted-foreground">Allow organization to use this app</p>
            </div>
            <Switch 
              checked={app.enabled} 
              onCheckedChange={(checked) => handleAppToggle(app.id, checked)}
            />
          </div>

          {app.enabled && (
            <>
              <div className="h-px bg-border/50" />

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Access Scope</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Define who can use this integration
                  </p>
                </div>

                <RadioGroup 
                  value={app.accessScope || "organization"} 
                  onValueChange={(value) => handleScopeChange(app.id, value as any)}
                  className="space-y-3"
                >
                  {/* Organization */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="organization" id={`${app.id}-org`} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={`${app.id}-org`} className="flex items-center gap-2 cursor-pointer">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Entire Organization</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Everyone in your organization can use this integration
                      </p>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="teams" id={`${app.id}-teams`} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`${app.id}-teams`} className="flex items-center gap-2 cursor-pointer">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Specific Teams</span>
                        </Label>
                        {app.accessScope === "teams" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => handleSelectClick(app.id, "teams")}
                          >
                            {getScopeCount(app, "teams")} selected
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Only selected teams can access this integration
                      </p>
                    </div>
                  </div>

                  {/* Assistants */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="assistants" id={`${app.id}-assistants`} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`${app.id}-assistants`} className="flex items-center gap-2 cursor-pointer">
                          <Bot className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Specific Assistants</span>
                        </Label>
                        {app.accessScope === "assistants" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => handleSelectClick(app.id, "assistants")}
                          >
                            {getScopeCount(app, "assistants")} selected
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Only selected AI assistants can use this integration
                      </p>
                    </div>
                  </div>

                  {/* Users */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="users" id={`${app.id}-users`} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`${app.id}-users`} className="flex items-center gap-2 cursor-pointer">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Specific Users</span>
                        </Label>
                        {app.accessScope === "users" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => handleSelectClick(app.id, "users")}
                          >
                            {getScopeCount(app, "users")} selected
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Only selected users can access this integration
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden h-[550px]">
        <div className="flex h-full">
          {/* Sidebar - hidden on sub-screens */}
          {!isSubScreen && (
            <div className="w-48 border-r border-border/40 flex flex-col shrink-0 bg-muted/20">
              <div className="p-3 border-b border-border/40">
                <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
                  <X className="h-4 w-4" />
                </DialogClose>
              </div>
              <nav className="flex-1 p-2 space-y-0.5">
                {tabs.map((tab) => {
                  const app = integration.apps.find(a => a.id === tab.id);
                  const isActive = activeScreen === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveScreen(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span>{tab.label}</span>
                      {app?.enabled && (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {isSubScreen && (
              <div className="flex items-center gap-3 p-4 border-b border-border/40 shrink-0">
                <button 
                  onClick={handleBack}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-base font-medium">{getScreenTitle()}</h2>
              </div>
            )}
            <div className="flex-1 p-6 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
