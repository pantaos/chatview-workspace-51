
import React, { useState } from "react";
import { MessageSquare, Workflow, Bot, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewWorkflowDialog from "./NewWorkflowDialog";
import WorkflowBuilderDialog from "./WorkflowBuilderDialog";
import { WorkflowTag } from "@/types/workflow";

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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Choose the type of workflow you want to create.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
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
                Create a chat-based AI assistant with custom prompts and conversation starters
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-gray-600 space-y-1">
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
                Build a multi-step process with custom forms, editors, and outputs
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multiple steps</li>
                <li>• Custom input fields</li>
                <li>• Text editors & downloads</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowCreationDialog;
