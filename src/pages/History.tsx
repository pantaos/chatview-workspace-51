import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Image, 
  Code, 
  MessageSquare,
  LucideIcon
} from "lucide-react";
import HistoryItem from "@/components/HistoryItem";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

// Define the history item type with the correct LucideIcon type
interface HistoryItemType {
  id: string;
  title: string;
  workflowType: string;
  timestamp: Date;
  icon: LucideIcon;
  isFavorite: boolean;
}

const historyItems: HistoryItemType[] = [
  {
    id: "hist1",
    title: "Summarized quarterly report",
    workflowType: "Document Helper",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: FileText,
    isFavorite: false
  },
  {
    id: "hist2",
    title: "Generated product images",
    workflowType: "Image Creator",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    icon: Image,
    isFavorite: true
  },
  {
    id: "hist3",
    title: "Code refactoring assistant",
    workflowType: "Code Helper",
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    icon: Code,
    isFavorite: false
  },
  {
    id: "hist4",
    title: "Customer support chat analysis",
    workflowType: "Chat Assistant",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    icon: MessageSquare,
    isFavorite: false
  },
  // Additional history items
  {
    id: "hist5",
    title: "Project documentation",
    workflowType: "Document Helper",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    icon: FileText,
    isFavorite: true
  },
  {
    id: "hist6",
    title: "API integration code",
    workflowType: "Code Helper",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    icon: Code,
    isFavorite: false
  },
  {
    id: "hist7",
    title: "Marketing campaign images",
    workflowType: "Image Creator",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
    icon: Image,
    isFavorite: true
  },
  {
    id: "hist8",
    title: "User feedback analysis",
    workflowType: "Chat Assistant",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120),
    icon: MessageSquare,
    isFavorite: false
  }
];

const History = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [historyData, setHistoryData] = useState<HistoryItemType[]>(historyItems);
  const [activeTab, setActiveTab] = useState("all");
  
  const toggleFavorite = (id: string) => {
    setHistoryData(prev =>
      prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const renameHistoryItem = (id: string, newTitle: string) => {
    setHistoryData(prev =>
      prev.map(item => 
        item.id === id ? { ...item, title: newTitle } : item
      )
    );
  };

  const deleteHistoryItem = (id: string) => {
    setHistoryData(prev => prev.filter(item => item.id !== id));
  };

  // Filter history based on active tab
  const filteredHistory = historyData.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "favorites") return item.isFavorite;
    return true;
  });

  return (
    <MainLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
          <div className="px-4 md:px-8 pt-4 md:pt-6 max-w-5xl">
            <div className="mb-3">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground leading-tight">Chat History</h1>
              <p className="text-muted-foreground mt-0.5 text-xs md:text-sm">View and manage your conversation history</p>
            </div>
            <TabsList className="bg-transparent rounded-none p-0 h-auto -mb-px">
              <TabsTrigger 
                value="all" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2.5 pt-0 text-sm text-muted-foreground data-[state=active]:text-primary"
              >
                {translate('dashboard.all') || 'All'}
              </TabsTrigger>
              <TabsTrigger 
                value="favorites"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2.5 pt-0 text-sm text-muted-foreground data-[state=active]:text-primary"
              >
                {translate('dashboard.favorites') || 'Favorites'}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="px-4 md:px-8 py-6 max-w-5xl">
          
          <TabsContent value="all" className="mt-0">
            <div className="bg-card rounded-lg border">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No history items found</p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <HistoryItem
                    key={item.id}
                    title={item.title}
                    workflowType={item.workflowType}
                    timestamp={item.timestamp}
                    icon={item.icon}
                    isFavorite={item.isFavorite}
                    onClick={() => {
                      console.log(`History item clicked: ${item.id}`);
                      navigate('/chat');
                    }}
                    onFavoriteToggle={() => toggleFavorite(item.id)}
                    onRename={(newName) => renameHistoryItem(item.id, newName)}
                    onDelete={() => deleteHistoryItem(item.id)}
                  />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            <div className="bg-card rounded-lg border">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No favorite items found</p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <HistoryItem
                    key={item.id}
                    title={item.title}
                    workflowType={item.workflowType}
                    timestamp={item.timestamp}
                    icon={item.icon}
                    isFavorite={item.isFavorite}
                    onClick={() => {
                      console.log(`History item clicked: ${item.id}`);
                      navigate('/chat');
                    }}
                    onFavoriteToggle={() => toggleFavorite(item.id)}
                    onRename={(newName) => renameHistoryItem(item.id, newName)}
                    onDelete={() => deleteHistoryItem(item.id)}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </MainLayout>
  );
};

export default History;
