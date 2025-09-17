import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calendar, Eye, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePostDialog } from "./CreatePostDialog";

const CommunityFeed = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);

  // Mock data for existing posts
  const publishedPosts = [
    {
      id: "1",
      title: "New AI Assistant Release: Customer Service Bot 2.0",
      type: "Platform Update",
      author: "Admin Team",
      date: "2024-01-15",
      excerpt: "We're excited to announce the release of our enhanced customer service assistant with improved natural language processing...",
      status: "published",
    },
    {
      id: "2", 
      title: "Best Practices for Workflow Automation",
      type: "Company Update",
      author: "Sarah Chen",
      date: "2024-01-12",
      excerpt: "Learn how to optimize your workflow automation with these proven strategies and tips from our expert team...",
      status: "published",
    },
    {
      id: "3",
      title: "Community Spotlight: Creative Use Cases",
      type: "Platform Update",
      author: "Mike Johnson", 
      date: "2024-01-10",
      excerpt: "This week we're highlighting some of the most creative and innovative ways our community members are using AI assistants...",
      status: "published",
    }
  ];

  const draftPosts = [
    {
      id: "4",
      title: "Upcoming Features Preview: Q2 2024 Roadmap",
      type: "Platform Update",
      author: "Admin Team",
      date: "2024-01-20",
      excerpt: "Get an exclusive preview of the exciting new features we're planning to release in Q2 2024...",
      status: "draft",
    },
    {
      id: "5",
      title: "Advanced Prompt Engineering Techniques",
      type: "Company Update", 
      author: "Emma Wilson",
      date: "2024-01-18",
      excerpt: "Master the art of prompt engineering with these advanced techniques and real-world examples...",
      status: "draft",
    }
  ];

  const renderPosts = (posts: typeof publishedPosts) => (
    <div className="grid gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                    {post.type}
                  </span>
                  <span className="text-muted-foreground text-sm">by {post.author}</span>
                  {post.status === "published" ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full font-medium">
                      <Eye className="w-3 h-3" />
                      Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full font-medium">
                      <Edit className="w-3 h-3" />
                      Draft
                    </span>
                  )}
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
  );

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

      <Tabs defaultValue="published" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="published" className="flex items-center gap-2">
            Published ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center gap-2">
            Drafts ({draftPosts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="published" className="mt-6">
          {renderPosts(publishedPosts)}
        </TabsContent>
        
        <TabsContent value="drafts" className="mt-6">
          {renderPosts(draftPosts)}
        </TabsContent>
      </Tabs>

      <CreatePostDialog 
        open={createPostOpen} 
        onOpenChange={setCreatePostOpen} 
      />
    </div>
  );
};

export default CommunityFeed;