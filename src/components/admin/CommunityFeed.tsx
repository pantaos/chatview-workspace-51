import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calendar, Edit2, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePostDialog } from "./CreatePostDialog";
import { Badge } from "@/components/ui/badge";

const CommunityFeed = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);

  // Mock data for existing posts
  const publishedPosts = [
    {
      id: "1",
      title: "PANTA Upskilling x W&V Academy: Certified AI Expert Program",
      type: "Unternehmens-Update",
      author: "Sam",
      date: "29. Sept. 2025",
      excerpt: "AI is reshaping marketing and communications. New tools emerge every week, while companies need orientation and training they can actually use. Wit...",
      status: "published",
    },
    {
      id: "2", 
      title: "Best Practices for Workflow Automation",
      type: "Plattform-Update",
      author: "Sarah Chen",
      date: "12. Jan. 2025",
      excerpt: "Learn how to optimize your workflow automation with these proven strategies and tips from our expert team...",
      status: "published",
    },
    {
      id: "3",
      title: "Community Spotlight: Creative Use Cases",
      type: "Plattform-Update",
      author: "Mike Johnson", 
      date: "10. Jan. 2025",
      excerpt: "This week we're highlighting some of the most creative and innovative ways our community members are using AI assistants...",
      status: "published",
    },
    {
      id: "4",
      title: "New AI Assistant Release: Customer Service Bot 2.0",
      type: "Unternehmens-Update",
      author: "Admin Team",
      date: "15. Jan. 2025",
      excerpt: "We're excited to announce the release of our enhanced customer service assistant with improved natural language processing...",
      status: "published",
    }
  ];

  const draftPosts = [
    {
      id: "5",
      title: "Upcoming Features Preview: Q2 2025 Roadmap",
      type: "Plattform-Update",
      author: "Admin Team",
      date: "20. Jan. 2025",
      excerpt: "Get an exclusive preview of the exciting new features we're planning to release in Q2 2025...",
      status: "draft",
    }
  ];

  const handleEditPost = (postId: string) => {
    console.log('Edit post:', postId);
    // TODO: Implement edit functionality
  };

  const handleDeletePost = (postId: string) => {
    console.log('Delete post:', postId);
    // TODO: Implement delete functionality
  };

  const getTypeBadgeStyles = (type: string) => {
    if (type === "Unternehmens-Update") {
      return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
    }
    return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
  };

  const renderPosts = (posts: typeof publishedPosts) => (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              {/* Meta row: Date, Author, Type Badge */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <span className="text-muted-foreground/50">•</span>
                <span>{post.author}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${getTypeBadgeStyles(post.type)}`}
                >
                  {post.type}
                </Badge>
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                {post.title}
              </h3>
              
              {/* Excerpt */}
              <p className="text-muted-foreground text-sm line-clamp-2">
                {post.excerpt}
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditPost(post.id)}
                className="h-9 px-3"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Bearbeiten
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeletePost(post.id)}
                className="h-9 px-3 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Löschen
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Community Feed Management</h2>
          <p className="text-muted-foreground mt-1">
            Community-Beiträge erstellen und verwalten
          </p>
        </div>
        <Button 
          onClick={() => setCreatePostOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neuen Beitrag erstellen
        </Button>
      </div>

      <Tabs defaultValue="published" className="w-full">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="published" className="px-4 py-2">
            Veröffentlicht ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" className="px-4 py-2">
            Entwürfe ({draftPosts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="published" className="mt-6">
          {renderPosts(publishedPosts)}
        </TabsContent>
        
        <TabsContent value="drafts" className="mt-6">
          {draftPosts.length > 0 ? renderPosts(draftPosts) : (
            <div className="text-center py-12 text-muted-foreground">
              Keine Entwürfe vorhanden
            </div>
          )}
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
