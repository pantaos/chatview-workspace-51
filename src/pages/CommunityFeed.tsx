import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronDown, ThumbsUp, Pin } from "lucide-react";
import ModernNavbar from "@/components/ModernNavbar";

const CommunityFeed = () => {
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </Badge>
                    );
                  })}
                </div>

                {selectedCategory && (
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 capitalize">
                      {promptCategories.find(c => c.id === selectedCategory)?.name} Prompts
                    </h3>
                    <p className="text-muted-foreground">
                      Prompt templates for {promptCategories.find(c => c.id === selectedCategory)?.name.toLowerCase()} will appear here.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;