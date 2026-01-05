import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, FileText, Image } from "lucide-react";
import { AdminIntegrationDialog } from "./AdminIntegrationDialog";

export interface IntegrationApp {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  accessScope: "organization" | "teams" | "assistants" | "users" | null;
  selectedTeams: string[];
  selectedAssistants: string[];
  selectedUsers: string[];
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

const initialIntegrations: Integration[] = [
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
    connected: true,
    apps: [
      { 
        id: "notion", 
        name: "Notion", 
        description: "Workspace access",
        enabled: true, 
        accessScope: "assistants",
        selectedTeams: [],
        selectedAssistants: ["1", "2"],
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
        selectedUsers: []
      },
      { 
        id: "midjourney", 
        name: "Midjourney", 
        description: "Artistic image generation",
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
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {integrations.map((integration) => {
          const enabledCount = getEnabledAppsCount(integration);
          const scopeSummary = getAccessScopeSummary(integration);
          
          return (
            <Card 
              key={integration.id}
              className="p-5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className={`w-12 h-12 ${integration.iconBg} rounded-xl flex items-center justify-center`}
                  >
                    {integration.icon}
                  </div>
                  {integration.connected && (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                      Connected
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold text-base mb-1">{integration.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>

                <div className="flex items-center gap-2 mb-4 mt-auto">
                  {enabledCount > 0 && (
                    <Badge variant="outline" className="text-[10px]">
                      {enabledCount} {enabledCount === 1 ? 'app' : 'apps'} enabled
                    </Badge>
                  )}
                  {scopeSummary && (
                    <Badge variant="outline" className="text-[10px]">
                      {scopeSummary}
                    </Badge>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleManageClick(integration)}
                >
                  Manage
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedIntegration && (
        <AdminIntegrationDialog
          integration={selectedIntegration}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onIntegrationUpdate={handleIntegrationUpdate}
        />
      )}
    </div>
  );
};

export default AdminIntegrations;
