
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WorkflowTag } from "@/types/workflow";

interface TagManagerProps {
  availableTags: WorkflowTag[];
  selectedTags: WorkflowTag[];
  onTagsChange: (tags: WorkflowTag[]) => void;
  onCreateTag: (tag: { name: string; color: string }) => void;
}

const predefinedColors = [
  "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444",
  "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1"
];

const TagManager = ({ 
  availableTags, 
  selectedTags, 
  onTagsChange, 
  onCreateTag 
}: TagManagerProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  const handleTagToggle = (tag: WorkflowTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag({
        name: newTagName.trim(),
        color: selectedColor
      });
      setNewTagName("");
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Tags</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="h-3 w-3 mr-1" />
          New Tag
        </Button>
      </div>

      {showCreateForm && (
        <div className="border rounded-lg p-3 space-y-3">
          <div>
            <Label htmlFor="tagName" className="text-xs">Tag Name</Label>
            <Input
              id="tagName"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-xs">Color</Label>
            <div className="flex gap-2 mt-1">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
            >
              Create
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCreateForm(false);
                setNewTagName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.some(t => t.id === tag.id);
          return (
            <Badge
              key={tag.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
              onClick={() => handleTagToggle(tag)}
            >
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
              {isSelected && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Badge>
          );
        })}
      </div>

      {selectedTags.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

export default TagManager;
