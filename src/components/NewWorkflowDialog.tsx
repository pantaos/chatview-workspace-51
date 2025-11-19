
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {/* Microsoft Office */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">Microsoft Office</span>
                  <Switch 
                    checked={enabledIntegrations["Microsoft Office"]}
                    onCheckedChange={() => toggleIntegration("Microsoft Office")}
                    className="scale-75"
                  />
                </Card>

                {/* Notion */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">N</span>
                  </div>
                  <span className="text-xs font-medium text-center">Notion</span>
                  <Switch 
                    checked={enabledIntegrations["Notion"]}
                    onCheckedChange={() => toggleIntegration("Notion")}
                    className="scale-75"
                  />
                </Card>

                {/* Gmail */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">Gmail</span>
                  <Switch 
                    checked={enabledIntegrations["Gmail"]}
                    onCheckedChange={() => toggleIntegration("Gmail")}
                    className="scale-75"
                  />
                </Card>

                {/* GitHub */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-center">GitHub</span>
                  <Switch 
                    checked={enabledIntegrations["GitHub"]}
                    onCheckedChange={() => toggleIntegration("GitHub")}
                    className="scale-75"
                  />
                </Card>

                {/* AWS */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.144.24l-.479.319c-.064.048-.128.063-.183.063-.08 0-.16-.04-.239-.112-.112-.12-.207-.248-.279-.383-.08-.135-.16-.287-.256-.455-.639.76-1.44 1.135-2.399 1.135-.687 0-1.232-.2-1.64-.6-.407-.399-.615-.936-.615-1.599 0-.711.255-1.287.775-1.727.52-.44 1.215-.664 2.096-.664.287 0 .583.024.895.064.312.04.632.104.967.16v-.528c0-.543-.112-.92-.32-1.135-.216-.215-.583-.32-1.111-.32-.24 0-.487.032-.743.08-.255.047-.504.112-.743.199-.112.048-.199.08-.248.096-.048.016-.08.024-.104.024-.096 0-.144-.072-.144-.208v-.32c0-.111.016-.191.056-.24.04-.048.112-.096.239-.144.24-.127.527-.232.863-.32.336-.08.695-.12 1.08-.12.824 0 1.424.191 1.816.576.391.384.583.968.583 1.75v2.303zm-3.295 1.231c.279 0 .567-.048.879-.144.312-.096.591-.28.831-.535.144-.16.248-.336.296-.535.048-.2.08-.44.08-.72v-.335c-.24-.048-.495-.088-.767-.12-.271-.031-.535-.047-.791-.047-.559 0-.967.111-1.231.343-.263.232-.391.56-.391.984 0 .408.104.712.319.927.215.216.527.32.967.32zm6.606.896c-.112 0-.192-.024-.248-.064-.056-.048-.104-.144-.152-.263l-1.687-5.543c-.048-.16-.072-.263-.072-.319 0-.128.064-.2.192-.2h.783c.12 0 .2.024.247.064.048.048.096.144.144.263l1.207 4.752 1.119-4.752c.032-.16.08-.215.127-.263.048-.048.136-.064.256-.064h.639c.12 0 .207.024.255.064.048.048.104.144.128.263l1.135 4.8 1.239-4.8c.048-.16.104-.215.151-.263.048-.048.128-.064.248-.064h.743c.127 0 .2.064.2.2 0 .04-.008.08-.016.127-.008.048-.024.112-.056.192L18.442 13.86c-.048.16-.104.215-.151.263-.048.048-.128.064-.248.064h-.687c-.12 0-.207-.024-.255-.064-.048-.048-.104-.144-.128-.263L15.847 9.16l-1.111 4.727c-.032.16-.08.215-.127.263-.048.048-.136.064-.256.064h-.688zm10.695.271c-.431 0-.863-.048-1.279-.144-.416-.096-.735-.208-.951-.335-.128-.08-.215-.167-.247-.231-.032-.064-.048-.136-.048-.2v-.335c0-.136.056-.2.151-.2.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.56.215.863.279.304.064.608.096.911.096.511 0 .911-.088 1.191-.264.287-.176.424-.448.424-.8 0-.24-.08-.44-.239-.6-.16-.159-.48-.311-.96-.455l-1.375-.431c-.695-.216-1.207-.536-1.527-.96-.32-.416-.479-.872-.479-1.367 0-.4.087-.751.263-1.055.176-.304.415-.567.719-.791.304-.224.655-.391 1.063-.495.408-.104.847-.159 1.319-.159.184 0 .375.008.567.032.192.024.375.056.56.088.175.04.343.08.502.127.16.048.295.096.415.144.112.064.2.127.247.192.048.064.072.152.072.263v.311c0 .136-.056.208-.151.208-.064 0-.168-.032-.295-.096-.495-.224-1.031-.336-1.615-.336-.464 0-.831.072-1.095.224-.264.151-.391.392-.391.727 0 .24.087.447.263.623.176.176.511.36 1.015.536l1.351.431c.687.22 1.191.527 1.495.927.304.4.455.88.455 1.439 0 .416-.087.791-.255 1.127-.176.336-.415.631-.727.879-.312.248-.687.44-1.127.583-.448.135-.936.207-1.463.207z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-center">AWS</span>
                  <Switch 
                    checked={enabledIntegrations["AWS"]}
                    onCheckedChange={() => toggleIntegration("AWS")}
                    className="scale-75"
                  />
                </Card>

                {/* Slack */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">Slack</span>
                  <Switch 
                    checked={enabledIntegrations["Slack"]}
                    onCheckedChange={() => toggleIntegration("Slack")}
                    className="scale-75"
                  />
                </Card>

                {/* Calendar */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">Calendar</span>
                  <Switch 
                    checked={enabledIntegrations["Calendar"]}
                    onCheckedChange={() => toggleIntegration("Calendar")}
                    className="scale-75"
                  />
                </Card>

                {/* SharePoint */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">SharePoint</span>
                  <Switch 
                    checked={enabledIntegrations["SharePoint"]}
                    onCheckedChange={() => toggleIntegration("SharePoint")}
                    className="scale-75"
                  />
                </Card>

                {/* Trello */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-center">Trello</span>
                  <Switch 
                    checked={enabledIntegrations["Trello"]}
                    onCheckedChange={() => toggleIntegration("Trello")}
                    className="scale-75"
                  />
                </Card>

                {/* Asana */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.78 12.653c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.338-5.22-5.22-5.22zm-13.56 0c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.338-5.22-5.22-5.22zM12 .907C9.118.907 6.78 3.243 6.78 6.127s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22S14.882.907 12 .907z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-center">Asana</span>
                  <Switch 
                    checked={enabledIntegrations["Asana"]}
                    onCheckedChange={() => toggleIntegration("Asana")}
                    className="scale-75"
                  />
                </Card>

                {/* Jira */}
                <Card className="p-3 flex flex-col items-center justify-center space-y-2 aspect-square">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.757a1 1 0 0 0-1.001-1zm5.7-5.756H11.436a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057a5.215 5.215 0 0 0 5.215 5.215V1a1 1 0 0 0-1.001-1z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-center">Jira</span>
                  <Switch 
                    checked={enabledIntegrations["Jira"]}
                    onCheckedChange={() => toggleIntegration("Jira")}
                    className="scale-75"
                  />
                </Card>
              </div>
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
