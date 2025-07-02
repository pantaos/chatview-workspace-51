
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Download, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ProfileDropdown from "./ProfileDropdown";
import SearchChat from "./SearchChat";
import FormOverlay from "./FormOverlay";
import ProgressIndicator from "./ProgressIndicator";
import { ConversationalWorkflow as ConversationalWorkflowType, ConversationalStep } from "@/types/workflow";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  type?: "system" | "completion" | "download";
}

type ChatState = "normal" | "form-active" | "minimized";

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

  const showStepForm = (step: ConversationalStep) => {
    setActiveStep(step);
    setChatState("form-active");
    
    const formMessage: Message = {
      id: `form-${step.id}`,
      sender: "bot",
      content: `I need some information for "${step.title}". Please fill out the form that just appeared.`,
      timestamp: new Date()
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

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-10 sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="text-xl font-medium panta-gradient-text">
            {workflow.title}
          </div>
          <div className="flex items-center gap-3">
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
      <div className="flex flex-col flex-1 bg-white relative">
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <ScrollArea className="flex-1 px-4 md:px-16 lg:px-32 xl:px-64 pt-6">
            <div className="space-y-6 mb-8">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${message.sender === "user" ? "ml-auto" : "mr-auto"}`}>
                    <div className="flex items-start gap-3">
                      {message.sender === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div className={`rounded-2xl p-4 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : message.type === "system"
                          ? "bg-blue-50 text-blue-900 border border-blue-200"
                          : message.type === "completion"
                          ? "bg-green-50 text-green-900 border border-green-200"
                          : "bg-gray-50 text-gray-800 border"
                      }`}>
                        <p className="text-base leading-relaxed">{message.content}</p>
                      </div>
                      
                      {message.sender === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
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
            chatState === "form-active" ? "h-16 opacity-50" : "h-auto opacity-100"
          }`}>
            <div className={`p-4 transition-all duration-300 ${
              chatState === "form-active" ? "pointer-events-none" : ""
            }`}>
              <SearchChat 
                autoFocus={chatState === "normal"} 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onSubmit={handleChatSubmit}
                disableNavigation={true}
                placeholder={chatState === "form-active" ? "Please complete the form above..." : "Type your message..."}
                title=""
              />
            </div>
          </div>
        </div>

        {/* Form Overlay */}
        {activeStep && (
          <FormOverlay
            step={activeStep}
            onSubmit={(data) => handleStepSubmit(activeStep.id, data)}
            onClose={handleFormClose}
            isVisible={chatState === "form-active"}
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
