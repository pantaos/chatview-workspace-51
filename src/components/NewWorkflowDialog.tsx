
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MessageSquare, 
  Code, 
  Image, 
  FileText, 
  Video, 
  Music, 
  Bot 
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
  const [selectedIcon, setSelectedIcon] = useState("Chat");
  const [selectedTags, setSelectedTags] = useState<WorkflowTag[]>([]);
  const [starters, setStarters] = useState([{ displayText: "", fullPrompt: "" }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const workflow = {
      title: title.trim(),
      description: description.trim(),
      selectedIcon,
      tags: selectedTags,
      systemPrompt: systemPrompt.trim(),
      starters: starters.filter(s => s.displayText.trim()),
      type: 'assistant'
    };

    onCreateWorkflow(workflow);
    
    // Reset form
    setTitle("");
    setDescription("");
    setSystemPrompt("");
    setSelectedIcon("Chat");
    setSelectedTags([]);
    setStarters([{ displayText: "", fullPrompt: "" }]);
  };

  const addStarter = () => {
    setStarters([...starters, { displayText: "", fullPrompt: "" }]);
  };

  const removeStarter = (index: number) => {
    setStarters(starters.filter((_, i) => i !== index));
  };

  const updateStarter = (index: number, field: 'displayText' | 'fullPrompt', value: string) => {
    const updated = [...starters];
    updated[index][field] = value;
    setStarters(updated);
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assistant title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this assistant does"
                rows={3}
              />
            </div>

            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Button
                      key={option.name}
                      type="button"
                      variant={selectedIcon === option.name ? "default" : "outline"}
                      className="h-16 flex flex-col items-center gap-1"
                      onClick={() => setSelectedIcon(option.name)}
                    >
                      <IconComponent size={20} />
                      <span className="text-xs">{option.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {onCreateTag && (
              <TagManager
                availableTags={availableTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                onCreateTag={onCreateTag}
              />
            )}

            <div>
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Define how the assistant should behave..."
                rows={4}
              />
            </div>

            <div>
              <Label>Conversation Starters</Label>
              <div className="space-y-3 mt-2">
                {starters.map((starter, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Starter {index + 1}</span>
                      {starters.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStarter(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Display text (e.g., 'Help me write an email')"
                      value={starter.displayText}
                      onChange={(e) => updateStarter(index, 'displayText', e.target.value)}
                    />
                    <Textarea
                      placeholder="Full prompt (optional - will use display text if empty)"
                      value={starter.fullPrompt}
                      onChange={(e) => updateStarter(index, 'fullPrompt', e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addStarter}
                  className="w-full"
                >
                  Add Another Starter
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
