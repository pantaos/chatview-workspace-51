
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
                      <DropdownMenuSubTrigger className="cursor-pointer hover:bg-black hover:text-white">
                        <Tag className="mr-2 h-4 w-4" />
                        <span>Tags</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-56 bg-background z-50 p-2">
                        <div className="flex flex-wrap gap-1.5">
                          {availableTags.map((tag) => {
                            const isSelected = selectedTags.includes(tag.id);
                            return (
                              <button
                                key={tag.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onTagToggle(tag.id);
                                }}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-black text-xs transition-colors ${
                                  isSelected 
                                    ? 'bg-black text-white' 
                                    : 'bg-background hover:bg-black hover:text-white'
                                }`}
                              >
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: tag.color }}
                                />
                                <span>{tag.name}</span>
                              </button>
                            );
                          })}
                        </div>
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
