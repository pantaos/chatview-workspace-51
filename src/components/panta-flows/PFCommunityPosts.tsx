import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Target } from "lucide-react";
import { mockPlatformPosts, mockTenants } from "@/data/pantaFlowsData";
import PFCreatePostDialog from "./PFCreatePostDialog";

const PFCommunityPosts = () => {
  const [createOpen, setCreateOpen] = useState(false);

  const getTenantName = (id: string) => mockTenants.find(t => t.id === id)?.name || id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Community Posts</h3>
          <p className="text-sm text-muted-foreground">Plattformweite Nachrichten an Tenants</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)} className="min-h-[44px]">
          <Plus className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Neuen Post erstellen</span>
        </Button>
      </div>

      <div className="space-y-3">
        {mockPlatformPosts.map((post) => (
          <Card key={post.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-semibold">{post.title}</h4>
                  <Badge variant="secondary" className="text-xs">{post.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {post.targetType === "all" ? (
                    <Badge variant="outline" className="text-xs"><Globe className="h-3 w-3 mr-1" /> Alle Tenants</Badge>
                  ) : (
                    post.targetTenants.map((tid) => (
                      <Badge key={tid} variant="outline" className="text-xs"><Target className="h-3 w-3 mr-1" /> {getTenantName(tid)}</Badge>
                    ))
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground">{post.createdAt}</div>
                <div className="text-xs text-muted-foreground">{post.author}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <PFCreatePostDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
};

export default PFCommunityPosts;
