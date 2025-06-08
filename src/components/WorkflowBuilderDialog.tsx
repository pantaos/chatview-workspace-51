
import React, { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowStep, WorkflowField } from "@/types/workflow";

interface WorkflowBuilderDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateWorkflow: (workflow: any) => void;
}

const WorkflowBuilderDialog = ({
  open,
  onClose,
  onCreateWorkflow,
}: WorkflowBuilderDialogProps) => {
  const [workflowData, setWorkflowData] = useState({
    title: "",
    description: "",
    selectedIcon: "FileText",
    steps: [] as WorkflowStep[],
  });

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: "",
      type: 'input',
      fields: [],
    };
    
    setWorkflowData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const updateStep = (stepIndex: number, updates: Partial<WorkflowStep>) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex ? { ...step, ...updates } : step
      )
    }));
  };

  const addField = (stepIndex: number) => {
    const newField: WorkflowField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: "",
      required: false,
    };

    updateStep(stepIndex, {
      fields: [...(workflowData.steps[stepIndex].fields || []), newField]
    });
  };

  const updateField = (stepIndex: number, fieldIndex: number, updates: Partial<WorkflowField>) => {
    const updatedFields = [...(workflowData.steps[stepIndex].fields || [])];
    updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], ...updates };
    updateStep(stepIndex, { fields: updatedFields });
  };

  const removeStep = (stepIndex: number) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, index) => index !== stepIndex)
    }));
  };

  const removeField = (stepIndex: number, fieldIndex: number) => {
    const updatedFields = workflowData.steps[stepIndex].fields?.filter((_, index) => index !== fieldIndex) || [];
    updateStep(stepIndex, { fields: updatedFields });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateWorkflow({
      ...workflowData,
      type: 'workflow',
      tags: [],
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Build a multi-step workflow with custom fields and actions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Workflow Name</Label>
              <Input
                id="title"
                value={workflowData.title}
                onChange={(e) => setWorkflowData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="E.g., Document Generator"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={workflowData.description}
                onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Briefly describe what this workflow does"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Workflow Steps</Label>
                <Button type="button" onClick={addStep} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>

              {workflowData.steps.map((step, stepIndex) => (
                <Card key={step.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Step {stepIndex + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(stepIndex)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Step Name</Label>
                        <Input
                          value={step.name}
                          onChange={(e) => updateStep(stepIndex, { name: e.target.value })}
                          placeholder="E.g., Input Information"
                        />
                      </div>
                      <div>
                        <Label>Step Type</Label>
                        <Select 
                          value={step.type} 
                          onValueChange={(value: 'input' | 'editor' | 'download') => 
                            updateStep(stepIndex, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="input">Input Fields</SelectItem>
                            <SelectItem value="editor">Text Editor</SelectItem>
                            <SelectItem value="download">Download</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {step.type === 'input' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Fields</Label>
                          <Button 
                            type="button" 
                            onClick={() => addField(stepIndex)} 
                            size="sm" 
                            variant="outline"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Field
                          </Button>
                        </div>
                        {step.fields?.map((field, fieldIndex) => (
                          <div key={field.id} className="border rounded p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Field {fieldIndex + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeField(stepIndex, fieldIndex)}
                                className="text-red-500 hover:text-red-600 h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                value={field.label}
                                onChange={(e) => updateField(stepIndex, fieldIndex, { label: e.target.value })}
                                placeholder="Field label"
                              />
                              <Select 
                                value={field.type} 
                                onValueChange={(value: WorkflowField['type']) => 
                                  updateField(stepIndex, fieldIndex, { type: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text Input</SelectItem>
                                  <SelectItem value="textarea">Text Area</SelectItem>
                                  <SelectItem value="url">URL Input</SelectItem>
                                  <SelectItem value="file">File Upload</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={workflowData.steps.length === 0}>
              Create Workflow
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowBuilderDialog;
