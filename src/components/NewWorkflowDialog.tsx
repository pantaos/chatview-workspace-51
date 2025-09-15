
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
  RotateCcw
} from "lucide-react";
import TagManager from "./TagManager";
import { WorkflowTag } from "@/types/workflow";

interface NewWorkflowDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateWorkflow: (workflow: any) => void;
  availableTags?: WorkflowTag[];
  onCreateTag?: (tag: { name: string; color: string }) => void;
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
];

const NewWorkflowDialog = ({ 
  open, 
  onClose, 
  onCreateWorkflow,
  availableTags = [],
  onCreateTag
}: NewWorkflowDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedIconColor, setSelectedIconColor] = useState("Blue");
  const [selectedIcon, setSelectedIcon] = useState("Chat");
  const [selectedTags, setSelectedTags] = useState<WorkflowTag[]>([]);
  const [starters, setStarters] = useState([""]);
  const [newStarter, setNewStarter] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [manualNameEntry, setManualNameEntry] = useState(false);
  const [manualDescriptionEntry, setManualDescriptionEntry] = useState(false);
  const [enabledIntegrations, setEnabledIntegrations] = useState(
    integrations.reduce((acc, integration) => {
      acc[integration.name] = integration.enabled;
      return acc;
    }, {} as Record<string, boolean>)
  );

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
                    <div>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Briefly describe what this assistant does"
                        rows={3}
                        disabled={!manualDescriptionEntry}
                        className={!manualDescriptionEntry ? "opacity-50" : ""}
                      />
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
              <Label>Conversation Starters</Label>
              <div className="space-y-3 mt-2">
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
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStarter(index)}
                      className="text-muted-foreground hover:text-foreground"
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
                    className="flex-1"
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
                    disabled={!newStarter.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-3 mt-2">
                {integrations.map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">{integration.name}</span>
                    <Switch
                      checked={enabledIntegrations[integration.name]}
                      onCheckedChange={() => toggleIntegration(integration.name)}
                    />
                  </div>
                ))}
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
    </Dialog>
  );
};

export default NewWorkflowDialog;
