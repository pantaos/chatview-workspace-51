import { useState } from "react";
import { 
  Plus, 
  ChevronLeft, 
  MessageSquare,
  Code,
  Image,
  FileText,
  Video,
  Music
} from "lucide-react";

import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface ChatHistoryItem {
  id: string;
  title: string;
  workflowType: string;
  icon: React.ElementType;
  timestamp: Date;
  status: "completed" | "processing" | "failed";
  isFavorite: boolean;
}

const workflows = [
  {
    id: "chat",
    title: "Chat Assistant",
    icon: MessageSquare
  },
  {
    id: "code",
    title: "Code Helper",
    icon: Code
  },
  {
    id: "image",
    title: "Image Creator",
    icon: Image
  },
  {
    id: "doc",
    title: "Document Helper",
    icon: FileText
  },
  {
    id: "video",
    title: "Video Generator",
    icon: Video
  },
  {
    id: "music",
    title: "Music Composer",
    icon: Music
  },
];

const ChatSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: "chat1",
      title: "Marketing strategy analysis for Q2 campaign",
      workflowType: "Chat Assistant",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      icon: MessageSquare,
      status: "completed",
      isFavorite: true
    },
    {
      id: "chat2",
      title: "Customer feedback summary report",
      workflowType: "Document Helper",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      icon: FileText,
      status: "completed",
      isFavorite: false
    },
    {
      id: "chat3",
      title: "Product design ideas brainstorm",
      workflowType: "Image Creator",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
      icon: Image,
      status: "completed",
      isFavorite: false
    },
    {
      id: "chat4",
      title: "API documentation review",
      workflowType: "Code Helper",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      icon: Code,
      status: "completed",
      isFavorite: false
    }
  ]);

  const getRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "vor kurzem";
    if (hours < 24) return `vor ${hours}h`;
    return `vor ${days}d`;
  };
  
  const handleNewChat = () => {
    navigate('/dashboard');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4 flex items-center justify-between">
          {state === "expanded" && (
            <div className="text-lg font-semibold">Chats</div>
          )}
          <div className="flex items-center">
            <Button 
              className={cn(
                "flex gap-2", 
                state === "collapsed" ? "w-full" : "flex-1"
              )} 
              size="sm"
              onClick={handleNewChat}
            >
              <Plus size={16} />
              {state === "expanded" && "New Chat"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 md:hidden" 
              onClick={toggleSidebar}
            >
              <ChevronLeft size={16} />
            </Button>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          {state === "expanded" && (
            <div className="px-2 mb-4">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">WORKFLOWS</div>
              <SidebarMenu>
                {workflows.map((workflow) => (
                  <SidebarMenuItem key={workflow.id}>
                    <SidebarMenuButton tooltip={workflow.title}>
                      <workflow.icon size={18} />
                      <span>{workflow.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          )}
          
          {state === "expanded" && (
            <div className="px-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">HISTORY</div>
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="space-y-1 px-1">
                  {chatHistory.map((chat) => (
                    <div 
                      key={chat.id} 
                      className="px-3 py-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground truncate leading-tight">
                        {chat.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getRelativeTime(chat.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          
          {state === "collapsed" && (
            <SidebarMenu>
              <div className="mb-4">
                {workflows.map((workflow) => (
                  <SidebarMenuItem key={workflow.id}>
                    <SidebarMenuButton tooltip={workflow.title}>
                      <workflow.icon size={18} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
              
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="p-2 space-y-2">
                  {chatHistory.map((chat) => (
                    <TooltipProvider key={chat.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative flex justify-center">
                            <Button
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              <chat.icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">{chat.title}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </ScrollArea>
            </SidebarMenu>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
