
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ProfileDropdown from "./ProfileDropdown";
import SearchChat from "./SearchChat";
import ChatMessage from "./ChatMessage";
import { allSkills, findMatchingSkill } from "@/data/skillsData";
import { Skill } from "@/types/skills";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  files?: File[] | string[];
  skillBadge?: string;
}

interface ConversationStarter {
  id: string;
  text: string;
}

interface ChatInterfaceProps {
  onClose?: () => void;
  workflowTitle?: string;
  userName?: string;
  conversationStarters?: ConversationStarter[];
}

const ChatInterface = ({ 
  onClose, 
  workflowTitle = "Chat Assistant",
  userName = "Moin Arian",
  conversationStarters = [
    { id: "1", text: "Generate a marketing strategy for my business" },
    { id: "2", text: "Help me draft an email to a client" },
    { id: "3", text: "Summarize this article for me" },
    { id: "4", text: "Create a to-do list for my project" }
  ]
}: ChatInterfaceProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "bot-1",
      sender: "bot",
      content: "Hey there! 👋 What's on your mind today?",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [showStarters, setShowStarters] = useState(false);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [skillParams, setSkillParams] = useState<Record<string, string>>({});
  const [collectingParams, setCollectingParams] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/dashboard");
    }
  };
  
  const executeSkill = (skill: Skill, params: Record<string, string>) => {
    // Simulate skill execution
    const processingMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      content: `⚙️ Skill **"${skill.name}"** wird ausgeführt...`,
      timestamp: new Date(),
      skillBadge: skill.name,
    };
    setMessages(prev => [...prev, processingMsg]);

    setTimeout(() => {
      let resultContent = "";
      
      if (skill.triggers.slashCommand === "/weekly-summary") {
        resultContent = `## 📊 Wöchentliche Zusammenfassung\n\n### E-Mails\n- 23 neue E-Mails, 5 erfordern Antwort\n- Wichtigster Thread: Projektfreigabe Q2 mit Lisa Weber\n\n### Meetings\n- 8 Meetings letzte Woche\n- Wichtigste Entscheidung: Budget für neues Tool genehmigt\n- 3 offene Action Items\n\n### Offene Aufgaben\n- PR Review für Frontend-Release\n- Feedback zu Marketing-Entwurf\n- Quartalsplanung vorbereiten`;
      } else if (skill.triggers.slashCommand === "/meeting-prep") {
        resultContent = `## 📅 Meeting-Vorbereitung\n\n**Nächstes Meeting:** Product Sync (14:00)\n\n### Teilnehmer\n- Sarah Mueller (Engineering Lead)\n- Thomas Klein (PM)\n\n### Letzte Kommunikation\n- E-Mail von Sarah: Deployment-Timeline verschoben\n- Slack: Thomas fragt nach Feature-Priorisierung\n\n### Empfohlene Agenda\n1. Deployment-Status Update\n2. Feature-Backlog Review\n3. Q2 Roadmap Alignment`;
      } else if (skill.triggers.slashCommand === "/email-draft") {
        const recipient = params.recipient || "Empfänger";
        const topic = params.topic || "Thema";
        resultContent = `## ✉️ E-Mail-Entwurf\n\n**An:** ${recipient}\n**Betreff:** ${topic}\n\n---\n\nSehr geehrte/r ${recipient},\n\nvielen Dank für Ihre Nachricht bezüglich "${topic}". Ich möchte gerne die nächsten Schritte besprechen.\n\n[Hier könnte der Hauptinhalt stehen]\n\nMit freundlichen Grüßen,\nMoin Arian\n\n---\n*Möchtest du Anpassungen vornehmen oder die E-Mail direkt senden?*`;
      } else {
        resultContent = `## ✅ ${skill.name}\n\nSkill wurde erfolgreich ausgeführt. Hier sind die Ergebnisse:\n\n${skill.description}\n\n*Ergebnis basiert auf Mock-Daten. Im produktiven Betrieb werden echte Datenquellen angebunden.*`;
      }

      const resultMsg: Message = {
        id: `bot-${Date.now() + 1}`,
        sender: "bot",
        content: resultContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, resultMsg]);
    }, 1500);
  };

  const handleSkillDetected = (skill: Skill) => {
    setActiveSkill(skill);
    
    const requiredParams = skill.parameters.filter(p => p.required);
    if (requiredParams.length > 0) {
      setCollectingParams(true);
      setSkillParams({});
      
      const paramMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: `🔧 Skill **"${skill.name}"** erkannt. Ich brauche noch ein paar Angaben:`,
        timestamp: new Date(),
        skillBadge: skill.name,
      };
      setMessages(prev => [...prev, paramMsg]);
    } else {
      executeSkill(skill, {});
    }
  };

  const handleParamSubmit = () => {
    if (!activeSkill) return;
    setCollectingParams(false);
    
    const paramSummary = Object.entries(skillParams)
      .map(([key, val]) => `**${key}:** ${val}`)
      .join("\n");
    
    const userParamMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: paramSummary || "Parameter übermittelt",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userParamMsg]);
    
    executeSkill(activeSkill, skillParams);
    setActiveSkill(null);
    setSkillParams({});
  };

  const handleStarterClick = (text: string) => {
    setInput(text);
    setShowStarters(false);
    
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      const botReply: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: "I'm processing your request. Here's what I can help you with...",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botReply]);
    }, 1000);
  };

  const handleSubmit = (text: string, files: File[]) => {
    setShowStarters(false);
    
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date(),
      files: files.length > 0 ? files : undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    
    // Check for skill match
    const matchedSkill = findMatchingSkill(text, allSkills);
    if (matchedSkill) {
      handleSkillDetected(matchedSkill);
      return;
    }
    
    // Normal chat response
    setTimeout(() => {
      const botReply: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: "I'm here to help! What would you like to know about?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botReply]);
    }, 1000);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <header className="bg-white shadow-sm z-10 sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          
          <div className="text-xl font-medium panta-gradient-text">
            {workflowTitle}
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
            <div className="space-y-2 mb-8">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.skillBadge && message.sender === "bot" && (
                    <div className="flex items-center gap-1.5 mb-1 ml-1">
                      <Zap className="w-3 h-3 text-primary" />
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                        Skill: {message.skillBadge}
                      </Badge>
                    </div>
                  )}
                  <ChatMessage message={message} />
                </div>
              ))}
            </div>

            {/* Inline parameter collection */}
            {collectingParams && activeSkill && (
              <div className="mb-6 mx-auto max-w-md p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{activeSkill.name}</span>
                </div>
                <div className="space-y-3">
                  {activeSkill.parameters.map(param => (
                    <div key={param.id} className="space-y-1">
                      <Label className="text-xs">{param.label}{param.required && " *"}</Label>
                      {param.type === "select" && param.options ? (
                        <Select
                          value={skillParams[param.label] || ""}
                          onValueChange={v => setSkillParams(prev => ({ ...prev, [param.label]: v }))}
                        >
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Auswählen..." /></SelectTrigger>
                          <SelectContent>
                            {param.options.map(opt => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : param.type === "textarea" ? (
                        <Textarea
                          value={skillParams[param.label] || ""}
                          onChange={e => setSkillParams(prev => ({ ...prev, [param.label]: e.target.value }))}
                          placeholder={param.placeholder}
                          rows={3}
                          className="text-xs"
                        />
                      ) : (
                        <Input
                          value={skillParams[param.label] || ""}
                          onChange={e => setSkillParams(prev => ({ ...prev, [param.label]: e.target.value }))}
                          placeholder={param.placeholder}
                          className="h-8 text-xs"
                        />
                      )}
                    </div>
                  ))}
                  <Button size="sm" onClick={handleParamSubmit} className="w-full mt-2">
                    Ausführen
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
          
          <div className="border-t p-4 bg-white">
            <SearchChat 
              autoFocus={true} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onSubmit={handleSubmit}
              disableNavigation={true}
              placeholder="Message..."
              title=""
              showSkillAutocomplete={true}
            />
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            className="rounded-full hover:bg-black hover:text-white"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
