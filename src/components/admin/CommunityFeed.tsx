import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calendar } from "lucide-react";
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
      excerpt: "We're excited to announce the release of our enhanced customer service assistant with improved natural language processing...",
    },
    {
      id: "2", 
      title: "Best Practices for Workflow Automation",
      type: "Tutorial",
      author: "Sarah Chen",
      date: "2024-01-12",
      excerpt: "Learn how to optimize your workflow automation with these proven strategies and tips from our expert team...",
    },
    {
      id: "3",
      title: "Community Spotlight: Creative Use Cases",
      type: "Community",
      author: "Mike Johnson", 
      date: "2024-01-10",
      excerpt: "This week we're highlighting some of the most creative and innovative ways our community members are using AI assistants...",
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Post
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

              <div className="flex items-center pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {post.date}
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