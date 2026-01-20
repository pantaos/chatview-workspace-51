import { useState } from "react";
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2, Settings } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowStepConfig, WorkflowFieldConfig } from "@/data/workflows";

interface WorkflowStepEditorProps {
  step: WorkflowStepConfig;
  stepIndex: number;
  onUpdate: (step: WorkflowStepConfig) => void;
  onDelete: () => void;
}

const WorkflowStepEditor = ({ step, stepIndex, onUpdate, onDelete }: WorkflowStepEditorProps) => {
  const [isOpen, setIsOpen] = useState(stepIndex === 0);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const handleTitleChange = (title: string) => {
    onUpdate({ ...step, title });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate({ ...step, description });
  };

  const handlePromptChange = (prompt: string) => {
    onUpdate({ ...step, prompt });
  };

  const handleFieldChange = (fieldId: string, updates: Partial<WorkflowFieldConfig>) => {
    const updatedFields = step.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onUpdate({ ...step, fields: updatedFields });
  };

  const handleAddField = () => {
    const newField: WorkflowFieldConfig = {
      id: `field-${Date.now()}`,
      name: `field_${step.fields.length + 1}`,
      label: `Neues Feld ${step.fields.length + 1}`,
      type: 'text',
      placeholder: '',
      required: false
    };
    onUpdate({ ...step, fields: [...step.fields, newField] });
    setEditingFieldId(newField.id);
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedFields = step.fields.filter(field => field.id !== fieldId);
    onUpdate({ ...step, fields: updatedFields });
  };

  return (
    <Card className="border border-border bg-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  Schritt {stepIndex + 1}: {step.title}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {step.fields.length} Felder
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4 space-y-6">
            {/* Step Info */}
            <div className="grid gap-4 pl-7">
              <div className="grid gap-2">
                <Label htmlFor={`step-title-${step.id}`}>Schritt-Name</Label>
                <Input
                  id={`step-title-${step.id}`}
                  value={step.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="z.B. Eingabe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`step-desc-${step.id}`}>Beschreibung</Label>
                <Input
                  id={`step-desc-${step.id}`}
                  value={step.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Kurze Beschreibung des Schritts"
                />
              </div>
            </div>

            {/* Prompt Editor */}
            <div className="pl-7">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-primary" />
                <Label htmlFor={`step-prompt-${step.id}`} className="font-medium">System-Prompt</Label>
              </div>
              <Textarea
                id={`step-prompt-${step.id}`}
                value={step.prompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder="Der System-Prompt für diesen Schritt..."
                className="min-h-[120px] font-mono text-sm"
              />
            </div>

            {/* Fields */}
            <div className="pl-7">
              <div className="flex items-center justify-between mb-3">
                <Label className="font-medium">Eingabefelder</Label>
                <Button variant="outline" size="sm" onClick={handleAddField}>
                  <Plus className="h-3 w-3 mr-1" />
                  Feld hinzufügen
                </Button>
              </div>

              <div className="space-y-3">
                {step.fields.map((field, fieldIndex) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5 cursor-grab" />
                    
                    <div className="flex-1 grid gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-muted-foreground">Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => handleFieldChange(field.id, { label: e.target.value })}
                            placeholder="Feld-Label"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-muted-foreground">Typ</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value) => handleFieldChange(field.id, { type: value as WorkflowFieldConfig['type'] })}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="textarea">Textbereich</SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                              <SelectItem value="file">Datei</SelectItem>
                              <SelectItem value="select">Auswahl</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid gap-1.5">
                        <Label className="text-xs text-muted-foreground">Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => handleFieldChange(field.id, { placeholder: e.target.value })}
                          placeholder="Platzhalter-Text"
                          className="h-8 text-sm"
                        />
                      </div>

                      {field.type === 'select' && (
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-muted-foreground">Optionen (kommagetrennt)</Label>
                          <Input
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => handleFieldChange(field.id, { 
                              options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) 
                            })}
                            placeholder="Option 1, Option 2, Option 3"
                            className="h-8 text-sm"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${field.id}`}
                          checked={field.required || false}
                          onChange={(e) => handleFieldChange(field.id, { required: e.target.checked })}
                          className="rounded border-border"
                        />
                        <Label htmlFor={`required-${field.id}`} className="text-xs text-muted-foreground">
                          Pflichtfeld
                        </Label>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {step.fields.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    Keine Felder vorhanden. Klicke auf "Feld hinzufügen" um ein neues Feld zu erstellen.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default WorkflowStepEditor;
