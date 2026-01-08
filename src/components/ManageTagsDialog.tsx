import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { WorkflowTag } from "@/types/workflow";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ManageTagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: WorkflowTag[];
  onCreateTag: (tag: { name: string; color: string }) => void;
  onDeleteTag: (tagId: string) => void;
}

const predefinedColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F97316", // Orange
  "#14B8A6", // Teal
];

const ManageTagsDialog = ({
  open,
  onOpenChange,
  tags,
  onCreateTag,
  onDeleteTag,
}: ManageTagsDialogProps) => {
  const isMobile = useIsMobile();
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag({
        name: newTagName.trim(),
        color: selectedColor
      });
      setNewTagName("");
      setSelectedColor(predefinedColors[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagName.trim()) {
      handleCreateTag();
    }
  };

  const content = (
    <div className="space-y-6">
      {/* New Tag Section */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-foreground">New Tag</Label>
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter tag name"
          className="border-2 border-primary/20 focus:border-primary"
        />
        
        <div>
          <Label className="text-sm font-medium text-foreground">Select Color</Label>
          <div className="flex gap-3 mt-2 flex-wrap">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-10 h-10 rounded-full transition-all ${
                  selectedColor === color 
                    ? 'ring-2 ring-offset-2 ring-foreground scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleCreateTag}
          disabled={!newTagName.trim()}
          className="bg-primary/20 text-primary hover:bg-primary/30"
        >
          Create Tag
        </Button>
      </div>

      {/* Your Tags Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Your Tags</Label>
        <div className="space-y-2">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No tags created yet
            </p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{tag.name}</span>
                </div>
                <button
                  onClick={() => onDeleteTag(tag.id)}
                  className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[85vh] max-h-[85vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Manage Tags</DrawerTitle>
            <p className="text-sm text-muted-foreground">
              Create and manage tags to organize your assistants and workflows.
            </p>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Create and manage tags to organize your assistants and workflows.
          </p>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTagsDialog;
