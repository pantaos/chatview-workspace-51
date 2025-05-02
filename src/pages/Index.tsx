import { useState, useEffect } from "react";
import { 
  Bot, 
  Code, 
  FileText, 
  Image, 
  MessageSquare, 
  Music, 
  Plus, 
  Video,
  SlidersHorizontal,
  LucideIcon,
  Rss
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchChat from "@/components/SearchChat";
import WorkflowCard from "@/components/WorkflowCard";
import HistoryItem from "@/components/HistoryItem";
import ChatInterface from "@/components/ChatInterface";
import { Slider } from "@/components/ui/slider";
import NewWorkflowDialog from "@/components/NewWorkflowDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import ModernNavbar from "@/components/ModernNavbar";

interface Workflow {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  translationKey?: string;
  type: "chat" | "screen";
  route?: string;
}

const workflows: Workflow[] = [
  {
    id: "chat",
    title: "Chat Assistant",
    description: "General purpose AI chat assistant",
    icon: MessageSquare,
    translationKey: "chatAssistant",
    type: "chat"
  },
  {
    id: "code",
    title: "Code Helper",
    description: "Generate and explain code",
    icon: Code,
    translationKey: "codeHelper",
    type: "chat"
  },
  {
    id: "image",
    title: "Image Creator",
    description: "Create images from text descriptions",
    icon: Image,
    translationKey: "imageCreator",
    type: "chat"
  },
  {
    id: "doc",
    title: "Document Helper",
    description: "Summarize and extract from documents",
    icon: FileText,
    translationKey: "documentHelper",
    type: "chat"
  },
  {
    id: "video",
    title: "Video Generator",
    description: "Create videos from text prompts",
    icon: Video,
    translationKey: "videoGenerator",
    type: "chat"
  },
  {
    id: "music",
    title: "Music Composer",
    description: "Generate music and audio",
    icon: Music,
    translationKey: "musicComposer",
    type: "chat"
  },
  {
    id: "trendcast",
    title: "Trendcast",
    description: "Turn website content into professional videos",
    icon: Rss,
    translationKey: "trendcast",
    type: "screen",
    route: "/trendcast"
  }
];

const historyItems = [
  {
    id: "hist1",
    title: "Summarized quarterly report",
    workflowType: "Document Helper",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: FileText,
    status: "completed" as const,
    isFavorite: false
  },
  {
    id: "hist2",
    title: "Generated product images",
    workflowType: "Image Creator",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    icon: Image,
    status: "completed" as const,
    isFavorite: true
  },
  {
    id: "hist3",
    title: "Code refactoring assistant",
    workflowType: "Code Helper",
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    icon: Code,
    status: "failed" as const,
    isFavorite: false
  },
  {
    id: "hist4",
    title: "Customer support chat analysis",
    workflowType: "Chat Assistant",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    icon: MessageSquare,
    status: "completed" as const,
    isFavorite: false
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [showChat, setShowChat] = useState(false);
  const [historyData, setHistoryData] = useState(historyItems);
  const [sliderValue, setSliderValue] = useState([50]);
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);
  const [availableWorkflows, setAvailableWorkflows] = useState<Workflow[]>(workflows);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  
  const handleSearchSubmit = (text: string, files: File[]) => {
    setCurrentWorkflow({
      id: "chat",
      title: "Chat Assistant",
      description: "General purpose AI chat assistant",
      icon: MessageSquare,
      type: "chat"
    });
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setCurrentWorkflow(null);
  };

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

  const handleCreateWorkflow = (workflowData: any) => {
    const iconMap: Record<string, LucideIcon> = {
      "Chat": MessageSquare,
      "Code": Code,
      "Image": Image,
      "Document": FileText,
      "Video": Video,
      "Music": Music,
      "Bot": Bot
    };

    const iconComponent = iconMap[workflowData.selectedIcon] || MessageSquare;

    const newWorkflow = {
      id: `workflow-${Date.now()}`,
      title: workflowData.title,
      description: workflowData.description,
      icon: iconComponent,
      color: workflowData.iconColor,
      type: "chat" as const
    };

    setAvailableWorkflows(prev => [...prev, newWorkflow]);
    toast.success("New workflow created successfully!");
  };

  const handleWorkflowClick = (workflow: Workflow) => {
    if (workflow.type === "chat") {
      setCurrentWorkflow(workflow);
      setShowChat(true);
    } else if (workflow.type === "screen" && workflow.route) {
      navigate(workflow.route);
    }
  };

  useEffect(() => {
    setShowChat(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {showChat ? (
        <ChatInterface 
          onClose={handleCloseChat} 
          workflowTitle={currentWorkflow?.title} 
          userName="Moin Arian"
        />
      ) : (
        <>
          <ModernNavbar />
          
          <div className="py-12" style={{ 
            background: `linear-gradient(135deg, #0EA5E9 0%, #0A2E50 100%)`,
          }}>
            <div className="container mx-auto px-4">
              <section className="mb-16">
                <SearchChat 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSubmit={handleSearchSubmit}
                  disableNavigation={true}
                  title="How can I help you?"
                  placeholder="Start a conversation"
                />
              </section>
              
              <section className="mb-10">
                <h2 className="text-xl font-medium text-white mb-8">{translate('dashboard.workflows')}</h2>
                
                <div className="mb-10 flex flex-col">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="filters-with-button">
                      <TabsList className="bg-white/20 backdrop-blur-sm">
                        <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">
                          {translate('dashboard.all')}
                        </TabsTrigger>
                        <TabsTrigger value="recent" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">
                          {translate('dashboard.recent')}
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">
                          {translate('dashboard.favorites')}
                        </TabsTrigger>
                      </TabsList>
                      
                      <Button 
                        variant="outline" 
                        className="gap-1 hover:bg-black hover:text-white bg-white/20 backdrop-blur-sm text-white border-white/30 ml-6"
                        onClick={() => setShowNewWorkflowDialog(true)}
                      >
                        <Plus className="h-4 w-4" />
                        {translate('dashboard.newChatWorkflow')}
                      </Button>
                    </div>
                    
                    <TabsContent value="all" className="animate-fade-in mt-8">
                      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
                        {availableWorkflows.map((workflow) => (
                          <WorkflowCard
                            key={workflow.id}
                            title={workflow.title}
                            description={workflow.description}
                            icon={workflow.icon}
                            color={workflow.color}
                            translationKey={workflow.translationKey}
                            onClick={() => handleWorkflowClick(workflow)}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="recent" className="animate-fade-in mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {workflows.slice(0, 3).map((workflow) => (
                          <WorkflowCard
                            key={workflow.id}
                            title={workflow.title}
                            description={workflow.description}
                            icon={workflow.icon}
                            translationKey={workflow.translationKey}
                            onClick={() => handleWorkflowClick(workflow)}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="favorites" className="animate-fade-in mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {workflows.slice(0, 2).map((workflow) => (
                          <WorkflowCard
                            key={workflow.id}
                            title={workflow.title}
                            description={workflow.description}
                            icon={workflow.icon}
                            translationKey={workflow.translationKey}
                            onClick={() => handleWorkflowClick(workflow)}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg border border-white/30 text-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <SlidersHorizontal size={20} className="text-white" />
                    <h3 className="font-medium">{translate('dashboard.workflowSettings')}</h3>
                  </div>
                  <p className="text-sm text-white/80 mb-4">{translate('dashboard.creativityLevel')}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{translate('dashboard.conservative')}</span>
                    <Slider 
                      className="flex-1"
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                    />
                    <span className="text-sm">{translate('dashboard.creative')}</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-white/80">{sliderValue[0]}%</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          <div className="py-8 bg-white flex-1">
            <div className="container mx-auto px-4">
              <section>
                <h2 className="text-xl font-medium text-gray-800 mb-6">{translate('dashboard.recentHistory')}</h2>
                
                <Tabs defaultValue="all">
                  <div className="filters-with-button">
                    <TabsList className="mb-6">
                      <TabsTrigger value="all">
                        {translate('dashboard.all')}
                      </TabsTrigger>
                      <TabsTrigger value="favorites">
                        {translate('dashboard.favorites')}
                      </TabsTrigger>
                    </TabsList>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-gray-100 text-gray-700"
                      onClick={() => navigate("/history")}
                    >
                      {translate('app.viewAll')}
                    </Button>
                  </div>
                  
                  <TabsContent value="all" className="mt-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      {historyData.map((item) => (
                        <HistoryItem
                          key={item.id}
                          title={item.title}
                          workflowType={item.workflowType}
                          timestamp={item.timestamp}
                          icon={item.icon}
                          isFavorite={item.isFavorite}
                          onClick={() => {
                            console.log(`History item clicked: ${item.id}`);
                            setCurrentWorkflow({
                              id: item.id,
                              title: item.workflowType,
                              description: item.title,
                              icon: item.icon,
                              type: "chat"
                            });
                            setShowChat(true);
                          }}
                          onFavoriteToggle={() => toggleFavorite(item.id)}
                          onRename={(newName) => renameHistoryItem(item.id, newName)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="favorites" className="mt-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      {historyData.filter(item => item.isFavorite).map((item) => (
                        <HistoryItem
                          key={item.id}
                          title={item.title}
                          workflowType={item.workflowType}
                          timestamp={item.timestamp}
                          icon={item.icon}
                          isFavorite={item.isFavorite}
                          onClick={() => {
                            console.log(`History item clicked: ${item.id}`);
                            setCurrentWorkflow({
                              id: item.id,
                              title: item.workflowType,
                              description: item.title,
                              icon: item.icon,
                              type: "chat"
                            });
                            setShowChat(true);
                          }}
                          onFavoriteToggle={() => toggleFavorite(item.id)}
                          onRename={(newName) => renameHistoryItem(item.id, newName)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </section>
            </div>
          </div>

          <NewWorkflowDialog
            open={showNewWorkflowDialog}
            onClose={() => setShowNewWorkflowDialog(false)}
            onCreateWorkflow={handleCreateWorkflow}
          />
        </>
      )}
    </div>
  );
};

export default Index;
