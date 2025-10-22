
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ProfileDropdown from "./ProfileDropdown";
import SearchChat from "./SearchChat";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  files?: File[] | string[];
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

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/dashboard");
    }
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
    
    setTimeout(() => {
      if (text.toLowerCase().includes("story") || text.toLowerCase().includes("cool")) {
        const botReplyFirst: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          content: "Sure thing—here's a quick, breezy tale about someone undeniably cool.",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botReplyFirst]);
        
        setTimeout(() => {
          const botReplySecond: Message = {
            id: `bot-${Date.now() + 1}`,
            sender: "bot",
            content: "The Neon Jacket",
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, botReplySecond]);
          
          setTimeout(() => {
            const botReplyThird: Message = {
              id: `bot-${Date.now() + 2}`,
              sender: "bot",
              content: "In the twilight-lit city of Lucent Falls, nobody stood out quite like Milo Vega. He wasn't famous for winning races or scaling mountains; he was famous for his jacket—a vintage biker cut saturated in shifting neon threads that pulsed faintly with every beat of the city's music. The jacket was rumored to house a tech-spirit: an old-school AI woven into the fabric back when clothing companies still tried to turn everything 'smart.'",
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, botReplyThird]);
          }, 1000);
        }, 1000);
      } else if (text.toLowerCase().includes("whats up")) {
        const botReply: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          content: "Just hanging out in the cloud, ready to brainstorm or dig up answers whenever you need. What's up with you? Anything in particular you feel like chatting about or working on?",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botReply]);
      } else {
        const botReply: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          content: "I'm here to help! What would you like to know about?",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botReply]);
      }
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
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
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
