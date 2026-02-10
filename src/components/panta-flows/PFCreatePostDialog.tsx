import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { mockTenants } from "@/data/pantaFlowsData";
import { toast } from "@/hooks/use-toast";

interface PFCreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PFCreatePostDialog = ({ open, onOpenChange }: PFCreatePostDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("Feature Update");
  const [targetType, setTargetType] = useState<"all" | "specific">("all");
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);

  const toggleTenant = (id: string) => {
    setSelectedTenants((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) return;
    toast({ title: "Post erstellt", description: `„${title}" wurde veröffentlicht.` });
    setTitle("");
    setContent("");
    setType("Feature Update");
    setTargetType("all");
    setSelectedTenants([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Neuen Post erstellen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Titel *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post-Titel" />
          </div>
          <div>
            <Label>Inhalt *</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Inhalt des Posts…" rows={4} />
          </div>
          <div>
            <Label>Typ</Label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option>Feature Update</option>
              <option>Maintenance</option>
              <option>Account Update</option>
              <option>Announcement</option>
            </select>
          </div>
          <div>
            <Label className="mb-2 block">Zielgruppe</Label>
            <select value={targetType} onChange={(e) => setTargetType(e.target.value as "all" | "specific")} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm mb-2">
              <option value="all">Alle Tenants</option>
              <option value="specific">Bestimmte Tenants</option>
            </select>
            {targetType === "specific" && (
              <div className="space-y-2 max-h-36 overflow-y-auto border rounded-md p-2">
                {mockTenants.map((tenant) => (
                  <label key={tenant.id} className="flex items-center gap-3 p-1.5 rounded hover:bg-muted/50 cursor-pointer">
                    <Checkbox checked={selectedTenants.includes(tenant.id)} onCheckedChange={() => toggleTenant(tenant.id)} />
                    <span className="text-sm">{tenant.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleCreate} disabled={!title.trim() || !content.trim()} className="w-full">Veröffentlichen</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PFCreatePostDialog;
