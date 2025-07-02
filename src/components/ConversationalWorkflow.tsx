import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Download, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ProfileDropdown from "./ProfileDropdown";
import SearchChat from "./SearchChat";
import FormOverlay from "./FormOverlay";
import InlineChatForm from "./InlineChatForm";
import SlideUpFormPanel from "./SlideUpFormPanel";
import ChatMessage from "./ChatMessage";
import ProgressIndicator from "./ProgressIndicator";
import { ConversationalWorkflow as ConversationalWorkflowType, ConversationalStep } from "@/types/workflow";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  type?: "system" | "completion" | "download" | "form";
}

type ChatState = "normal" | "form-inline" | "form-panel" | "form-overlay" | "minimized";
type FormDisplayMode = "auto" | "inline" | "panel" | "overlay";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      content: workflow.initialMessage,
      timestamp: new Date(),
      type: "system"
    },
  ]);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [chatState, setChatState] = useState<ChatState>("normal");
  const [activeStep, setActiveStep] = useState<ConversationalStep | null>(null);
  const [input, setInput] = useState("");
  const [formDisplayMode, setFormDisplayMode] = useState<FormDisplayMode>("auto");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show first step form after initial message
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStepIndex < workflow.steps.length) {
        showStepForm(workflow.steps[currentStepIndex]);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/dashboard");
    }
  };

  const determineFormDisplayMode = (step: ConversationalStep): ChatState => {
    if (formDisplayMode === "inline") return "form-inline";
    if (formDisplayMode === "panel") return "form-panel";
    if (formDisplayMode === "overlay") return "form-overlay";
    
    // Auto mode logic
    const fieldCount = step.fields.length;
    if (fieldCount <= 2) return "form-inline";
    if (fieldCount <= 5) return "form-panel";
    return "form-overlay";
  };

  const showStepForm = (step: ConversationalStep) => {
    setActiveStep(step);
    const displayMode = determineFormDisplayMode(step);
    setChatState(displayMode);
    
    const formMessage: Message = {
      id: `form-${step.id}`,
      sender: "bot",
      content: displayMode === "form-inline" 
        ? `I need some information for "${step.title}". Please fill out the form below:`
        : `I need some information for "${step.title}". Please fill out the form that just appeared.`,
      timestamp: new Date(),
      type: "form"
    };
    
    setMessages(prev => [...prev, formMessage]);
  };

  const handleStepSubmit = (stepId: string, data: Record<string, any>) => {
    // Save step data
    setStepData(prev => ({ ...prev, [stepId]: data }));
    
    // Mark step as complete
    setCompletedSteps(prev => new Set([...prev, stepId]));
    
    // Close form overlay
    setActiveStep(null);
    setChatState("normal");
    
    // Add completion message
    const completionMessage: Message = {
      id: `complete-${stepId}`,
      sender: "bot",
      content: "✅ Perfect! I've saved that information.",
      timestamp: new Date(),
      type: "completion"
    };
    
    setMessages(prev => [...prev, completionMessage]);
    
    // Move to next step or complete workflow
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < workflow.steps.length) {
      setCurrentStepIndex(nextStepIndex);
      
      setTimeout(() => {
        const nextStep = workflow.steps[nextStepIndex];
        showStepForm(nextStep);
      }, 1500);
    } else {
      // Workflow complete
      setTimeout(() => {
        const completionMessage: Message = {
          id: "workflow-complete",
          sender: "bot",
          content: "🎉 Excellent! I have all the information I need. Your Green Stone Report is ready for download!",
          timestamp: new Date(),
          type: "download"
        };
        
        setMessages(prev => [...prev, completionMessage]);
      }, 1500);
    }
  };

  const handleFormClose = () => {
    setActiveStep(null);
    setChatState("normal");
    
    const cancelMessage: Message = {
      id: `cancel-${Date.now()}`,
      sender: "bot",
      content: "No problem! Feel free to ask me anything or let me know when you're ready to continue.",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, cancelMessage]);
  };

  const handleExpandToPanel = () => {
    if (activeStep) {
      setChatState("form-panel");
    }
  };

  const handleChatSubmit = (text: string, files: File[]) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simple bot responses
    setTimeout(() => {
      let botResponse = "I understand. ";
      
      if (currentStepIndex < workflow.steps.length && !activeStep) {
        botResponse += `Would you like to continue with "${workflow.steps[currentStepIndex].title}"?`;
      } else if (isWorkflowComplete) {
        botResponse += "Your report is ready for download!";
      } else {
        botResponse += "How can I help you with this workflow?";
      }
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleDownload = () => {
    const reportContent = `GREEN STONE BRITISH INTERNATIONAL SCHOOL
Student Progress Report

Student Name: ${stepData['student-info']?.studentName || 'N/A'}
Term: ${stepData['student-info']?.term || 'N/A'}
Class Name: ${stepData['student-info']?.className || 'N/A'}
Tutor/Teacher: ${stepData['student-info']?.tutor || 'N/A'}
Days Absent: ${stepData['student-info']?.daysAbsent || 'N/A'}

Report Template: ${stepData['report-template']?.templateUrl || 'Default Template'}

Generated on: ${new Date().toLocaleDateString()}`;

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
  const shouldShowFormInChat = chatState === "form-inline" && activeStep;

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-50 sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="text-xl font-medium panta-gradient-text">
            {workflow.title}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const modes: FormDisplayMode[] = ["auto", "inline", "panel", "overlay"];
                const currentIndex = modes.indexOf(formDisplayMode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                setFormDisplayMode(nextMode);
                toast.success(`Form display mode: ${nextMode}`);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <Settings2 className="h-4 w-4 mr-1" />
              {formDisplayMode}
            </Button>
            <ProfileDropdown name={userName} email="moin@example.com" />
          </div>
        </div>
      </header>
      
      {/* Progress Indicator */}
      <ProgressIndicator 
        steps={workflow.steps}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
      />
      
      {/* Chat Interface */}
      <div className="flex flex-col flex-1 bg-white relative overflow-hidden">
        <div className={`flex-1 flex flex-col relative transition-all duration-500 ease-in-out ${
          chatState === "form-panel" ? "pb-80" : ""
        }`}>
          <ScrollArea className="flex-1 px-4 md:px-16 lg:px-32 xl:px-64 pt-6">
            <div className="space-y-2 mb-8">
              {messages.map((message, index) => (
                <div key={message.id}>
                  <ChatMessage message={message}>
                    {shouldShowFormInChat && 
                     message.type === "form" && 
                     index === messages.length - 1 && 
                     activeStep && (
                      <InlineChatForm
                        step={activeStep}
                        onSubmit={(data) => handleStepSubmit(activeStep.id, data)}
                        onExpand={handleExpandToPanel}
                      />
                    )}
                  </ChatMessage>
                </div>
              ))}
              
              {/* Download Card */}
              {isWorkflowComplete && (
                <div className="flex justify-center">
                  <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Report Ready!</h3>
                      <p className="text-gray-600 mb-4">Your Green Stone student progress report has been generated.</p>
                      <Button 
                        onClick={handleDownload} 
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          {/* Chat Input */}
          <div className={`border-t bg-white transition-all duration-500 ease-in-out ${
            chatState === "form-panel" ? "h-16 opacity-75" : 
            chatState === "form-inline" ? "h-auto opacity-90" : 
            "h-auto opacity-100"
          }`}>
            <div className={`p-4 transition-all duration-300 ${
              chatState === "form-panel" ? "pointer-events-none" : ""
            }`}>
              <SearchChat 
                autoFocus={chatState === "normal"} 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onSubmit={handleChatSubmit}
                disableNavigation={true}
                placeholder={
                  chatState === "form-panel" ? "Complete the form above to continue..." :
                  chatState === "form-inline" ? "Fill the form above or ask a question..." :
                  "Type your message..."
                }
                title=""
              />
            </div>
          </div>
        </div>

        {/* Form Overlays */}
        {activeStep && chatState === "form-overlay" && (
          <FormOverlay
            step={activeStep}
            onSubmit={(data) => handleStepSubmit(activeStep.id, data)}
            onClose={handleFormClose}
            isVisible={true}
          />
        )}

        {activeStep && chatState === "form-panel" && (
          <SlideUpFormPanel
            step={activeStep}
            onSubmit={(data) => handleStepSubmit(activeStep.id, data)}
            onClose={handleFormClose}
            isVisible={true}
          />
        )}

        {/* Close Button */}
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

export default ConversationalWorkflow;
