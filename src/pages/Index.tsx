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
import ModernNavbar from "@/components/ModernNavbar";
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
        <>
          <ModernNavbar />
          
          <div className={`${isMobile ? 'py-8' : 'py-16'} bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-900 dark:via-purple-900 dark:to-blue-950 relative overflow-hidden`}>
            <div className={`container mx-auto ${isMobile ? 'px-4' : 'px-6'} relative z-10`}>
              <section className={`${isMobile ? 'mb-10' : 'mb-20'} transform transition-all duration-500 hover:scale-[1.02]`}>
                <SearchChat 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSubmit={handleSearchSubmit}
                  disableNavigation={true}
                  title="How can I help you?"
                  placeholder="Start a conversation"
                />
              </section>
              
              <section className={`${isMobile ? 'mb-8' : 'mb-12'}`}>
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white ${isMobile ? 'mb-6' : 'mb-10'} animate-fade-in`}>
                  Workflows & Assistants
                </h2>
                
                {!isMobile && (
                  <div className="mb-10 animate-fade-in delay-100">
                    <TagFilter
                      tags={defaultTags}
                      selectedTags={selectedTags}
                      onTagSelect={handleTagSelect}
                      onTagRemove={handleTagRemove}
                      onClearAll={handleClearAllTags}
                      onCreateTag={handleCreateTag}
                    />
                  </div>
                )}
                
                <div className={`${isMobile ? 'mb-8' : 'mb-12'} flex flex-col animate-fade-in delay-200`}>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className={`${isMobile ? 'flex flex-col space-y-4' : 'filters-with-button'}`}>
                      <TabsList className={`bg-white/10 backdrop-blur-xl border border-white/20 ${isMobile ? 'w-full' : ''} transition-all duration-300 hover:bg-white/20`}>
                        <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white flex-1 transition-all duration-200">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="assistants" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white flex-1 transition-all duration-200">
                          {isMobile ? 'AI' : 'Assistants'}
                        </TabsTrigger>
                        <TabsTrigger value="workflows" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white flex-1 transition-all duration-200">
                          Workflows
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white flex-1 transition-all duration-200">
                          {isMobile ? 'Favs' : 'Favorites'}
                        </TabsTrigger>
                      </TabsList>
                      
                      <Button 
                        variant="outline" 
                        className={`gap-2 bg-white/10 backdrop-blur-xl text-white border-white/20 hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 ${isMobile ? 'w-full' : 'ml-6'}`}
                        onClick={() => setShowNewWorkflowDialog(true)}
                      >
                        <Plus className="h-4 w-4" />
                        {isMobile ? 'Create' : 'Create New'}
                      </Button>
                    </div>

                    {isMobile && (
                      <div className="mt-6 animate-fade-in delay-300">
                        <TagFilter
                          tags={defaultTags}
                          selectedTags={selectedTags}
                          onTagSelect={handleTagSelect}
                          onTagRemove={handleTagRemove}
                          onClearAll={handleClearAllTags}
                          onCreateTag={handleCreateTag}
                        />
                      </div>
                    )}
                    
                    <TabsContent value="all" className={`animate-fade-in ${isMobile ? 'mt-6' : 'mt-10'}`}>
                      <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8'}`}>
                        {filteredAllItems.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="animate-fade-in transform transition-all duration-300 hover:scale-105"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <WorkflowCard
                              title={item.title}
                              description={item.description}
                              icon={item.icon}
                              tags={item.tags}
                              translationKey={item.translationKey}
                              onClick={() => handleWorkflowClick(item)}
                              onFavoriteToggle={() => toggleWorkflowFavorite(item.id, item.type)}
                              isFavorite={item.isFavorite}
                              className={`${isMobile ? 'text-xs' : ''} backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300`}
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="assistants" className={`animate-fade-in ${isMobile ? 'mt-6' : 'mt-10'}`}>
                      <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8'}`}>
                        {filteredAssistants.map((assistant, index) => (
                          <div 
                            key={assistant.id} 
                            className="animate-fade-in transform transition-all duration-300 hover:scale-105"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <WorkflowCard
                              title={assistant.title}
                              description={assistant.description}
                              icon={assistant.icon}
                              tags={assistant.tags}
                              translationKey={assistant.translationKey}
                              onClick={() => handleWorkflowClick(assistant)}
                              onFavoriteToggle={() => toggleWorkflowFavorite(assistant.id, assistant.type)}
                              isFavorite={assistant.isFavorite}
                              className={`${isMobile ? 'text-xs' : ''} backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300`}
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="workflows" className={`animate-fade-in ${isMobile ? 'mt-6' : 'mt-10'}`}>
                      <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8'}`}>
                        {filteredWorkflows.map((workflow, index) => (
                          <div 
                            key={workflow.id} 
                            className="animate-fade-in transform transition-all duration-300 hover:scale-105"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <WorkflowCard
                              title={workflow.title}
                              description={workflow.description}
                              icon={workflow.icon}
                              tags={workflow.tags}
                              translationKey={workflow.translationKey}
                              onClick={() => handleWorkflowClick(workflow)}
                              onFavoriteToggle={() => toggleWorkflowFavorite(workflow.id, workflow.type)}
                              isFavorite={workflow.isFavorite}
                              className={`${isMobile ? 'text-xs' : ''} backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300`}
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="favorites" className={`animate-fade-in ${isMobile ? 'mt-6' : 'mt-10'}`}>
                      <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8'}`}>
                        {filteredFavorites.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="animate-fade-in transform transition-all duration-300 hover:scale-105"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <WorkflowCard
                              title={item.title}
                              description={item.description}
                              icon={item.icon}
                              tags={item.tags}
                              translationKey={item.translationKey}
                              onClick={() => handleWorkflowClick(item)}
                              onFavoriteToggle={() => toggleWorkflowFavorite(item.id, item.type)}
                              isFavorite={item.isFavorite}
                              className={`${isMobile ? 'text-xs' : ''} backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300`}
                            />
                          </div>
                        ))}
                      </div>
                      {filteredFavorites.length === 0 && (
                        <div className="text-center text-white/70 py-12">
                          <p className="text-lg">No favorite items yet. Click the heart icon on any workflow or assistant to add it to favorites!</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                
                {!isMobile && (
                  <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 text-white shadow-2xl animate-fade-in delay-500 transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-3 mb-3">
                      <SlidersHorizontal size={24} className="text-white" />
                      <h3 className="font-semibold text-lg">{translate('dashboard.workflowSettings')}</h3>
                    </div>
                    <p className="text-white/80 mb-6">{translate('dashboard.creativityLevel')}</p>
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-medium">{translate('dashboard.conservative')}</span>
                      <Slider 
                        className="flex-1"
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                      />
                      <span className="text-sm font-medium">{translate('dashboard.creative')}</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm text-white/80 font-medium">{sliderValue[0]}%</span>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
          
          <div className={`${isMobile ? 'py-6' : 'py-12'} bg-background transition-colors duration-300 flex-1`}>
            <div className={`container mx-auto ${isMobile ? 'px-4' : 'px-6'}`}>
              <section>
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground ${isMobile ? 'mb-6' : 'mb-8'} animate-fade-in`}>
                  {translate('dashboard.recentHistory')}
                </h2>
                
                <Tabs defaultValue="all">
                  <div className={`${isMobile ? 'flex flex-col space-y-4' : 'filters-with-button'}`}>
                    <TabsList className={`${isMobile ? 'w-full' : 'mb-8'} bg-card`}>
                      <TabsTrigger value="all" className="flex-1 transition-all duration-200">
                        {translate('dashboard.all')}
                      </TabsTrigger>
                      <TabsTrigger value="favorites" className="flex-1 transition-all duration-200">
                        {isMobile ? 'Favs' : translate('dashboard.favorites')}
                      </TabsTrigger>
                    </TabsList>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`hover:bg-accent text-foreground transition-all duration-200 transform hover:scale-105 ${isMobile ? 'w-full' : ''}`}
                      onClick={() => navigate("/history")}
                    >
                      {translate('app.viewAll')}
                    </Button>
                  </div>
                  
                  <TabsContent value="all" className={`${isMobile ? 'mt-0' : 'mt-6'}`}>
                    <div className="bg-card rounded-2xl shadow-xl border border-border transition-all duration-300 hover:shadow-2xl">
                      {historyData.slice(0, isMobile ? 3 : historyData.length).map((item, index) => (
                        <div 
                          key={item.id}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <HistoryItem
                            title={item.title}
                            workflowType={item.workflowType}
                            timestamp={item.timestamp}
                            icon={item.icon}
                            isFavorite={item.isFavorite}
                            onClick={() => {
                              console.log(`History item clicked: ${item.id}`);
                              const workflowItem: Assistant = {
                                id: item.id,
                                title: item.workflowType,
                                description: item.title,
                                icon: "MessageSquare",
                                type: "assistant" as const,
                                tags: [],
                                systemPrompt: "You are a helpful assistant.",
                                starters: []
                              };
                              setCurrentWorkflow(workflowItem);
                              setShowChat(true);
                            }}
                            onFavoriteToggle={() => toggleFavorite(item.id)}
                            onRename={(newName) => renameHistoryItem(item.id, newName)}
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="favorites" className={`${isMobile ? 'mt-0' : 'mt-6'}`}>
                    <div className="bg-card rounded-2xl shadow-xl border border-border transition-all duration-300 hover:shadow-2xl">
                      {historyData.filter(item => item.isFavorite).slice(0, isMobile ? 3 : historyData.length).map((item, index) => (
                        <div 
                          key={item.id}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <HistoryItem
                            title={item.title}
                            workflowType={item.workflowType}
                            timestamp={item.timestamp}
                            icon={item.icon}
                            isFavorite={item.isFavorite}
                            onClick={() => {
                              console.log(`History item clicked: ${item.id}`);
                              const workflowItem: Assistant = {
                                id: item.id,
                                title: item.workflowType,
                                description: item.title,
                                icon: "MessageSquare",
                                type: "assistant" as const,
                                tags: [],
                                systemPrompt: "You are a helpful assistant.",
                                starters: []
                              };
                              setCurrentWorkflow(workflowItem);
                              setShowChat(true);
                            }}
                            onFavoriteToggle={() => toggleFavorite(item.id)}
                            onRename={(newName) => renameHistoryItem(item.id, newName)}
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </section>
            </div>
          </div>

          <WorkflowCreationDialog
            open={showNewWorkflowDialog}
            onClose={() => setShowNewWorkflowDialog(false)}
            onCreateWorkflow={handleCreateWorkflow}
            availableTags={defaultTags}
            onCreateTag={handleCreateTag}
          />
        </>
      )}
    </div>
  );
};

export default Index;
