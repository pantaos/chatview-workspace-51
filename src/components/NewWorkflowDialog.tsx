
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  Mail,
  Calendar
} from "lucide-react";
import TagManager from "./TagManager";
import { WorkflowTag } from "@/types/workflow";
import PromptLibrary from "./PromptLibrary";

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

const integrations = [
  { name: "Microsoft Office", enabled: false },
  { name: "Notion", enabled: false },
  { name: "Gmail", enabled: false },
  { name: "GitHub", enabled: false },
  { name: "AWS", enabled: false },
  { name: "Slack", enabled: false },
  { name: "Calendar", enabled: false },
  { name: "SharePoint", enabled: false },
  { name: "Trello", enabled: false },
  { name: "Asana", enabled: false },
  { name: "Jira", enabled: false },
];

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
  const [enabledIntegrations, setEnabledIntegrations] = useState(
    integrations.reduce((acc, integration) => {
      acc[integration.name] = integration.enabled;
      return acc;
    }, {} as Record<string, boolean>)
  );
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false);
  const [integrationsExpanded, setIntegrationsExpanded] = useState(false);

  // Update system prompt when prefilledPrompt changes
  React.useEffect(() => {
    if (prefilledPrompt) {
      setSystemPrompt(prefilledPrompt);
    }
  }, [prefilledPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

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
    setEnabledIntegrations(
      integrations.reduce((acc, integration) => {
        acc[integration.name] = integration.enabled;
        return acc;
      }, {} as Record<string, boolean>)
    );
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

  const toggleIntegration = (name: string) => {
    setEnabledIntegrations(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assistant</DialogTitle>
          <DialogDescription>
            Create a chat-based AI assistant with custom prompts and conversation starters.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="title">Assistant Name</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setManualNameEntry(!manualNameEntry)}
                  className="text-xs text-muted-foreground hover:text-white hover:bg-black"
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
                  className="text-xs text-muted-foreground hover:text-white hover:bg-black"
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
                  className="text-xs text-muted-foreground hover:text-white hover:bg-black"
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
              <div className="flex gap-4 mt-2 flex-wrap">
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div key={option.name} className="flex flex-col items-center gap-2">
                      <button
                        type="button"
                        className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                          selectedIcon === option.name 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-muted bg-background text-muted-foreground hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedIcon(option.name)}
                      >
                        <IconComponent className="w-6 h-6" />
                      </button>
                      <span className="text-xs text-muted-foreground">{option.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Icon Color</Label>
              <div className="flex gap-4 mt-2 flex-wrap">
                {iconColors.map((color) => (
                  <div key={color.name} className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      className={`w-12 h-12 rounded-lg ${color.color} flex items-center justify-center transition-all ${
                        selectedIconColor === color.name ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => setSelectedIconColor(color.name)}
                    >
                      <MessageSquare className={`w-5 h-5 ${color.textColor}`} />
                    </button>
                  </div>
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
              <Label>Integrations</Label>
              {!integrationsExpanded && (
                <button
                  onClick={() => setIntegrationsExpanded(true)}
                  className="mt-2 w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-5 h-5 text-primary" />
                </button>
              )}
              {integrationsExpanded && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Select integrations to connect</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIntegrationsExpanded(false)}
                      className="h-7 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Close
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {/* Microsoft Office */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">Office</span>
                      <Switch 
                        checked={enabledIntegrations["Microsoft Office"]}
                        onCheckedChange={() => toggleIntegration("Microsoft Office")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* Notion */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">Notion</span>
                      <Switch 
                        checked={enabledIntegrations["Notion"]}
                        onCheckedChange={() => toggleIntegration("Notion")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* Gmail */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">Gmail</span>
                      <Switch 
                        checked={enabledIntegrations["Gmail"]}
                        onCheckedChange={() => toggleIntegration("Gmail")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* GitHub */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">GitHub</span>
                      <Switch 
                        checked={enabledIntegrations["GitHub"]}
                        onCheckedChange={() => toggleIntegration("GitHub")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* AWS */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.591-.894-.591-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36C2.279 4.08 2.7 4.04 3.134 4.04c1.005 0 1.74.224 2.198.678.455.455.686 1.141.686 2.07v2.248zm-3.238 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.336-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">AWS</span>
                      <Switch 
                        checked={enabledIntegrations["AWS"]}
                        onCheckedChange={() => toggleIntegration("AWS")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* Slack */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">Slack</span>
                      <Switch 
                        checked={enabledIntegrations["Slack"]}
                        onCheckedChange={() => toggleIntegration("Slack")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* Calendar */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">Calendar</span>
                      <Switch 
                        checked={enabledIntegrations["Calendar"]}
                        onCheckedChange={() => toggleIntegration("Calendar")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* SharePoint */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">SharePoint</span>
                      <Switch 
                        checked={enabledIntegrations["SharePoint"]}
                        onCheckedChange={() => toggleIntegration("SharePoint")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* Trello */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">Trello</span>
                      <Switch 
                        checked={enabledIntegrations["Trello"]}
                        onCheckedChange={() => toggleIntegration("Trello")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* Asana */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.78 12.653c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.338-5.22-5.22-5.22zm-13.56 0c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.338-5.22-5.22-5.22zM12 .907C9.118.907 6.78 3.243 6.78 6.127s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22S14.882.907 12 .907z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">Asana</span>
                      <Switch 
                        checked={enabledIntegrations["Asana"]}
                        onCheckedChange={() => toggleIntegration("Asana")}
                        className="scale-[0.65]"
                      />
                    </Card>

                    {/* Jira */}
                    <Card className="p-2 flex flex-col items-center justify-center space-y-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.757a1 1 0 0 0-1.001-1zm5.7-5.756H11.436a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057a5.215 5.215 0 0 0 5.215 5.215V1a1 1 0 0 0-1.001-1z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">Jira</span>
                      <Switch 
                        checked={enabledIntegrations["Jira"]}
                        onCheckedChange={() => toggleIntegration("Jira")}
                        className="scale-[0.65]"
                      />
                    </Card>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label>Knowledge Base</Label>
              <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop files here, or click to browse
                </p>
                <Button type="button" variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Assistant
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>

      <PromptLibrary
        open={promptLibraryOpen}
        onClose={() => setPromptLibraryOpen(false)}
        onSelectPrompt={(prompt) => setSystemPrompt(prompt)}
      />
    </Dialog>
  );
};

export default NewWorkflowDialog;
