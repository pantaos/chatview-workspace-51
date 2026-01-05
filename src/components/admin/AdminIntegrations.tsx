import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Image, Plus, ChevronRight } from "lucide-react";
import { AdminIntegrationDialog } from "./AdminIntegrationDialog";
import { AddIntegrationDialog } from "./AddIntegrationDialog";

export interface IntegrationApp {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  accessScope: "organization" | "teams" | "assistants" | "users" | null;
  selectedTeams: string[];
  selectedAssistants: string[];
  selectedUsers: string[];
  limits?: {
    enabled: boolean;
    perUserPerDay: number;
    perTeamPerDay: number;
  };
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  connected: boolean;
  apps: IntegrationApp[];
}

const allIntegrations: Integration[] = [
  {
    id: "microsoft",
    name: "Microsoft 365",
    description: "Email, Calendar, SharePoint",
    icon: <Mail className="w-5 h-5 text-white" />,
    iconBg: "bg-blue-500",
    connected: true,
    apps: [
      { 
        id: "outlook", 
        name: "Outlook", 
        description: "Email management",
        enabled: true, 
        accessScope: "organization",
        selectedTeams: [],
        selectedAssistants: [],
        selectedUsers: []
      },
      { 
        id: "calendar", 
        name: "Calendar", 
        description: "Meeting scheduling",
        enabled: true, 
        accessScope: "teams",
        selectedTeams: ["1", "2"],
        selectedAssistants: [],
        selectedUsers: []
      },
      { 
        id: "sharepoint", 
        name: "SharePoint", 
        description: "Document management",
        enabled: false, 
        accessScope: null,
        selectedTeams: [],
        selectedAssistants: [],
        selectedUsers: []
      }
    ]
  },
  {
    id: "google",
    name: "Google Workspace",
    description: "Gmail, Drive, Calendar",
    icon: <Mail className="w-5 h-5 text-white" />,
    iconBg: "bg-red-500",
    connected: true,
    apps: [
      { 
        id: "gmail", 
        name: "Gmail", 
        description: "Email management",
        enabled: true, 
        accessScope: "users",
        selectedTeams: [],
        selectedAssistants: [],
        selectedUsers: ["1", "2", "3"]
      }
    ]
  },
  {
    id: "notion",
    name: "Notion",
    description: "Notes and documentation",
    icon: <span className="text-white font-bold text-base">N</span>,
    iconBg: "bg-slate-800",
    connected: false,
    apps: [
      { 
        id: "notion", 
        name: "Notion", 
        description: "Workspace access",
        enabled: false, 
        accessScope: null,
        selectedTeams: [],
        selectedAssistants: [],
        selectedUsers: []
      }
    ]
  },
  {
    id: "images",
    name: "Image Generation",
    description: "AI-powered image creation",
    icon: <Image className="w-5 h-5 text-white" />,
    iconBg: "bg-purple-500",
    connected: true,
    apps: [
      { 
        id: "dalle", 
        name: "DALL-E", 
        description: "OpenAI image generation",
        enabled: true, 
        accessScope: "organization",
        selectedTeams: [],
        selectedAssistants: [],
        selectedUsers: [],
        limits: {
          enabled: true,
          perUserPerDay: 50,
          perTeamPerDay: 200
        }
      },
      { 
        id: "midjourney", 
        name: "Midjourney", 
        description: "Artistic image generation",
        enabled: false, 
        accessScope: null,
        selectedTeams: [],
        selectedAssistants: [],
        selectedUsers: [],
        limits: {
          enabled: false,
          perUserPerDay: 20,
          perTeamPerDay: 100
        }
      }
    ]
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication",
    icon: <span className="text-white font-bold text-base">S</span>,
    iconBg: "bg-emerald-600",
    connected: false,
    apps: [
      { 
        id: "slack", 
        name: "Slack", 
        description: "Messaging integration",
        enabled: false, 
        accessScope: null,
        selectedTeams: [],
        selectedAssistants: [],
        selectedUsers: []
      }
    ]
  }
];

const AdminIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(allIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const connectedIntegrations = integrations.filter(i => i.connected);
  const availableIntegrations = integrations.filter(i => !i.connected);

  const handleManageClick = (integration: Integration) => {
    setSelectedIntegration(integration);
    setDialogOpen(true);
  };

  const handleIntegrationUpdate = (updatedIntegration: Integration) => {
    setIntegrations(prev => 
      prev.map(i => i.id === updatedIntegration.id ? updatedIntegration : i)
    );
    setSelectedIntegration(updatedIntegration);
  };

  const handleAddIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(i => 
        i.id === integrationId 
          ? { ...i, connected: true }
          : i
      )
    );
  };

  const getEnabledAppsCount = (integration: Integration) => {
    return integration.apps.filter(app => app.enabled).length;
  };

  const getAccessScopeSummary = (integration: Integration) => {
    const enabledApps = integration.apps.filter(app => app.enabled);
    if (enabledApps.length === 0) return null;
    
    const scopes = enabledApps.map(app => app.accessScope).filter(Boolean);
    const uniqueScopes = [...new Set(scopes)];
    
    if (uniqueScopes.length === 1 && uniqueScopes[0] === "organization") {
      return "Org-wide";
    }
    return "Custom access";
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Tenant Integrations</h2>
        <p className="text-muted-foreground">
          Configure organization-wide integrations and access permissions for teams, users, and assistants.
        </p>
      </div>

      <div className="space-y-2">
        {connectedIntegrations.map((integration) => {
          const enabledCount = getEnabledAppsCount(integration);
          const scopeSummary = getAccessScopeSummary(integration);
          
          return (
            <div 
              key={integration.id}
              className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/50 transition-all group cursor-pointer"
              onClick={() => handleManageClick(integration)}
            >
              <div className="flex items-center gap-4">
                <div 
                  className={`w-10 h-10 ${integration.iconBg} rounded-lg flex items-center justify-center`}
                >
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{integration.name}</h3>
                  <p className="text-xs text-muted-foreground">{integration.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {enabledCount > 0 && (
                  <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/30">
                    {enabledCount} {enabledCount === 1 ? 'app' : 'apps'}
                  </Badge>
                )}
                {scopeSummary && (
                  <Badge variant="outline" className="text-[10px]">
                    {scopeSummary}
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManageClick(integration);
                  }}
                >
                  Manage
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          );
        })}

        {/* Add Integration Button */}
        <button 
          onClick={() => setAddDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Integration hinzufügen</span>
        </button>
      </div>

      {selectedIntegration && (
        <AdminIntegrationDialog
          integration={selectedIntegration}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onIntegrationUpdate={handleIntegrationUpdate}
        />
      )}

      <AddIntegrationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        availableIntegrations={availableIntegrations}
        onAddIntegration={handleAddIntegration}
      />
    </div>
  );
};

export default AdminIntegrations;
