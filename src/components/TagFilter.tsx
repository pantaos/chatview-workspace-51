
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { WorkflowTag } from "@/types/workflow";

interface TagFilterProps {
  tags: WorkflowTag[];
  selectedTags: string[];
  onTagSelect: (tagId: string) => void;
  onTagRemove: (tagId: string) => void;
  onClearAll: () => void;
}

const TagFilter = ({
  tags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onClearAll,
}: TagFilterProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="text-white hover:bg-white/20"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
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
              }`}
              onClick={() => 
                isSelected ? onTagRemove(tag.id) : onTagSelect(tag.id)
              }
            >
              <div 
                className={`w-2 h-2 rounded-full mr-2 ${tag.color}`}
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
    </div>
  );
};

export default TagFilter;
