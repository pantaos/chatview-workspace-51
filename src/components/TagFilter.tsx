
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { WorkflowTag } from "@/types/workflow";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
      </div>
    </div>
  );
};

export default TagFilter;
