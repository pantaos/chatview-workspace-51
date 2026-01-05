import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link, Image, Film, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
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
    "Alle Benutzer:innen",
    "Rohan team",
    "Robert Sales", 
    "Johannes KI",
    "Dev Team1",
    "Product",
    "Social Media Team"
  ];

  const handleUserGroupChange = (userGroup: string, checked: boolean) => {
    setSelectedUserGroups(prev => 
      checked 
        ? [...prev, userGroup]
        : prev.filter(g => g !== userGroup)
    );
  };

  const resetForm = () => {
    setTitle("");
    setType("");
    setContent("");
    setSelectedUserGroups([]);
  };

  const handlePublish = () => {
    if (!title || !type || !content) {
      toast.error("Bitte alle Pflichtfelder ausfüllen");
      return;
    }
    
    toast.success("Beitrag erfolgreich veröffentlicht!");
    onOpenChange(false);
    resetForm();
  };

  const handleSaveDraft = () => {
    if (!title) {
      toast.error("Bitte einen Titel eingeben");
      return;
    }
    
    toast.success("Entwurf gespeichert!");
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Neuen Community-Beitrag erstellen</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Beitragstitel */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Beitragstitel
            </Label>
            <Input
              id="title"
              placeholder="Beitragstitel eingeben..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Beitragstyp */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Beitragstyp
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Beitragstyp auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company-update">Unternehmens-Update</SelectItem>
                <SelectItem value="platform-update">Plattform-Update</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inhaltstyp (Rich Editor) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Inhaltstyp
            </Label>
            
            {/* Rich Text Editor Toolbar */}
            <div className="flex items-center gap-0.5 p-2 border rounded-t-lg bg-muted/30 flex-wrap">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Code className="h-4 w-4" />
              </Button>
              
              <div className="h-6 w-px bg-border mx-1" />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heading3 className="h-4 w-4" />
              </Button>
              
              <div className="h-6 w-px bg-border mx-1" />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Quote className="h-4 w-4" />
              </Button>
              
              <div className="h-6 w-px bg-border mx-1" />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Film className="h-4 w-4" />
              </Button>
              
              <div className="h-6 w-px bg-border mx-1" />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Textarea
              placeholder="Schreibe deinen Beitrag..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] rounded-t-none border-t-0 resize-none"
            />
          </div>

          {/* Zielgruppe */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Zielgruppe
            </Label>

            <div className="grid grid-cols-2 gap-3">
              {userGroups.map((userGroup) => (
                <label 
                  key={userGroup} 
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedUserGroups.includes(userGroup)}
                    onCheckedChange={(checked) => handleUserGroupChange(userGroup, checked as boolean)}
                  />
                  <span className="text-sm">{userGroup}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-4 border-t bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Beitrag ist sichtbar für ausgewählte Benutzergruppen
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Abbrechen
            </Button>
            <Button 
              variant="outline"
              onClick={handleSaveDraft}
            >
              Als Entwurf speichern
            </Button>
            <Button 
              onClick={handlePublish}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Veröffentlichen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
