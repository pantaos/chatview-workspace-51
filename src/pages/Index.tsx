
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
import { WorkflowItem, Assistant, Workflow, WorkflowTag } from "@/types/workflow";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const isMobile = useIsMobile();
  
  const [defaultTags, setDefaultTags] = useState<WorkflowTag[]>([
    { id: "productivity", name: "Productivity", color: "#3B82F6" },
    { id: "creative", name: "Creative", color: "#10B981" },
    { id: "education", name: "Education", color: "#F59E0B" },
    { id: "business", name: "Business", color: "#8B5CF6" },
    { id: "development", name: "Development", color: "#EF4444" },
  ]);

  const [activeTab, setActiveTab] = useState("assistants");
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
      starters: []
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
      starters: []
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
      starters: []
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
      route: "/trendcast"
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
      route: "/reportcard"
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
      route: "/image-cropper"
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
        starters: workflowData.starters
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
        route: `/workflow/${workflowData.title.toLowerCase().replace(/\s+/g, '-')}`
      };

      setAvailableWorkflows(prev => [...prev, newWorkflow]);
    }
    
    toast.success("New workflow created successfully!");
  };

  const handleWorkflowClick = (workflow: WorkflowItem) => {
    if (workflow.type === "assistant") {
      setCurrentWorkflow(workflow);
      setShowChat(true);
    } else if (workflow.type === "workflow" && workflow.route) {
      navigate(workflow.route);
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

  const filteredAssistants = filterByTags(availableAssistants);
  const filteredWorkflows = filterByTags(availableWorkflows);

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
          
          <div className={`${isMobile ? 'py-6' : 'py-12'}`} style={{ 
            background: `linear-gradient(135deg, #0A2E50 0%, #1E3A8A 50%, #0EA5E9 100%)`,
          }}>
            <div className={`container mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
              <section className={`${isMobile ? 'mb-8' : 'mb-16'}`}>
                <SearchChat 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSubmit={handleSearchSubmit}
                  disableNavigation={true}
                  title="How can I help you?"
                  placeholder="Start a conversation"
                />
              </section>
              
              <section className={`${isMobile ? 'mb-6' : 'mb-10'}`}>
                <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium text-white ${isMobile ? 'mb-4' : 'mb-8'}`}>
                  Workflows & Assistants
                </h2>
                
                {!isMobile && (
                  <div className="mb-8">
                    <TagFilter
                      tags={defaultTags}
                      selectedTags={selectedTags}
                      onTagSelect={handleTagSelect}
                      onTagRemove={handleTagRemove}
                      onClearAll={handleClearAllTags}
                    />
                  </div>
                )}
                
                <div className={`${isMobile ? 'mb-6' : 'mb-10'} flex flex-col`}>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className={`${isMobile ? 'flex flex-col space-y-3' : 'filters-with-button'}`}>
                      <TabsList className={`bg-white/20 backdrop-blur-sm ${isMobile ? 'w-full' : ''}`}>
                        <TabsTrigger value="assistants" className="data-[state=active]:bg-white data-[state=active]:text-black text-white flex-1">
                          {isMobile ? 'AI' : 'Assistants'}
                        </TabsTrigger>
                        <TabsTrigger value="workflows" className="data-[state=active]:bg-white data-[state=active]:text-black text-white flex-1">
                          Workflows
                        </TabsTrigger>
                        <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black text-white flex-1">
                          All
                        </TabsTrigger>
                      </TabsList>
                      
                      <Button 
                        variant="outline" 
                        className={`gap-1 hover:bg-black hover:text-white bg-white/20 backdrop-blur-sm text-white border-white/30 ${isMobile ? 'w-full' : 'ml-6'}`}
                        onClick={() => setShowNewWorkflowDialog(true)}
                      >
                        <Plus className="h-4 w-4" />
                        {isMobile ? 'Create' : 'Create New'}
                      </Button>
                    </div>

                    {isMobile && (
                      <div className="mt-4">
                        <TagFilter
                          tags={defaultTags}
                          selectedTags={selectedTags}
                          onTagSelect={handleTagSelect}
                          onTagRemove={handleTagRemove}
                          onClearAll={handleClearAllTags}
                        />
                      </div>
                    )}
                    
                    <TabsContent value="assistants" className={`animate-fade-in ${isMobile ? 'mt-4' : 'mt-8'}`}>
                      <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6'}`}>
                        {filteredAssistants.map((assistant) => (
                          <WorkflowCard
                            key={assistant.id}
                            title={assistant.title}
                            description={assistant.description}
                            icon={assistant.icon}
                            tags={assistant.tags}
                            translationKey={assistant.translationKey}
                            onClick={() => handleWorkflowClick(assistant)}
                            className={isMobile ? 'text-xs' : ''}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="workflows" className={`animate-fade-in ${isMobile ? 'mt-4' : 'mt-8'}`}>
                      <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6'}`}>
                        {filteredWorkflows.map((workflow) => (
                          <WorkflowCard
                            key={workflow.id}
                            title={workflow.title}
                            description={workflow.description}
                            icon={workflow.icon}
                            tags={workflow.tags}
                            translationKey={workflow.translationKey}
                            onClick={() => handleWorkflowClick(workflow)}
                            className={isMobile ? 'text-xs' : ''}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="all" className={`animate-fade-in ${isMobile ? 'mt-4' : 'mt-8'}`}>
                      <div className={`space-y-${isMobile ? '6' : '8'}`}>
                        <div>
                          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-white ${isMobile ? 'mb-3' : 'mb-4'}`}>Assistants</h3>
                          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6'}`}>
                            {filteredAssistants.map((assistant) => (
                              <WorkflowCard
                                key={assistant.id}
                                title={assistant.title}
                                description={assistant.description}
                                icon={assistant.icon}
                                tags={assistant.tags}
                                translationKey={assistant.translationKey}
                                onClick={() => handleWorkflowClick(assistant)}
                                className={isMobile ? 'text-xs' : ''}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-white ${isMobile ? 'mb-3' : 'mb-4'}`}>Workflows</h3>
                          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6'}`}>
                            {filteredWorkflows.map((workflow) => (
                              <WorkflowCard
                                key={workflow.id}
                                title={workflow.title}
                                description={workflow.description}
                                icon={workflow.icon}
                                tags={workflow.tags}
                                translationKey={workflow.translationKey}
                                onClick={() => handleWorkflowClick(workflow)}
                                className={isMobile ? 'text-xs' : ''}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {!isMobile && (
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
                )}
              </section>
            </div>
          </div>
          
          <div className={`${isMobile ? 'py-4' : 'py-8'} bg-white flex-1`}>
            <div className={`container mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
              <section>
                <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium text-gray-800 ${isMobile ? 'mb-4' : 'mb-6'}`}>
                  {translate('dashboard.recentHistory')}
                </h2>
                
                <Tabs defaultValue="all">
                  <div className={`${isMobile ? 'flex flex-col space-y-3' : 'filters-with-button'}`}>
                    <TabsList className={`${isMobile ? 'w-full' : 'mb-6'}`}>
                      <TabsTrigger value="all" className="flex-1">
                        {translate('dashboard.all')}
                      </TabsTrigger>
                      <TabsTrigger value="favorites" className="flex-1">
                        {isMobile ? 'Favs' : translate('dashboard.favorites')}
                      </TabsTrigger>
                    </TabsList>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`hover:bg-gray-100 text-gray-700 ${isMobile ? 'w-full' : ''}`}
                      onClick={() => navigate("/history")}
                    >
                      {translate('app.viewAll')}
                    </Button>
                  </div>
                  
                  <TabsContent value="all" className={`${isMobile ? 'mt-0' : 'mt-4'}`}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      {historyData.slice(0, isMobile ? 3 : historyData.length).map((item) => (
                        <HistoryItem
                          key={item.id}
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
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="favorites" className={`${isMobile ? 'mt-0' : 'mt-4'}`}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      {historyData.filter(item => item.isFavorite).slice(0, isMobile ? 3 : historyData.length).map((item) => (
                        <HistoryItem
                          key={item.id}
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
