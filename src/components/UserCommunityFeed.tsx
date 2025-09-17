import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronDown, X, Heart, ThumbsUp, Flame, Pin, Smile, Star, Lightbulb } from "lucide-react";

interface UserCommunityFeedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserCommunityFeed = ({ open, onOpenChange }: UserCommunityFeedProps) => {
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);

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
        { name: "Pinned", color: "orange", icon: Pin },
        { name: "Hot", color: "red", icon: Flame }
      ],
      content: "We're excited to announce the release of our latest AI assistant features! This update includes improved natural language processing, better context understanding, and enhanced workflow automation capabilities. These improvements will help you create more sophisticated and responsive AI assistants for your specific use cases.",
      fullContent: "We're excited to announce the release of our latest AI assistant features! This update includes improved natural language processing, better context understanding, and enhanced workflow automation capabilities. These improvements will help you create more sophisticated and responsive AI assistants for your specific use cases.\n\nKey features in this release:\n• Advanced context retention across longer conversations\n• Improved integration with third-party APIs\n• Enhanced custom workflow builder with visual interface\n• Better performance optimization for enterprise deployments\n• New analytics dashboard for tracking assistant performance",
      reactions: [
        { emoji: "📌", count: 5 },
        { emoji: "👍", count: 12 },
        { emoji: "❤️", count: 8 },
        { emoji: "😍", count: 3 },
        { emoji: "🤯", count: 2 }
      ],
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
      content: "Learn how to maximize the efficiency of your AI workflows with these proven optimization strategies. From prompt engineering to resource management, we'll cover the essential techniques that can dramatically improve your assistant's performance.",
      fullContent: "Learn how to maximize the efficiency of your AI workflows with these proven optimization strategies. From prompt engineering to resource management, we'll cover the essential techniques that can dramatically improve your assistant's performance.\n\nOptimization techniques covered:\n• Prompt engineering best practices\n• Resource allocation strategies\n• Performance monitoring and analytics\n• Common bottlenecks and how to avoid them\n• Scaling considerations for growing teams",
      reactions: [
        { emoji: "👍", count: 8 },
        { emoji: "💡", count: 6 },
        { emoji: "🚀", count: 4 }
      ],
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
      content: "We'll be performing scheduled maintenance this weekend from Saturday 2 AM to 4 AM EST. During this time, some services may be temporarily unavailable. We'll work to minimize any disruption.",
      fullContent: "We'll be performing scheduled maintenance this weekend from Saturday 2 AM to 4 AM EST. During this time, some services may be temporarily unavailable. We'll work to minimize any disruption.\n\nWhat to expect:\n• Brief service interruptions during the maintenance window\n• Improved system performance after completion\n• Enhanced security updates\n• Database optimization\n\nWe appreciate your patience as we work to improve your experience.",
      reactions: [
        { emoji: "👍", count: 15 },
        { emoji: "📌", count: 8 }
      ],
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

  const renderPosts = (posts: typeof communityPosts) => (
    <div className="space-y-6">
      {posts.map((post) => {
        const isExpanded = expandedPosts.includes(post.id);
        return (
          <div key={post.id} className="bg-white rounded-lg border p-6 space-y-4">
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
                      tag.color === "orange" ? "secondary" :
                      tag.color === "red" ? "destructive" : "outline"
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
              <p>{isExpanded ? post.fullContent : post.content}</p>
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
            <div className="flex items-center gap-1 pt-2 border-t">
              {post.reactions.map((reaction, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 hover:bg-muted/50 rounded-full"
                >
                  <span className="text-base mr-1">{reaction.emoji}</span>
                  <span className="text-xs text-muted-foreground">{reaction.count}</span>
                </Button>
              ))}
              
              {/* Add reaction button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50 rounded-full ml-2"
              >
                <Smile className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <DialogTitle className="text-2xl font-bold">Community Feed</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="pinned">Pinned</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="platform">Platform</TabsTrigger>
          </TabsList>
          
          <TabsContent value="latest" className="mt-6">
            {renderPosts(filterPostsByCategory("latest"))}
          </TabsContent>
          
          <TabsContent value="pinned" className="mt-6">
            {renderPosts(filterPostsByCategory("pinned"))}
          </TabsContent>
          
          <TabsContent value="company" className="mt-6">
            {renderPosts(filterPostsByCategory("company"))}
          </TabsContent>
          
          <TabsContent value="platform" className="mt-6">
            {renderPosts(filterPostsByCategory("platform"))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};