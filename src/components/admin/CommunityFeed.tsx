import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, MessageSquare, Calendar, Tag } from "lucide-react";
import { CreatePostDialog } from "./CreatePostDialog";

const CommunityFeed = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);

  // Mock data for existing posts
  const posts = [
    {
      id: "1",
      title: "New AI Assistant Release: Customer Service Bot 2.0",
      type: "Product Update",
      author: "Admin Team",
      date: "2024-01-15",
      tags: ["product", "ai", "update"],
      excerpt: "We're excited to announce the release of our enhanced customer service assistant with improved natural language processing...",
      comments: 12,
    },
    {
      id: "2", 
      title: "Best Practices for Workflow Automation",
      type: "Tutorial",
      author: "Sarah Chen",
      date: "2024-01-12",
      tags: ["workflow", "automation", "tutorial"],
      excerpt: "Learn how to optimize your workflow automation with these proven strategies and tips from our expert team...",
      comments: 8,
    },
    {
      id: "3",
      title: "Community Spotlight: Creative Use Cases",
      type: "Community",
      author: "Mike Johnson", 
      date: "2024-01-10",
      tags: ["community", "showcase", "inspiration"],
      excerpt: "This week we're highlighting some of the most creative and innovative ways our community members are using AI assistants...",
      comments: 15,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Community Feed</h2>
          <p className="text-muted-foreground">
            Share updates, announcements, and engage with your community
          </p>
        </div>
        <Button 
          onClick={() => setCreatePostOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Post
        </Button>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                      {post.type}
                    </span>
                    <span className="text-muted-foreground text-sm">by {post.author}</span>
                  </div>
                  <h3 className="text-xl font-semibold hover:text-primary cursor-pointer transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {post.comments} comments
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CreatePostDialog 
        open={createPostOpen} 
        onOpenChange={setCreatePostOpen} 
      />
    </div>
  );
};

export default CommunityFeed;