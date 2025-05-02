
import React, { useState } from "react";
import { Check, MessageSquare, Code, Image, FileText, Video, Music, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const iconOptions = [
  { name: "Chat", icon: MessageSquare },
  { name: "Code", icon: Code },
  { name: "Image", icon: Image },
  { name: "Document", icon: FileText },
  { name: "Video", icon: Video },
  { name: "Music", icon: Music },
  { name: "Bot", icon: Bot },
];

const colorOptions = [
  { name: "Blue", value: "text-blue-500" },
  { name: "Green", value: "text-green-500" },
  { name: "Red", value: "text-red-500" },
  { name: "Purple", value: "text-purple-500" },
  { name: "Yellow", value: "text-yellow-500" },
  { name: "Pink", value: "text-pink-500" },
  { name: "Gray", value: "text-gray-600" },
];

interface ConversationStarter {
  displayText: string;
  fullPrompt: string;
  isExpanded?: boolean;
}

interface WorkflowFormData {
  title: string;
  description: string;
  systemPrompt: string;
  selectedIcon: string;
  iconColor: string;
  starters: ConversationStarter[];
}

interface NewWorkflowDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateWorkflow: (workflow: WorkflowFormData) => void;
}

const NewWorkflowDialog = ({
  open,
  onClose,
  onCreateWorkflow,
}: NewWorkflowDialogProps) => {
  const [formData, setFormData] = useState<WorkflowFormData>({
    title: "",
    description: "",
    systemPrompt: "You are a helpful assistant.",
    selectedIcon: "Chat",
    iconColor: "text-gray-600",
    starters: [
      {
        displayText: "How can I help you today?",
        fullPrompt: "How can I help you today?",
        isExpanded: false
      },
      {
        displayText: "What would you like to know?",
        fullPrompt: "What would you like to know about this topic? I can provide detailed information.",
        isExpanded: false
      },
    ],
  });

  const [currentStarterDisplay, setCurrentStarterDisplay] = useState("");
  const [currentStarterPrompt, setCurrentStarterPrompt] = useState("");
  const [editingStarterIndex, setEditingStarterIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (iconName: string) => {
    setFormData((prev) => ({ ...prev, selectedIcon: iconName }));
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, iconColor: color }));
  };

  const handleAddStarter = () => {
    if (currentStarterDisplay.trim()) {
      const newStarter: ConversationStarter = {
        displayText: currentStarterDisplay.trim(),
        fullPrompt: currentStarterPrompt.trim() || currentStarterDisplay.trim(),
        isExpanded: false
      };
      
      setFormData((prev) => ({
        ...prev,
        starters: [...prev.starters, newStarter],
      }));
      
      setCurrentStarterDisplay("");
      setCurrentStarterPrompt("");
    }
  };

  const handleUpdateStarter = () => {
    if (editingStarterIndex !== null && currentStarterDisplay.trim()) {
      setFormData((prev) => {
        const updatedStarters = [...prev.starters];
        updatedStarters[editingStarterIndex] = {
          displayText: currentStarterDisplay.trim(),
          fullPrompt: currentStarterPrompt.trim() || currentStarterDisplay.trim(),
          isExpanded: updatedStarters[editingStarterIndex].isExpanded
        };
        return { ...prev, starters: updatedStarters };
      });
      
      setCurrentStarterDisplay("");
      setCurrentStarterPrompt("");
      setEditingStarterIndex(null);
    }
  };

  const handleEditStarter = (index: number) => {
    setCurrentStarterDisplay(formData.starters[index].displayText);
    setCurrentStarterPrompt(formData.starters[index].fullPrompt);
    setEditingStarterIndex(index);
  };

  const handleCancelEdit = () => {
    setCurrentStarterDisplay("");
    setCurrentStarterPrompt("");
    setEditingStarterIndex(null);
  };

  const handleRemoveStarter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      starters: prev.starters.filter((_, i) => i !== index),
    }));
  };

  const toggleStarterExpanded = (index: number) => {
    setFormData((prev) => {
      const updatedStarters = [...prev.starters];
      updatedStarters[index] = {
        ...updatedStarters[index],
        isExpanded: !updatedStarters[index].isExpanded
      };
      return { ...prev, starters: updatedStarters };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateWorkflow(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Chat-based Workflow</DialogTitle>
            <DialogDescription>
              Configure your new chat-based workflow.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Workflow Name</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., Customer Support Assistant"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe what this workflow does"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                name="systemPrompt"
                value={formData.systemPrompt}
                onChange={handleChange}
                placeholder="Instructions for the AI model"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-7 gap-2">
                {iconOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.name}
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-16 w-16 flex-col gap-1 p-2",
                        formData.selectedIcon === option.name &&
                          "border-primary ring-2 ring-primary ring-opacity-20"
                      )}
                      onClick={() => handleIconSelect(option.name)}
                    >
                      <Icon className={cn("h-6 w-6", formData.iconColor)} />
                      <span className="text-xs">{option.name}</span>
                      {formData.selectedIcon === option.name && (
                        <Check className="absolute top-1 right-1 h-3 w-3" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Icon Color</Label>
              <div className="grid grid-cols-7 gap-2">
                {colorOptions.map((option) => {
                  const Icon = 
                    iconOptions.find(i => i.name === formData.selectedIcon)?.icon || 
                    MessageSquare;
                  
                  return (
                    <Button
                      key={option.name}
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-14 w-14 p-2",
                        formData.iconColor === option.value &&
                          "border-primary ring-2 ring-primary ring-opacity-20"
                      )}
                      onClick={() => handleColorSelect(option.value)}
                    >
                      <Icon className={cn("h-8 w-8", option.value)} />
                      {formData.iconColor === option.value && (
                        <Check className="absolute top-1 right-1 h-3 w-3" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Conversation Starters</Label>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Add Conversation Starter</CardTitle>
                  <CardDescription>
                    Create conversation starters with display text and detailed prompts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="display-text">Display Text</Label>
                      <Input
                        id="display-text"
                        value={currentStarterDisplay}
                        onChange={(e) => setCurrentStarterDisplay(e.target.value)}
                        placeholder="Short text shown to users"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="full-prompt">Full Prompt (optional)</Label>
                      <Textarea
                        id="full-prompt"
                        value={currentStarterPrompt}
                        onChange={(e) => setCurrentStarterPrompt(e.target.value)}
                        placeholder="Detailed prompt sent to AI (defaults to display text if left empty)"
                        className="min-h-[80px] mt-1.5"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {editingStarterIndex !== null ? (
                    <div className="flex gap-2">
                      <Button type="button" onClick={handleUpdateStarter}>
                        Update
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" onClick={handleAddStarter} disabled={!currentStarterDisplay.trim()}>
                      Add Starter
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {formData.starters.length > 0 && (
                <div className="border rounded-lg mt-4">
                  <div className="p-3 bg-gray-50 border-b rounded-t-lg">
                    <h3 className="font-medium">Conversation Starters</h3>
                  </div>
                  <div className="divide-y">
                    {formData.starters.map((starter, index) => (
                      <Collapsible 
                        key={index} 
                        open={starter.isExpanded} 
                        onOpenChange={() => toggleStarterExpanded(index)}
                        className="px-4 py-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 font-medium text-sm truncate pr-2">
                            {starter.displayText}
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              type="button" 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditStarter(index)}
                            >
                              <span className="sr-only">Edit</span>
                              <Code className="h-4 w-4" />
                            </Button>
                            <Button 
                              type="button"
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              onClick={() => handleRemoveStarter(index)}
                            >
                              <span className="sr-only">Remove</span>
                              <X className="h-4 w-4" />
                            </Button>
                            <CollapsibleTrigger asChild>
                              <Button 
                                type="button" 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Toggle</span>
                                {starter.isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>
                        <CollapsibleContent className="mt-2 pt-2 border-t">
                          <div className="text-sm">
                            <Label className="text-xs text-gray-500 mb-1 block">Full Prompt:</Label>
                            <div className="bg-gray-50 p-2 rounded text-gray-700 whitespace-pre-wrap">
                              {starter.fullPrompt}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Chat-based Workflow</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkflowDialog;
