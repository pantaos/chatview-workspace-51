import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  MessageSquare, 
  Code, 
  Image, 
  FileText, 
  Video, 
  Music, 
  Bot,
  Upload,
  X,
  Plus,
  Sparkles,
  RotateCcw,
  Library,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import TagManager from "./TagManager";
import { WorkflowTag } from "@/types/workflow";
import PromptLibrary from "./PromptLibrary";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewWorkflowDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateWorkflow: (workflow: any) => void;
  availableTags?: WorkflowTag[];
  onCreateTag?: (tag: { name: string; color: string }) => void;
  prefilledPrompt?: string;
}

const iconOptions = [
  { name: "Chat", icon: MessageSquare },
  { name: "Code", icon: Code },
  { name: "Image", icon: Image },
  { name: "Document", icon: FileText },
  { name: "Video", icon: Video },
  { name: "Music", icon: Music },
  { name: "Bot", icon: Bot },
];

const iconColors = [
  { name: "Blue", color: "bg-blue-500", textColor: "text-white" },
  { name: "Green", color: "bg-green-500", textColor: "text-white" },
  { name: "Purple", color: "bg-purple-500", textColor: "text-white" },
  { name: "Orange", color: "bg-orange-500", textColor: "text-white" },
  { name: "Pink", color: "bg-pink-500", textColor: "text-white" },
  { name: "Indigo", color: "bg-indigo-500", textColor: "text-white" },
  { name: "Yellow", color: "bg-yellow-500", textColor: "text-white" },
];

// Available integrations with their apps and permissions
const availableIntegrations = [
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    shortName: 'M',
    colorClass: 'bg-blue-500',
    apps: [
      {
        id: 'outlook',
        name: 'Outlook',
        permissions: [
          { id: 'readEmails', label: 'Emails lesen' },
          { id: 'draftEmails', label: 'Emails entwerfen' },
          { id: 'sendEmails', label: 'Emails senden' },
        ]
      },
      {
        id: 'calendar',
        name: 'Kalender',
        permissions: [
          { id: 'readEvents', label: 'Termine lesen' },
          { id: 'createEvents', label: 'Termine erstellen' },
        ]
      },
      {
        id: 'sharepoint',
        name: 'SharePoint',
        permissions: [
          { id: 'readDocs', label: 'Dokumente lesen' },
          { id: 'uploadDocs', label: 'Dokumente hochladen' },
        ]
      }
    ]
  },
  {
    id: 'notion',
    name: 'Notion',
    shortName: 'N',
    colorClass: 'bg-neutral-800',
    apps: [
      {
        id: 'pages',
        name: 'Seiten',
        permissions: [
          { id: 'readPages', label: 'Seiten lesen' },
          { id: 'createPages', label: 'Seiten erstellen' },
          { id: 'editPages', label: 'Seiten bearbeiten' },
        ]
      },
      {
        id: 'databases',
        name: 'Datenbanken',
        permissions: [
          { id: 'readDb', label: 'Datenbanken lesen' },
          { id: 'writeDb', label: 'Einträge erstellen' },
        ]
      }
    ]
  },
  {
    id: 'google',
    name: 'Google',
    shortName: 'G',
    colorClass: 'bg-red-500',
    apps: [
      {
        id: 'gmail',
        name: 'Gmail',
        permissions: [
          { id: 'readEmails', label: 'Emails lesen' },
          { id: 'sendEmails', label: 'Emails senden' },
        ]
      },
      {
        id: 'calendar',
        name: 'Kalender',
        permissions: [
          { id: 'readEvents', label: 'Termine lesen' },
          { id: 'createEvents', label: 'Termine erstellen' },
        ]
      },
      {
        id: 'drive',
        name: 'Drive',
        permissions: [
          { id: 'readFiles', label: 'Dateien lesen' },
          { id: 'uploadFiles', label: 'Dateien hochladen' },
        ]
      }
    ]
  }
];

type IntegrationState = {
  [integrationId: string]: {
    enabled: boolean;
    expanded: boolean;
    apps: {
      [appId: string]: {
        [permissionId: string]: boolean;
      };
    };
  };
};

