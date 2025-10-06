import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronDown, ThumbsUp, Pin } from "lucide-react";
import ModernNavbar from "@/components/ModernNavbar";
import PromptDetailDialog from "@/components/PromptDetailDialog";
import NewWorkflowDialog from "@/components/NewWorkflowDialog";
import { WorkflowTag } from "@/types/workflow";

const CommunityFeed = () => {
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [promptDetailOpen, setPromptDetailOpen] = useState(false);
  const [newWorkflowDialogOpen, setNewWorkflowDialogOpen] = useState(false);
  const [prefilledPrompt, setPrefilledPrompt] = useState("");

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // Mock data for community posts
  const communityPosts = [
    {
      id: "1",
      date: "August 21",
      author: "Samantha Schriemer",
      title: "New AI Assistant Features Released",
      tags: [
        { name: "Platform Updates", color: "blue", icon: null },
        { name: "Pinned", color: "orange", icon: Pin }
      ],
      content: "We're excited to announce the release of our latest AI assistant features! This update includes improved natural language processing, better context understanding, and enhanced workflow automation capabilities.",
      fullContent: "We're excited to announce the release of our latest AI assistant features! This update includes improved natural language processing, better context understanding, and enhanced workflow automation capabilities.\n\nKey features in this release:\n• Advanced context retention across longer conversations\n• Improved integration with third-party APIs\n• Enhanced custom workflow builder with visual interface\n• Better performance optimization for enterprise deployments\n• New analytics dashboard for tracking assistant performance",
      reactions: {
        thumbsUp: 12,
        pin: 5
      },
      category: "latest"
    },
    {
      id: "2", 
      date: "August 20",
      author: "Samantha Schriemer",
      title: "Optimizing Your Workflow Performance",
      tags: [
        { name: "Company Updates", color: "orange", icon: null }
      ],
      content: "Learn how to maximize the efficiency of your AI workflows with these proven optimization strategies. From prompt engineering to resource management, we'll cover the essential techniques.",
      fullContent: "Learn how to maximize the efficiency of your AI workflows with these proven optimization strategies. From prompt engineering to resource management, we'll cover the essential techniques.\n\nOptimization techniques covered:\n• Prompt engineering best practices\n• Resource allocation strategies\n• Performance monitoring and analytics\n• Common bottlenecks and how to avoid them\n• Scaling considerations for growing teams",
      reactions: {
        thumbsUp: 8,
        pin: 2
      },
      category: "latest"
    },
    {
      id: "3",
      date: "August 19",
      author: "Mike Johnson",
      title: "Platform Maintenance Schedule - This Weekend",
      tags: [
        { name: "Platform Updates", color: "blue", icon: null },
        { name: "Pinned", color: "orange", icon: Pin }
      ],
      content: "We'll be performing scheduled maintenance this weekend from Saturday 2 AM to 4 AM EST. During this time, some services may be temporarily unavailable.",
      fullContent: "We'll be performing scheduled maintenance this weekend from Saturday 2 AM to 4 AM EST. During this time, some services may be temporarily unavailable.\n\nWhat to expect:\n• Brief service interruptions during the maintenance window\n• Improved system performance after completion\n• Enhanced security updates\n• Database optimization\n\nWe appreciate your patience as we work to improve your experience.",
      reactions: {
        thumbsUp: 15,
        pin: 8
      },
      category: "pinned"
    }
  ];

  const filterPostsByCategory = (category: string) => {
    if (category === "latest") {
      return communityPosts.filter(post => post.category === "latest");
    }
    if (category === "pinned") {
      return communityPosts.filter(post => post.tags.some(tag => tag.name === "Pinned"));
    }
    if (category === "company") {
      return communityPosts.filter(post => post.tags.some(tag => tag.name === "Company Updates"));
    }
    if (category === "platform") {
      return communityPosts.filter(post => post.tags.some(tag => tag.name === "Platform Updates"));
    }
    return communityPosts;
  };

  const promptCategories = [
    { id: "marketing", name: "Marketing", color: "#3B82F6" },
    { id: "social-media", name: "Social Media", color: "#10B981" },
    { id: "hr", name: "HR", color: "#F59E0B" },
    { id: "productivity", name: "Productivity", color: "#8B5CF6" },
    { id: "finance", name: "Finance", color: "#EF4444" },
    { id: "operations", name: "Operations", color: "#06B6D4" },
    { id: "research", name: "Research", color: "#84CC16" },
    { id: "personal", name: "Personal", color: "#EC4899" },
  ];

  const promptsByCategory: Record<string, any[]> = {
    "marketing": [
      {
        id: "m1",
        title: "Social Media Campaign Creator",
        description: "Generate engaging social media posts for multiple platforms",
        fullText: "You are an expert social media marketing assistant. Your role is to create engaging, platform-specific content that drives engagement and conversions. Generate posts optimized for each platform's unique audience and format requirements. Include relevant hashtags, call-to-actions, and trending topics when appropriate.",
        category: "marketing"
      },
      {
        id: "m2",
        title: "Email Marketing Optimizer",
        description: "Create compelling email campaigns with high conversion rates",
        fullText: "You are an email marketing specialist focused on creating high-converting email campaigns. Help craft subject lines, body content, and CTAs that resonate with target audiences. Optimize for mobile viewing, personalization, and A/B testing opportunities.",
        category: "marketing"
      },
      {
        id: "m3",
        title: "Brand Voice Developer",
        description: "Establish consistent brand messaging across all channels",
        fullText: "You are a brand strategist who helps develop and maintain consistent brand voice across all marketing channels. Analyze brand values, target audience, and competitive positioning to create authentic messaging that resonates with customers.",
        category: "marketing"
      },
      {
        id: "m4",
        title: "Content Calendar Planner",
        description: "Organize and schedule marketing content effectively",
        fullText: "You are a content planning expert who helps create comprehensive content calendars. Balance promotional content with educational and entertaining material. Consider seasonal trends, industry events, and audience preferences when planning.",
        category: "marketing"
      }
    ],
    "social-media": [
      {
        id: "s1",
        title: "LinkedIn Thought Leadership",
        description: "Craft professional posts that establish industry authority",
        fullText: "You are a LinkedIn content strategist specializing in thought leadership. Help professionals share insights, industry trends, and expertise in a way that builds authority and generates meaningful engagement. Focus on value-driven content that sparks professional conversations.",
        category: "social-media"
      },
      {
        id: "s2",
        title: "Instagram Story Creator",
        description: "Design engaging Instagram stories with interactive elements",
        fullText: "You are an Instagram marketing specialist focused on creating compelling stories. Suggest interactive elements like polls, quizzes, and questions. Optimize for vertical viewing and quick consumption. Include trending music and stickers when relevant.",
        category: "social-media"
      }
    ],
    "hr": [
      {
        id: "h1",
        title: "Job Description Writer",
        description: "Create compelling and inclusive job postings",
        fullText: "You are an HR specialist focused on writing inclusive, compelling job descriptions. Help create postings that attract diverse talent while clearly communicating role requirements, company culture, and growth opportunities. Use inclusive language and focus on skills over credentials.",
        category: "hr"
      },
      {
        id: "h2",
        title: "Employee Onboarding Advisor",
        description: "Design effective onboarding experiences for new hires",
        fullText: "You are an employee experience specialist focused on creating exceptional onboarding programs. Help design comprehensive onboarding plans that welcome new hires, set clear expectations, and accelerate time-to-productivity. Focus on cultural integration and relationship building.",
        category: "hr"
      }
    ],
    "productivity": [
      {
        id: "p1",
        title: "Meeting Agenda Generator",
        description: "Create structured agendas for productive meetings",
        fullText: "You are a productivity expert specializing in effective meetings. Help create clear agendas with time allocations, objectives, and action items. Focus on outcomes and ensure every meeting has a clear purpose and decision-making framework.",
        category: "productivity"
      },
      {
        id: "p2",
        title: "Task Priority Analyzer",
        description: "Prioritize tasks using proven frameworks",
        fullText: "You are a time management coach who helps professionals prioritize their work effectively. Use frameworks like Eisenhower Matrix and MoSCoW method. Help identify high-impact activities and reduce time spent on low-value tasks.",
        category: "productivity"
      }
    ],
    "finance": [
      {
        id: "f1",
        title: "Budget Planning Assistant",
        description: "Create comprehensive budgets and financial plans",
        fullText: "You are a financial planning expert who helps individuals and businesses create realistic budgets. Focus on income tracking, expense categorization, savings goals, and investment planning. Provide actionable insights for financial health.",
        category: "finance"
      },
      {
        id: "f2",
        title: "Financial Report Analyzer",
        description: "Analyze financial statements and provide insights",
        fullText: "You are a financial analyst specializing in interpreting financial data. Help analyze income statements, balance sheets, and cash flow statements. Identify trends, risks, and opportunities. Provide clear explanations of complex financial concepts.",
        category: "finance"
      }
    ],
    "operations": [
      {
        id: "o1",
        title: "Process Improvement Consultant",
        description: "Identify and optimize operational inefficiencies",
        fullText: "You are an operations consultant focused on process improvement. Help identify bottlenecks, streamline workflows, and implement lean principles. Focus on data-driven decisions and continuous improvement methodologies.",
        category: "operations"
      },
      {
        id: "o2",
        title: "SOP Documentation Expert",
        description: "Create clear standard operating procedures",
        fullText: "You are a technical writer specializing in standard operating procedures. Help create clear, step-by-step documentation that ensures consistency and quality. Focus on accessibility, visual aids, and regular updates.",
        category: "operations"
      }
    ],
    "research": [
      {
        id: "r1",
        title: "Literature Review Assistant",
        description: "Organize and synthesize academic research",
        fullText: "You are an academic research assistant who helps organize and synthesize scholarly literature. Help identify key themes, methodologies, and gaps in research. Create structured summaries and critical analyses of academic papers.",
        category: "research"
      },
      {
        id: "r2",
        title: "Market Research Analyst",
        description: "Conduct comprehensive market and competitor analysis",
        fullText: "You are a market research specialist who helps businesses understand their market landscape. Analyze competitor strategies, market trends, customer preferences, and industry dynamics. Provide actionable insights for strategic planning.",
        category: "research"
      }
    ],
    "personal": [
      {
        id: "pe1",
        title: "Personal Development Coach",
        description: "Guide personal growth and goal achievement",
        fullText: "You are a personal development coach focused on helping individuals achieve their goals. Provide guidance on goal setting, habit formation, and personal growth strategies. Use proven frameworks like SMART goals and growth mindset principles.",
        category: "personal"
      },
      {
        id: "pe2",
        title: "Learning Path Designer",
        description: "Create structured learning plans for skill development",
        fullText: "You are a learning and development specialist who helps people acquire new skills effectively. Design personalized learning paths with milestones, resources, and practice opportunities. Focus on active learning and knowledge retention.",
        category: "personal"
      }
    ]
  };

  const handlePromptClick = (prompt: any) => {
    setSelectedPrompt(prompt);
    setPromptDetailOpen(true);
  };

  const handleCreateAssistant = (promptText: string) => {
    setPrefilledPrompt(promptText);
    setNewWorkflowDialogOpen(true);
  };

  const handleWorkflowCreate = (workflow: any) => {
    console.log("Created workflow:", workflow);
    setNewWorkflowDialogOpen(false);
    setPrefilledPrompt("");
  };

  const renderPosts = (posts: typeof communityPosts) => (
    <div className="space-y-6">
      {posts.map((post) => {
        const isExpanded = expandedPosts.includes(post.id);
        return (
          <div key={post.id} className="bg-white dark:bg-slate-800 rounded-lg border p-6 space-y-4">
            {/* Post Header */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
              <span>•</span>
              <span className="font-medium text-foreground">{post.author}</span>
            </div>

            {/* Post Title */}
            <h3 className="text-xl font-semibold text-foreground">
              {post.title}
            </h3>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {post.tags.map((tag, index) => {
                const TagIcon = tag.icon;
                return (
                  <Badge 
                    key={index}
                    variant={
                      tag.color === "blue" ? "default" :
                      tag.color === "orange" ? "secondary" : "outline"
                    }
                    className="flex items-center gap-1"
                  >
                    {TagIcon && <TagIcon className="w-3 h-3" />}
                    {tag.name}
                  </Badge>
                );
              })}
            </div>

            {/* Post Content */}
            <div className="text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-line">{isExpanded ? post.fullContent : post.content}</p>
            </div>

            {/* Read More Button */}
            {post.fullContent !== post.content && (
              <Button
                variant="link"
                onClick={() => togglePostExpansion(post.id)}
                className="p-0 h-auto text-primary font-medium flex items-center gap-1"
              >
                {isExpanded ? "Show less" : "Read more"}
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </Button>
            )}

            {/* Reactions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 hover:bg-muted/50 rounded-full flex items-center gap-1"
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{post.reactions.thumbsUp}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 hover:bg-muted/50 rounded-full flex items-center gap-1"
              >
                <Pin className="w-4 h-4" />
                <span className="text-sm">{post.reactions.pin}</span>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Community Feed</h1>
            <p className="text-muted-foreground text-lg">
              Stay updated with the latest announcements, features, and community discussions
            </p>
          </div>

          <Tabs defaultValue="latest" className="w-full">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl mb-8">
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="pinned">Pinned</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="platform">Platform</TabsTrigger>
              <TabsTrigger value="prompt-library">Prompt Library</TabsTrigger>
            </TabsList>
            
            <TabsContent value="latest" className="mt-0">
              {renderPosts(filterPostsByCategory("latest"))}
            </TabsContent>
            
            <TabsContent value="pinned" className="mt-0">
              {renderPosts(filterPostsByCategory("pinned"))}
            </TabsContent>
            
            <TabsContent value="company" className="mt-0">
              {renderPosts(filterPostsByCategory("company"))}
            </TabsContent>
            
            <TabsContent value="platform" className="mt-0">
              {renderPosts(filterPostsByCategory("platform"))}
            </TabsContent>
            
            <TabsContent value="prompt-library" className="mt-0">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {promptCategories.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    return (
                      <Badge
                        key={category.id}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                      >
                        {category.name}
                      </Badge>
                    );
                  })}
                </div>

                {selectedCategory && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold capitalize">
                      {promptCategories.find(c => c.id === selectedCategory)?.name} Prompts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {promptsByCategory[selectedCategory]?.map((prompt) => (
                        <Card 
                          key={prompt.id}
                          className="p-4 cursor-pointer hover:border-primary transition-colors"
                          onClick={() => handlePromptClick(prompt)}
                        >
                          <h4 className="font-semibold mb-2">{prompt.title}</h4>
                          <p className="text-sm text-muted-foreground">{prompt.description}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {!selectedCategory && (
                  <Card className="p-6">
                    <p className="text-muted-foreground text-center">
                      Select a category above to browse prompt templates
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PromptDetailDialog
        open={promptDetailOpen}
        onClose={() => setPromptDetailOpen(false)}
        prompt={selectedPrompt}
        onCreateAssistant={handleCreateAssistant}
      />

      <NewWorkflowDialog
        open={newWorkflowDialogOpen}
        onClose={() => {
          setNewWorkflowDialogOpen(false);
          setPrefilledPrompt("");
        }}
        onCreateWorkflow={handleWorkflowCreate}
        prefilledPrompt={prefilledPrompt}
      />
    </div>
  );
};

export default CommunityFeed;