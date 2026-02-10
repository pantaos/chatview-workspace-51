import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTenants } from "@/data/pantaFlowsData";
import { toast } from "@/hooks/use-toast";
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered, Quote, Link, Image, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
} from "@/components/ui/responsive-dialog";

interface PFCreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PFCreatePostDialog = ({ open, onOpenChange }: PFCreatePostDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [targetType, setTargetType] = useState<"all" | "specific">("all");
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);

  const toggleTenant = (id: string) => {
    setSelectedTenants((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) return;
    toast({ title: "Post erstellt", description: `„${title}" wurde veröffentlicht.` });
    resetForm();
    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    if (!title.trim()) return;
    toast({ title: "Entwurf gespeichert", description: `„${title}" wurde als Entwurf gespeichert.` });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("");
    setTargetType("all");
    setSelectedTenants([]);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} title="Neuen Post erstellen">
      <ResponsiveDialogContent>
        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Beitragstitel</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Beitragstitel eingeben..."
              className="h-11"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Beitragstyp</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Beitragstyp auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Feature Update">Feature Update</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Account Update">Account Update</SelectItem>
                <SelectItem value="Announcement">Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rich Editor */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Inhalt</Label>

            {/* Toolbar */}
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
              className="min-h-[180px] rounded-t-none border-t-0 resize-none"
            />
          </div>

          {/* Target */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Zielgruppe</Label>
            <Select value={targetType} onValueChange={(v) => setTargetType(v as "all" | "specific")}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Tenants</SelectItem>
                <SelectItem value="specific">Bestimmte Tenants</SelectItem>
              </SelectContent>
            </Select>

            {targetType === "specific" && (
              <div className="space-y-2 max-h-36 overflow-y-auto border rounded-md p-2">
                {mockTenants.map((tenant) => (
                  <label key={tenant.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer min-h-[44px]">
                    <Checkbox checked={selectedTenants.includes(tenant.id)} onCheckedChange={() => toggleTenant(tenant.id)} />
                    <span className="text-sm">{tenant.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </ResponsiveDialogContent>

      <ResponsiveDialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
        <Button variant="outline" onClick={handleSaveDraft} disabled={!title.trim()}>Entwurf</Button>
        <Button onClick={handleCreate} disabled={!title.trim() || !content.trim()}>Veröffentlichen</Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
};

export default PFCreatePostDialog;
