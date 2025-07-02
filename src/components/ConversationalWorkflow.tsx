
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ProfileDropdown from "./ProfileDropdown";
import { ConversationalWorkflow as ConversationalWorkflowType, ConversationalStep } from "@/types/workflow";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  step?: ConversationalStep;
  isStepComplete?: boolean;
}

interface ConversationalWorkflowProps {
  workflow: ConversationalWorkflowType;
  onClose?: () => void;
  userName?: string;
}

const ConversationalWorkflow = ({ 
  workflow,
  onClose, 
  userName = "Moin Arian"
}: ConversationalWorkflowProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "bot-1",
      sender: "bot",
      content: workflow.initialMessage,
      timestamp: new Date(),
      step: workflow.steps[0]
    },
  ]);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/dashboard");
    }
  };

  const handleStepSubmit = (stepId: string, data: Record<string, any>) => {
    // Save step data
    setStepData(prev => ({ ...prev, [stepId]: data }));
    
    // Mark step as complete
    setCompletedSteps(prev => new Set([...prev, stepId]));
    
    // Add completion message
    const completionMessage: Message = {
      id: `step-complete-${Date.now()}`,
      sender: "bot",
      content: "✅ Step completed successfully!",
      timestamp: new Date(),
      isStepComplete: true
    };
    
    setMessages(prev => [...prev, completionMessage]);
    
    // Move to next step or complete workflow
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < workflow.steps.length) {
      setCurrentStepIndex(nextStepIndex);
      const nextStep = workflow.steps[nextStepIndex];
      
      setTimeout(() => {
        const nextStepMessage: Message = {
          id: `step-${nextStepIndex}`,
          sender: "bot",
          content: nextStep.description,
          timestamp: new Date(),
          step: nextStep
        };
        
        setMessages(prev => [...prev, nextStepMessage]);
      }, 1000);
    } else {
      // Workflow complete
      setTimeout(() => {
        const completionMessage: Message = {
          id: `workflow-complete-${Date.now()}`,
          sender: "bot",
          content: "🎉 Your report is ready! Download it below.",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, completionMessage]);
      }, 1000);
    }
  };

  const handleDownload = () => {
    // Generate report content based on collected data
    const reportContent = `
GREEN STONE BRITISH INTERNATIONAL SCHOOL
Student Progress Report

Student Name: ${stepData['student-info']?.studentName || 'N/A'}
Term: ${stepData['student-info']?.term || 'N/A'}
Class Name: ${stepData['student-info']?.className || 'N/A'}
Tutor/Teacher: ${stepData['student-info']?.tutor || 'N/A'}
Days Absent: ${stepData['student-info']?.daysAbsent || 'N/A'}

Report Template: ${stepData['report-template']?.templateUrl || 'Default Template'}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stepData['student-info']?.studentName || 'Student'}_Progress_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Report downloaded successfully!");
  };

  const isWorkflowComplete = completedSteps.size === workflow.steps.length;

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <header className="bg-white shadow-sm z-10 sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          
          <div className="text-xl font-medium panta-gradient-text">
            {workflow.title}
          </div>
          
          <div className="flex items-center gap-3">
            <ProfileDropdown 
              name={userName} 
              email="moin@example.com"
            />
          </div>
        </div>
      </header>
      
      {/* Chat Interface */}
      <div className="flex flex-col h-[calc(100vh-5rem)] bg-white relative">
        <div className="flex-1 flex flex-col relative">
          <ScrollArea className="flex-1 px-4 md:px-16 lg:px-32 xl:px-64 pt-6">
            <div className="space-y-8 mb-8">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] mr-auto">
                      <div className="rounded-2xl p-4 bg-white text-gray-800 border">
                        <p className="text-base leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                  
                  {message.step && !completedSteps.has(message.step.id) && (
                    <StepForm 
                      step={message.step} 
                      onSubmit={(data) => handleStepSubmit(message.step!.id, data)}
                    />
                  )}
                  
                  {message.isStepComplete && (
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Step Completed</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isWorkflowComplete && (
                <div className="flex justify-center">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Completed Report</h3>
                      <p className="text-green-700 mb-4">Your report is ready. Download it below.</p>
                      <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download Completed Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            className="rounded-full hover:bg-black hover:text-white"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close workflow</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

interface StepFormProps {
  step: ConversationalStep;
  onSubmit: (data: Record<string, any>) => void;
}

const StepForm = ({ step, onSubmit }: StepFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{step.title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={field.id}
                type={field.type === 'url' ? 'url' : 'text'}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
              />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConversationalWorkflow;