const NewWorkflowDialog = ({ 
  open, 
  onClose, 
  onCreateWorkflow,
  availableTags = [],
  onCreateTag,
  prefilledPrompt = ""
}: NewWorkflowDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(prefilledPrompt);
  const [selectedIconColor, setSelectedIconColor] = useState("Blue");
  const [selectedIcon, setSelectedIcon] = useState("Chat");
  const [selectedTags, setSelectedTags] = useState<WorkflowTag[]>([]);
  const [starters, setStarters] = useState([""]);
  const [newStarter, setNewStarter] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [manualNameEntry, setManualNameEntry] = useState(false);
  const [manualDescriptionEntry, setManualDescriptionEntry] = useState(false);
  const [manualStartersEntry, setManualStartersEntry] = useState(false);
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false);
  
  // Integration state
  const [integrations, setIntegrations] = useState<IntegrationState>(() => {
    const initial: IntegrationState = {};
    availableIntegrations.forEach(integration => {
      const apps: IntegrationState[string]['apps'] = {};
      integration.apps.forEach(app => {
        apps[app.id] = {};
        app.permissions.forEach(perm => {
          apps[app.id][perm.id] = false;
        });
      });
      initial[integration.id] = {
        enabled: false,
        expanded: false,
        apps
      };
    });
    return initial;
  });

  // Update system prompt when prefilledPrompt changes
  React.useEffect(() => {
    if (prefilledPrompt) {
      setSystemPrompt(prefilledPrompt);
    }
  }, [prefilledPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    // Collect enabled integrations with their permissions
    const enabledIntegrations: { [key: string]: { [appId: string]: string[] } } = {};
    Object.entries(integrations).forEach(([integrationId, data]) => {
      if (data.enabled) {
        enabledIntegrations[integrationId] = {};
        Object.entries(data.apps).forEach(([appId, permissions]) => {
          const enabledPerms = Object.entries(permissions)
            .filter(([, enabled]) => enabled)
            .map(([permId]) => permId);
          if (enabledPerms.length > 0) {
            enabledIntegrations[integrationId][appId] = enabledPerms;
          }
        });
      }
    });

    const workflow = {
      title: title.trim(),
      description: description.trim(),
      selectedIconColor,
      selectedIcon,
      tags: selectedTags,
      systemPrompt: systemPrompt.trim(),
      starters: starters.filter(s => s.trim()),
      isPublic,
      integrations: enabledIntegrations,
      type: 'assistant'
    };

    onCreateWorkflow(workflow);
    
    // Reset form
    setTitle("");
    setDescription("");
    setSystemPrompt("");
    setSelectedIconColor("Blue");
    setSelectedIcon("Chat");
    setSelectedTags([]);
    setStarters([""]);
    setNewStarter("");
    setIsPublic(false);
    setManualNameEntry(false);
    setManualDescriptionEntry(false);
    setManualStartersEntry(false);
    // Reset integrations
    setIntegrations(() => {
      const initial: IntegrationState = {};
      availableIntegrations.forEach(integration => {
        const apps: IntegrationState[string]['apps'] = {};
        integration.apps.forEach(app => {
          apps[app.id] = {};
          app.permissions.forEach(perm => {
            apps[app.id][perm.id] = false;
          });
        });
        initial[integration.id] = {
          enabled: false,
          expanded: false,
          apps
        };
      });
      return initial;
    });
  };

  const addStarter = () => {
    if (newStarter.trim()) {
      setStarters([...starters, newStarter.trim()]);
      setNewStarter("");
    }
  };

  const removeStarter = (index: number) => {
    setStarters(starters.filter((_, i) => i !== index));
  };

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        enabled: !prev[integrationId].enabled,
        expanded: !prev[integrationId].enabled ? true : prev[integrationId].expanded
      }
    }));
  };

  const toggleIntegrationExpanded = (integrationId: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        expanded: !prev[integrationId].expanded
      }
    }));
  };

  const togglePermission = (integrationId: string, appId: string, permissionId: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        apps: {
          ...prev[integrationId].apps,
          [appId]: {
            ...prev[integrationId].apps[appId],
            [permissionId]: !prev[integrationId].apps[appId][permissionId]
          }
        }
      }
    }));
  };

  const getEnabledPermissionCount = (integrationId: string): number => {
    const data = integrations[integrationId];
    if (!data) return 0;
    let count = 0;
    Object.values(data.apps).forEach(perms => {
      count += Object.values(perms).filter(Boolean).length;
    });
    return count;
  };

  const areAllPermissionsEnabled = (integrationId: string): boolean => {
    const integration = availableIntegrations.find(i => i.id === integrationId);
    if (!integration) return false;
    
    return integration.apps.every(app =>
      app.permissions.every(perm =>
        integrations[integrationId]?.apps[app.id]?.[perm.id] === true
      )
    );
  };

  const toggleAllPermissions = (integrationId: string) => {
    const allEnabled = areAllPermissionsEnabled(integrationId);
    const integration = availableIntegrations.find(i => i.id === integrationId);
    if (!integration) return;

    setIntegrations(prev => {
      const newApps: IntegrationState[string]['apps'] = {};
      integration.apps.forEach(app => {
        newApps[app.id] = {};
        app.permissions.forEach(perm => {
          newApps[app.id][perm.id] = !allEnabled;
        });
      });
      
      return {
        ...prev,
        [integrationId]: {
          ...prev[integrationId],
          apps: newApps
        }
      };
    });
  };

  const isMobile = useIsMobile();

  const formContent = (
    <ScrollArea className="flex-1">
      <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="title">Assistant Name</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setManualNameEntry(!manualNameEntry)}
                className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {manualNameEntry ? "Auto Create" : "Manual Input"}
              </Button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Customer Support Assistant"
                      disabled={!manualNameEntry}
                      required
                      className={!manualNameEntry ? "opacity-50" : ""}
                    />
                  </div>
                </TooltipTrigger>
                {!manualNameEntry && (
                  <TooltipContent>
                    <p>Complete the system prompt to generate a name automatically.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setManualDescriptionEntry(!manualDescriptionEntry)}
                className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {manualDescriptionEntry ? "Auto Create" : "Manual Input"}
              </Button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 100) {
                          setDescription(value);
                        }
                      }}
                      placeholder="Briefly describe what this assistant does"
                      rows={3}
                      disabled={!manualDescriptionEntry}
                      className={!manualDescriptionEntry ? "opacity-50" : ""}
                      maxLength={100}
                    />
                    {manualDescriptionEntry && (
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {description.length}/100
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                {!manualDescriptionEntry && (
                  <TooltipContent>
                    <p>Complete the system prompt to generate a description automatically.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setPromptLibraryOpen(true)}
                      >
                        <Library className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Browse prompt library</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful assistant..."
              rows={6}
              className="border-2 border-primary/20 focus:border-primary rounded-lg"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Conversation Starters</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setManualStartersEntry(!manualStartersEntry)}
                className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {manualStartersEntry ? "Auto Create" : "Manual Input"}
              </Button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="space-y-3">
                    {starters.map((starter, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={starter}
                          onChange={(e) => {
                            const updated = [...starters];
                            updated[index] = e.target.value;
                            setStarters(updated);
                          }}
                          placeholder="Enter conversation starter..."
                          className={`flex-1 ${!manualStartersEntry ? "opacity-50" : ""}`}
                          disabled={!manualStartersEntry}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStarter(index)}
                          className="text-muted-foreground hover:text-foreground"
                          disabled={!manualStartersEntry}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newStarter}
                        onChange={(e) => setNewStarter(e.target.value)}
                        placeholder="Add a conversation starter"
                        className={`flex-1 ${!manualStartersEntry ? "opacity-50" : ""}`}
                        disabled={!manualStartersEntry}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addStarter();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={addStarter}
                        disabled={!newStarter.trim() || !manualStartersEntry}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </TooltipTrigger>
                {!manualStartersEntry && (
                  <TooltipContent>
                    <p>Complete the system prompt to generate starters automatically.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          <div>
            <Label>Icon</Label>
            <div className="flex gap-3 mt-2 flex-wrap">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.name}
                    type="button"
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                      selectedIcon === option.name 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-muted bg-background text-muted-foreground hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedIcon(option.name)}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>Icon Color</Label>
            <div className="flex gap-3 mt-2 flex-wrap">
              {iconColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className={`w-10 h-10 rounded-lg ${color.color} flex items-center justify-center transition-all ${
                    selectedIconColor === color.name ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  onClick={() => setSelectedIconColor(color.name)}
                >
                  <MessageSquare className={`w-4 h-4 ${color.textColor}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Privacy Settings</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="public" className="text-sm">
                Make this assistant public
              </Label>
            </div>
          </div>

          <div>
            <Label>Knowledge Base</Label>
            <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop files here
              </p>
              <Button type="button" variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          {/* Integrations Section */}
          <div>
            <Label className="mb-3 block">Integrationen</Label>
            <div className="space-y-2">
              {availableIntegrations.map((integration) => {
                const isEnabled = integrations[integration.id]?.enabled;
                const isExpanded = integrations[integration.id]?.expanded;
                const permCount = getEnabledPermissionCount(integration.id);

                return (
                  <div
                    key={integration.id}
                    className={`border rounded-lg transition-all ${
                      isEnabled ? 'border-primary/40 bg-primary/5' : 'border-border'
                    }`}
                  >
                    {/* Integration Header */}
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-md ${integration.colorClass} flex items-center justify-center text-white text-sm font-semibold`}>
                          {integration.shortName}
                        </div>
                        <div>
                          <span className="text-sm font-medium">{integration.name}</span>
                          {isEnabled && permCount > 0 && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {permCount} Berechtigung{permCount !== 1 ? 'en' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isEnabled && (
                          <button
                            type="button"
                            onClick={() => toggleIntegrationExpanded(integration.id)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <Button
                          type="button"
                          variant={isEnabled ? "outline" : "secondary"}
                          size="sm"
                          onClick={() => toggleIntegration(integration.id)}
                          className="text-xs"
                        >
                          {isEnabled ? 'Entfernen' : 'Hinzufügen'}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Permissions */}
                    {isEnabled && isExpanded && (
                      <div className="px-3 pb-3 pt-0 border-t border-border/50">
                        <div className="pt-3 space-y-4">
                          {/* Alle auswählen */}
                          <div className="flex items-center justify-between py-2 border-b border-border/30 pb-3">
                            <span className="text-sm font-medium">Alle Berechtigungen</span>
                            <Switch
                              checked={areAllPermissionsEnabled(integration.id)}
                              onCheckedChange={() => toggleAllPermissions(integration.id)}
                            />
                          </div>
                          
                          {integration.apps.map((app) => (
                            <div key={app.id}>
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                {app.name}
                              </p>
                              <div className="space-y-2">
                                {app.permissions.map((perm) => (
                                  <div
                                    key={perm.id}
                                    className="flex items-center justify-between py-1"
                                  >
                                    <span className="text-sm">{perm.label}</span>
                                    <Switch
                                      checked={integrations[integration.id]?.apps[app.id]?.[perm.id] ?? false}
                                      onCheckedChange={() => togglePermission(integration.id, app.id, perm.id)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 sticky bottom-0 bg-background pb-4">
          <Button type="submit" className="flex-1">
            Create Assistant
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onClose}>
          <DrawerContent className="h-[95vh] max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
              <div>
                <h2 className="text-base font-semibold">Create New Assistant</h2>
                <p className="text-xs text-muted-foreground">Configure your assistant</p>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {formContent}
          </DrawerContent>
        </Drawer>
        <PromptLibrary
          open={promptLibraryOpen}
          onClose={() => setPromptLibraryOpen(false)}
          onSelectPrompt={(prompt) => {
            setSystemPrompt(prompt);
            setPromptLibraryOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[85vh] p-0 flex flex-col gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
            <DialogTitle>Create New Assistant</DialogTitle>
            <DialogDescription>
              Configure your assistant with custom prompts and integrations.
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
      <PromptLibrary
        open={promptLibraryOpen}
        onClose={() => setPromptLibraryOpen(false)}
        onSelectPrompt={(prompt) => {
          setSystemPrompt(prompt);
          setPromptLibraryOpen(false);
        }}
      />
    </>
  );
};

export default NewWorkflowDialog;
