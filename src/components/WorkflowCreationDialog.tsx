import React, { useState } from "react";
import { MessageSquare, Workflow, Bot, Settings, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewWorkflowDialog from "./NewWorkflowDialog";
import WorkflowBuilderDialog from "./WorkflowBuilderDialog";
import { WorkflowTag } from "@/types/workflow";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkflowCreationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateWorkflow: (workflow: any) => void;
  availableTags?: WorkflowTag[];
  onCreateTag?: (tag: { name: string; color: string }) => void;
}

const WorkflowCreationDialog = ({
  open,
  onClose,
  onCreateWorkflow,
  availableTags = [],
  onCreateTag,
}: WorkflowCreationDialogProps) => {
  const [selectedType, setSelectedType] = useState<'assistant' | 'workflow' | null>(null);

  const handleTypeSelect = (type: 'assistant' | 'workflow') => {
    setSelectedType(type);
  };

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  const handleWorkflowCreate = (workflow: any) => {
    onCreateWorkflow(workflow);
    handleClose();
  };

  if (selectedType === 'assistant') {
    return (
      <NewWorkflowDialog
        open={true}
        onClose={handleClose}
        onCreateWorkflow={handleWorkflowCreate}
        availableTags={availableTags}
        onCreateTag={onCreateTag}
      />
    );
  }

  if (selectedType === 'workflow') {
    return (
      <WorkflowBuilderDialog
        open={true}
        onClose={handleClose}
        onCreateWorkflow={handleWorkflowCreate}
        availableTags={availableTags}
        onCreateTag={onCreateTag}
      />
    );
  }

  const isMobile = useIsMobile();

  const content = (
    <div className="grid grid-cols-1 gap-4 p-4 md:p-6">
      <Card 
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={() => handleTypeSelect('assistant')}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-lg">Assistant</CardTitle>
          <CardDescription>
            Create a chat-based AI assistant with custom prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Custom system prompts</li>
            <li>• Conversation starters</li>
            <li>• Real-time chat interface</li>
          </ul>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={() => handleTypeSelect('workflow')}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Settings className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-lg">Workflow</CardTitle>
          <CardDescription>
            Build a multi-step process with custom forms
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Multiple steps</li>
            <li>• Custom input fields</li>
            <li>• Text editors & downloads</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
            <div>
              <h2 className="text-base font-semibold">Create New Workflow</h2>
              <p className="text-xs text-muted-foreground">Choose type</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Choose the type of workflow you want to create.
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowCreationDialog;
