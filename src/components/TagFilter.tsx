
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { WorkflowTag } from "@/types/workflow";
import { useIsMobile } from "@/hooks/use-mobile";

interface TagFilterProps {
  tags: WorkflowTag[];
  selectedTags: string[];
  onTagSelect: (tagId: string) => void;
  onTagRemove: (tagId: string) => void;
  onClearAll: () => void;
  onCreateTag?: (tag: { name: string; color: string }) => void;
}

const predefinedColors = [
  "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444",
  "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1"
];

const TagFilter = ({
  tags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onClearAll,
  onCreateTag,
}: TagFilterProps) => {
  const isMobile = useIsMobile();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  const handleCreateTag = () => {
    if (newTagName.trim() && onCreateTag) {
      onCreateTag({
        name: newTagName.trim(),
        color: selectedColor
      });
      setNewTagName("");
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-white`}>
          {isMobile ? 'Tags' : 'Filter by Tags'}
        </h3>
        {selectedTags.length > 0 && (
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "sm"}
            onClick={onClearAll}
            className={`text-white hover:bg-white/20 ${isMobile ? 'text-xs px-2 py-1' : ''}`}
          >
            {isMobile ? 'Clear' : 'Clear All'}
          </Button>
        )}
      </div>

      {showCreateForm && onCreateTag && (
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-3 space-y-3">
          <div>
            <Label htmlFor="tagName" className="text-xs text-white">Tag Name</Label>
            <Input
              id="tagName"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="mt-1 bg-white/10 border-white/30 text-white placeholder:text-white/60"
            />
          </div>
          
          <div>
            <Label className="text-xs text-white">Color</Label>
            <div className="flex gap-2 mt-1">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color ? 'border-white' : 'border-white/30'
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
              className="bg-white text-black hover:bg-white/90"
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
              className="border-white/30 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <div className={`flex flex-wrap ${isMobile ? 'gap-1' : 'gap-2'}`}>
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <Badge
              key={tag.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                isSelected 
                  ? "bg-white text-black hover:bg-gray-100" 
                  : "text-white border-white/30 hover:bg-white/20"
              } ${isMobile ? 'text-xs px-2 py-1' : ''}`}
              onClick={() => 
                isSelected ? onTagRemove(tag.id) : onTagSelect(tag.id)
              }
            >
              <div 
                className={`w-2 h-2 rounded-full ${isMobile ? 'mr-1' : 'mr-2'}`}
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
              {isSelected && (
                <X className={`${isMobile ? 'h-2 w-2 ml-0.5' : 'h-3 w-3 ml-1'}`} />
              )}
            </Badge>
          );
        })}
        
        {onCreateTag && (
          <Badge
            variant="outline"
            className={`cursor-pointer transition-colors text-white border-white/30 hover:bg-white/20 ${isMobile ? 'text-xs px-2 py-1' : ''}`}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus className={`${isMobile ? 'h-2 w-2 mr-0.5' : 'h-3 w-3 mr-1'}`} />
            {isMobile ? 'New' : 'New Tag'}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TagFilter;
