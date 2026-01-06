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
                <p className="text-xs text-muted-foreground">Custom AI assistant</p>
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
          onSelectPrompt={(prompt) => setSystemPrompt(prompt)}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle>Create New Assistant</DialogTitle>
            <DialogDescription>
              Create a chat-based AI assistant with custom prompts and conversation starters.
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
      <PromptLibrary
        open={promptLibraryOpen}
        onClose={() => setPromptLibraryOpen(false)}
        onSelectPrompt={(prompt) => setSystemPrompt(prompt)}
      />
    </>
  );
};

export default NewWorkflowDialog;
