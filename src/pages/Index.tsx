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
  Rss,
  Crop,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchChat from "@/components/SearchChat";
import WorkflowCard from "@/components/WorkflowCard";
import HistoryItem from "@/components/HistoryItem";
import ChatInterface from "@/components/ChatInterface";
import { Slider } from "@/components/ui/slider";
import WorkflowCreationDialog from "@/components/WorkflowCreationDialog";
import TagFilter from "@/components/TagFilter";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import MainLayout from "@/components/MainLayout";
import { WorkflowItem, Assistant, Workflow, WorkflowTag, ConversationalWorkflow } from "@/types/workflow";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const [defaultTags, setDefaultTags] = useState<WorkflowTag[]>([
    { id: "productivity", name: "Productivity", color: "#3B82F6" },
    { id: "creative", name: "Creative", color: "#10B981" },
    { id: "education", name: "Education", color: "#F59E0B" },
    { id: "business", name: "Business", color: "#8B5CF6" },
    { id: "development", name: "Development", color: "#EF4444" },
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [showChat, setShowChat] = useState(false);
  const [historyData, setHistoryData] = useState([
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
  ]);
  const [sliderValue, setSliderValue] = useState([50]);
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);
  const [availableAssistants, setAvailableAssistants] = useState<Assistant[]>([
    {
      id: "chat",
      title: "Chat Assistant",
      description: "General purpose AI chat assistant",
      icon: "MessageSquare",
      tags: [{ id: "productivity", name: "Productivity", color: "#3B82F6" }],
      translationKey: "chatAssistant",
      type: "assistant" as const,
      systemPrompt: "You are a helpful assistant.",
      starters: [],
      isFavorite: false
    },
    {
      id: "code",
      title: "Code Helper",
      description: "Generate and explain code",
      icon: "Code",
      tags: [{ id: "development", name: "Development", color: "#EF4444" }],
      translationKey: "codeHelper",
      type: "assistant" as const,
      systemPrompt: "You are a coding assistant.",
      starters: [],
      isFavorite: false
    },
    {
      id: "image",
      title: "Image Creator",
      description: "Create images from text descriptions",
      icon: "Image",
      tags: [{ id: "creative", name: "Creative", color: "#10B981" }],
      translationKey: "imageCreator",
      type: "assistant" as const,
      systemPrompt: "You help create images.",
      starters: [],
      isFavorite: true
    },
  ]);
  const [availableWorkflows, setAvailableWorkflows] = useState<Workflow[]>([
    {
      id: "trendcast",
      title: "Trendcast",
      description: "Turn website content into professional videos",
      icon: "Rss",
      tags: [{ id: "creative", name: "Creative", color: "#10B981" }, { id: "business", name: "Business", color: "#8B5CF6" }],
      translationKey: "trendcast",
      type: "workflow" as const,
      steps: [],
      route: "/trendcast",
      isFavorite: true
    },
    {
      id: "reportcard",
      title: "Report Card Generator",
      description: "Generate professional report cards for students",
      icon: "GraduationCap",
      tags: [{ id: "education", name: "Education", color: "#F59E0B" }],
      translationKey: "reportCardGenerator",
      type: "workflow" as const,
      steps: [],
      route: "/reportcard",
      isFavorite: false
    },
    {
      id: "image-cropper",
      title: "Image Cropper",
      description: "Resize and crop images to fit specific dimensions",
      icon: "Crop",
      tags: [{ id: "productivity", name: "Productivity", color: "#3B82F6" }],
      translationKey: "imageCropper",
      type: "workflow" as const,
      steps: [],
      route: "/image-cropper",
      isFavorite: false
    }
  ]);

  // Add conversational workflows state
  const [availableConversationalWorkflows, setAvailableConversationalWorkflows] = useState<ConversationalWorkflow[]>([
    {
      id: "greenstone-report",
      title: "Green Stone Report",
      description: "Step-by-step student progress report creation for Green Stone School",
      icon: "GraduationCap",
      tags: [{ id: "education", name: "Education", color: "#F59E0B" }],
      type: "conversational" as const,
      route: "/greenstone-report",
      initialMessage: "Welcome to the Student Progress Report Workflow 👋\n\nLet's get started! Please fill out the student information form below.",
      steps: [],
      isFavorite: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowItem | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSearchSubmit = (text: string, files: File[]) => {
    setCurrentWorkflow(availableAssistants[0]);
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

  const handleCreateTag = (tagData: { name: string; color: string }) => {
    const newTag: WorkflowTag = {
      id: `tag-${Date.now()}`,
      name: tagData.name,
      color: tagData.color,
    };
    setDefaultTags(prev => [...prev, newTag]);
    toast.success(`Tag "${tagData.name}" created successfully!`);
  };

  const handleCreateWorkflow = (workflowData: any) => {
    if (workflowData.type === 'assistant') {
      const iconMap: Record<string, string> = {
        "Chat": "MessageSquare",
        "Code": "Code",
        "Image": "Image",
        "Document": "FileText",
        "Video": "Video",
        "Music": "Music",
        "Bot": "Bot"
      };

      const newAssistant: Assistant = {
        id: `assistant-${Date.now()}`,
        title: workflowData.title,
        description: workflowData.description,
        icon: iconMap[workflowData.selectedIcon] || "MessageSquare",
        tags: workflowData.tags || [],
        type: "assistant" as const,
        systemPrompt: workflowData.systemPrompt,
        starters: workflowData.starters,
        isFavorite: false
      };

      setAvailableAssistants(prev => [...prev, newAssistant]);
    } else {
      const newWorkflow: Workflow = {
        id: `workflow-${Date.now()}`,
        title: workflowData.title,
        description: workflowData.description,
        icon: workflowData.selectedIcon,
        tags: workflowData.tags || [],
        type: "workflow" as const,
        steps: workflowData.steps,
        route: `/workflow/${workflowData.title.toLowerCase().replace(/\s+/g, '-')}`,
        isFavorite: false
      };

      setAvailableWorkflows(prev => [...prev, newWorkflow]);
    }
    
    toast.success("New workflow created successfully!");
  };

  const handleWorkflowClick = (workflow: WorkflowItem) => {
    if (workflow.type === "assistant") {
      setCurrentWorkflow(workflow);
      setShowChat(true);
    } else if ((workflow.type === "workflow" || workflow.type === "conversational") && workflow.route) {
      navigate(workflow.route);
    }
  };

  const toggleWorkflowFavorite = (id: string, type: 'assistant' | 'workflow' | 'conversational') => {
    if (type === 'assistant') {
      setAvailableAssistants(prev =>
        prev.map(item => 
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
    } else if (type === 'workflow') {
      setAvailableWorkflows(prev =>
        prev.map(item => 
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
    } else if (type === 'conversational') {
      setAvailableConversationalWorkflows(prev =>
        prev.map(item => 
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
    }
  };

  const handleWorkflowTagToggle = (workflowId: string, type: 'assistant' | 'workflow' | 'conversational', tagId: string) => {
    const updateTags = (item: WorkflowItem) => {
      if (item.id !== workflowId) return item;
      
      const hasTag = item.tags.some(tag => tag.id === tagId);
      const selectedTag = defaultTags.find(tag => tag.id === tagId);
      
      if (!selectedTag) return item;
      
      return {
        ...item,
        tags: hasTag 
          ? item.tags.filter(tag => tag.id !== tagId)
          : [...item.tags, selectedTag]
      };
    };

    if (type === 'assistant') {
      setAvailableAssistants(prev => prev.map(updateTags) as Assistant[]);
    } else if (type === 'workflow') {
      setAvailableWorkflows(prev => prev.map(updateTags) as Workflow[]);
    } else if (type === 'conversational') {
      setAvailableConversationalWorkflows(prev => prev.map(updateTags) as ConversationalWorkflow[]);
    }
  };

  const handleTagSelect = (tagId: string) => {
    setSelectedTags(prev => [...prev, tagId]);
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const filterByTags = (items: WorkflowItem[]) => {
    if (selectedTags.length === 0) return items;
    return items.filter(item => 
      item.tags.some(tag => selectedTags.includes(tag.id))
    );
  };

  const allWorkflowItems = [...availableAssistants, ...availableWorkflows, ...availableConversationalWorkflows];
  const filteredAssistants = filterByTags(availableAssistants);
  const filteredWorkflows = filterByTags([...availableWorkflows, ...availableConversationalWorkflows]);
  const filteredAllItems = filterByTags(allWorkflowItems);
  const favoriteItems = allWorkflowItems.filter(item => item.isFavorite);
  const filteredFavorites = filterByTags(favoriteItems);

  useEffect(() => {
    setShowChat(false);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme.isDarkMode ? 'dark' : ''}`}>
      {showChat ? (
        <ChatInterface 
          onClose={handleCloseChat} 
          workflowTitle={currentWorkflow?.title} 
          userName="Moin Arian"
        />
      ) : (
        <MainLayout>
          <div className="p-8 max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">How can I help you today?</p>
            </div>
            
            {/* Search */}
            <section className="mb-10">
              <SearchChat 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSubmit={handleSearchSubmit}
                disableNavigation={true}
                title=""
                placeholder="Start a conversation..."
              />
            </section>
            
            {/* Workflows & Assistants */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Workflows & Assistants
                </h2>
                <button 
                  onClick={() => setShowNewWorkflowDialog(true)}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Create New
                </button>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto mb-6">
                  <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="assistants" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">
                    Assistants
                  </TabsTrigger>
                  <TabsTrigger value="workflows" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">
                    Workflows
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">
                    Favorites
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAllItems.map((item) => (
                      <WorkflowCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        tags={item.tags}
                        translationKey={item.translationKey}
                        onClick={() => handleWorkflowClick(item)}
                        onFavoriteToggle={() => toggleWorkflowFavorite(item.id, item.type)}
                        isFavorite={item.isFavorite}
                        availableTags={defaultTags}
                        onTagToggle={(tagId) => handleWorkflowTagToggle(item.id, item.type, tagId)}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="assistants" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAssistants.map((item) => (
                      <WorkflowCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        tags={item.tags}
                        translationKey={item.translationKey}
                        onClick={() => handleWorkflowClick(item)}
                        onFavoriteToggle={() => toggleWorkflowFavorite(item.id, item.type)}
                        isFavorite={item.isFavorite}
                        availableTags={defaultTags}
                        onTagToggle={(tagId) => handleWorkflowTagToggle(item.id, item.type, tagId)}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="workflows" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWorkflows.map((item) => (
                      <WorkflowCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        tags={item.tags}
                        translationKey={item.translationKey}
                        onClick={() => handleWorkflowClick(item)}
                        onFavoriteToggle={() => toggleWorkflowFavorite(item.id, item.type)}
                        isFavorite={item.isFavorite}
                        availableTags={defaultTags}
                        onTagToggle={(tagId) => handleWorkflowTagToggle(item.id, item.type, tagId)}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFavorites.map((item) => (
                      <WorkflowCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        tags={item.tags}
                        translationKey={item.translationKey}
                        onClick={() => handleWorkflowClick(item)}
                        onFavoriteToggle={() => toggleWorkflowFavorite(item.id, item.type)}
                        isFavorite={item.isFavorite}
                        availableTags={defaultTags}
                        onTagToggle={(tagId) => handleWorkflowTagToggle(item.id, item.type, tagId)}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            <WorkflowCreationDialog
              open={showNewWorkflowDialog}
              onClose={() => setShowNewWorkflowDialog(false)}
              onCreateWorkflow={handleCreateWorkflow}
              availableTags={defaultTags}
              onCreateTag={handleCreateTag}
            />
          </div>
        </MainLayout>
      )}
    </div>
  );
};

export default Index;
