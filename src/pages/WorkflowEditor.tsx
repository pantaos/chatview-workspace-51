import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Settings, Eye, FileText, TrendingUp, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import MainLayout from "@/components/MainLayout";
import WorkflowStepEditor from "@/components/workflow-editor/WorkflowStepEditor";
import { getWorkflowConfig, WorkflowConfig, WorkflowStepConfig } from "@/data/workflows";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  GraduationCap: <GraduationCap className="h-5 w-5" />,
};

const WorkflowEditor = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<WorkflowConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("steps");

  useEffect(() => {
    if (workflowId) {
      const config = getWorkflowConfig(workflowId);
      if (config) {
        setWorkflow({ ...config });
      }
    }
  }, [workflowId]);

  if (!workflow) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Workflow nicht gefunden</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
            Zurück zum Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast.success("Workflow gespeichert", {
      description: `${workflow.name} wurde erfolgreich aktualisiert.`
    });
    setHasChanges(false);
  };

  const handleWorkflowUpdate = (updates: Partial<WorkflowConfig>) => {
    setWorkflow(prev => prev ? { ...prev, ...updates } : null);
    setHasChanges(true);
  };

  const handleStepUpdate = (stepId: string, updatedStep: WorkflowStepConfig) => {
    if (!workflow) return;
    const updatedSteps = workflow.steps.map(step =>
      step.id === stepId ? updatedStep : step
    );
    handleWorkflowUpdate({ steps: updatedSteps });
  };

  const handleDeleteStep = (stepId: string) => {
    if (!workflow) return;
    const updatedSteps = workflow.steps.filter(step => step.id !== stepId);
    handleWorkflowUpdate({ steps: updatedSteps });
  };

  const handleAddStep = () => {
    if (!workflow) return;
    const newStep: WorkflowStepConfig = {
      id: `step-${Date.now()}`,
      title: `Neuer Schritt ${workflow.steps.length + 1}`,
      description: "Beschreibung für diesen Schritt",
      prompt: "System-Prompt für diesen Schritt...",
      fields: []
    };
    handleWorkflowUpdate({ steps: [...workflow.steps, newStep] });
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-5xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                Apps anpassen
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{workflow.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {iconMap[workflow.icon] || <Settings className="h-5 w-5" />}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">{workflow.name}</h1>
                <p className="text-sm text-muted-foreground">{workflow.description}</p>
              </div>
            </div>
          </div>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-6 ml-[52px]">
          {workflow.tags.map(tag => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-0 md:ml-[52px]">
          <TabsList className="mb-6">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              Allgemein
            </TabsTrigger>
            <TabsTrigger value="steps">
              <FileText className="h-4 w-4 mr-2" />
              Schritte ({workflow.steps.length})
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Vorschau
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow-Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="workflow-name">Name</Label>
                  <Input
                    id="workflow-name"
                    value={workflow.name}
                    onChange={(e) => handleWorkflowUpdate({ name: e.target.value })}
                    placeholder="Workflow-Name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="workflow-description">Beschreibung</Label>
                  <Textarea
                    id="workflow-description"
                    value={workflow.description}
                    onChange={(e) => handleWorkflowUpdate({ description: e.target.value })}
                    placeholder="Beschreibung des Workflows"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Steps Tab */}
          <TabsContent value="steps" className="space-y-4">
            {workflow.steps.map((step, index) => (
              <WorkflowStepEditor
                key={step.id}
                step={step}
                stepIndex={index}
                onUpdate={(updatedStep) => handleStepUpdate(step.id, updatedStep)}
                onDelete={() => handleDeleteStep(step.id)}
              />
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={handleAddStep}
            >
              <Plus className="h-4 w-4 mr-2" />
              Neuen Schritt hinzufügen
            </Button>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow-Vorschau</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {step.fields.map(field => (
                            <Badge key={field.id} variant="outline" className="text-xs">
                              {field.label}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Letzte Aktualisierung: {new Date(workflow.updatedAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default WorkflowEditor;
