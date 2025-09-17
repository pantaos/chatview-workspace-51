import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Bold, Italic, List, Link, Image, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { toast } from "sonner";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostDialog = ({ open, onOpenChange }: CreatePostDialogProps) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);

  const userGroups = [
    "All Users",
    "Sales Team",
    "Marketing Team", 
    "Customer Support",
    "Engineering Team",
    "Management"
  ];

  const handleUserGroupChange = (userGroup: string) => {
    setSelectedUserGroups(prev => 
      prev.includes(userGroup) 
        ? prev.filter(g => g !== userGroup)
        : [...prev, userGroup]
    );
  };

  const handleSubmit = () => {
    if (!title || !type || !content) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Community post created successfully!");
    onOpenChange(false);
    
    // Reset form
    setTitle("");
    setType("");
    setContent("");
    setSelectedUserGroups([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <DialogTitle className="text-xl font-semibold">Create New Community Post</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2 border-primary/20 focus:border-primary rounded-xl"
            />
          </div>

          {/* Type */}
          <div className="space-y-1">
            <Label htmlFor="type" className="text-sm font-medium">
              Type
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select post type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform-update">Platform Update</SelectItem>
                <SelectItem value="company-update">Company Update</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-1">
            <Label htmlFor="content" className="text-sm font-medium">
              Content
            </Label>
            
            {/* Rich Text Editor Toolbar */}
            <div className="flex items-center gap-1 p-2 border rounded-t-xl bg-muted/30">
              <Select defaultValue="paragraph">
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="heading1">Heading 1</SelectItem>
                  <SelectItem value="heading2">Heading 2</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="h-4 w-px bg-border mx-1" />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bold className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Italic className="h-3 w-3" />
              </Button>
              
              <div className="h-4 w-px bg-border mx-1" />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-3 w-3" />
              </Button>
              
              <div className="h-4 w-px bg-border mx-1" />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <AlignLeft className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <AlignCenter className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <AlignRight className="h-3 w-3" />
              </Button>
              
              <div className="h-4 w-px bg-border mx-1" />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Link className="h-3 w-3" />
              </Button>
              <Button variant="outline" className="h-8 px-3 text-xs">
                <Image className="h-3 w-3 mr-1" />
                Add Media
              </Button>
            </div>
            
            <Textarea
              id="content"
              placeholder="Write your post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-48 rounded-t-none border-t-0 rounded-b-xl resize-none"
            />
          </div>

          {/* Audience */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">
              Audience
            </Label>

            {/* User Groups */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-muted flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-foreground" />
                </div>
                <span className="font-medium">User Groups</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {userGroups.map((userGroup) => (
                  <label key={userGroup} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUserGroups.includes(userGroup)}
                      onChange={() => handleUserGroupChange(userGroup)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm">{userGroup}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <DialogClose asChild>
            <Button variant="outline" className="px-6">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit}
            className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            Create Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};