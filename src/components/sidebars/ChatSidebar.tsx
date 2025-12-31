import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenSquare, MessageSquare, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

interface Assistant {
  id: string;
  name: string;
}

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ChatSidebar = ({ isCollapsed, onToggleCollapse }: ChatSidebarProps) => {
  const navigate = useNavigate();

  // Sample data - would come from props/context in real app
  const assistants: Assistant[] = [
    { id: "1", name: "Arians friend" },
    { id: "2", name: "Arian" },
  ];

  const chatHistory: ChatHistoryItem[] = [
    { id: "1", title: "Dateizugriff und Verfügbarkeit", timestamp: "vor 1d" },
    { id: "2", title: "Erstellung eines Hundebildes", timestamp: "vor 1d" },
    { id: "3", title: "Erstellung eines Bildes von eine...", timestamp: "vor 1d" },
    { id: "4", title: "Panta Flows: DSGVO-konforme ...", timestamp: "vor 1d" },
    { id: "5", title: "Greeting Interaction", timestamp: "vor 1d" },
    { id: "6", title: "Casual Greeting Conversation", timestamp: "vor 8d" },
    { id: "7", title: "Casual Greeting in German", timestamp: "vor 16d" },
    { id: "8", title: "Gründer von OpenAI", timestamp: "vor 16d" },
  ];

  if (isCollapsed) {
    return (
      <aside className="w-12 h-full bg-background border-r border-border flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-muted transition-colors mb-4"
        >
          <PanelLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <button
          onClick={() => navigate("/chat")}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <PenSquare className="h-5 w-5 text-muted-foreground" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-72 h-full bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">Chat</h2>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          {/* New Chat Button */}
          <button
            onClick={() => navigate("/chat")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <PenSquare className="h-4 w-4" />
            <span>New Chat</span>
          </button>

          {/* Assistants Section */}
          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Assistants
            </h3>
            <div className="space-y-1">
              {assistants.map((assistant) => (
                <button
                  key={assistant.id}
                  onClick={() => navigate("/chat")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="truncate">{assistant.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat History Section */}
          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              History
            </h3>
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => navigate("/chat")}
                  className="w-full flex flex-col items-start px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors group"
                >
                  <span className="text-foreground/80 group-hover:text-foreground truncate w-full text-left">
                    {chat.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default ChatSidebar;
