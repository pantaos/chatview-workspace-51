
import React from 'react';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Settings, SlidersHorizontal, Tag } from "lucide-react";
import { WorkflowTag } from "@/types/workflow";
import { Checkbox } from "@/components/ui/checkbox";

interface WorkflowMenuProps {
  onEdit: () => void;
  onSettings: () => void;
  onDelete: () => void;
  availableTags?: WorkflowTag[];
  selectedTags?: string[];
  onTagToggle?: (tagId: string) => void;
}

// This component provides both a context menu (right-click) and a dropdown menu (three dots)
const WorkflowMenu = ({ 
  onEdit, 
  onSettings, 
  onDelete, 
  availableTags = [], 
  selectedTags = [], 
  onTagToggle 
}: WorkflowMenuProps) => {
  console.log('WorkflowMenu render:', { availableTags, selectedTags, hasOnTagToggle: !!onTagToggle });
  return (
    <div className="flex">
      <ContextMenu>
        <ContextMenuTrigger className="w-full h-full">
          <div className="w-full h-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-black cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background z-50">
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-black hover:text-white"
                  onClick={onEdit}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Workflow</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-black hover:text-white"
                  onClick={onSettings}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <span>Workflow Settings</span>
                </DropdownMenuItem>
                {availableTags.length > 0 && onTagToggle && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer">
                        <Tag className="mr-2 h-4 w-4" />
                        <span>Tags</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-48 bg-background z-50">
                        {availableTags.map((tag) => (
                          <DropdownMenuItem
                            key={tag.id}
                            className="cursor-pointer hover:bg-accent"
                            onClick={(e) => {
                              e.preventDefault();
                              onTagToggle(tag.id);
                            }}
                          >
                            <Checkbox
                              checked={selectedTags.includes(tag.id)}
                              className="mr-2"
                            />
                            <div
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span>{tag.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 hover:bg-black hover:text-white"
                  onClick={onDelete}
                >
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem className="cursor-pointer" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Workflow</span>
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer" onClick={onSettings}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <span>Workflow Settings</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="cursor-pointer text-red-500" onClick={onDelete}>
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default WorkflowMenu;
