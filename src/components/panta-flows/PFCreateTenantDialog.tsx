import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";

interface PFCreateTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const PFCreateTenantDialog = ({ open, onOpenChange, onCreated }: PFCreateTenantDialogProps) => {
  const [name, setName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#1E40AF");
  const [accentColor, setAccentColor] = useState("#3B82F6");
  const [backgroundColor, setBackgroundColor] = useState("#F0F4FF");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    toast({ title: "Tenant erstellt", description: `${name} wurde erfolgreich angelegt.` });
    setName("");
    setLogoPreview(null);
    setPrimaryColor("#1E40AF");
    setAccentColor("#3B82F6");
    setBackgroundColor("#F0F4FF");
    onCreated();
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} title="Neuen Tenant anlegen">
      <ResponsiveDialogContent>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Acme Corp" />
          </div>

          <div>
            <Label>Logo</Label>
            <div className="mt-1 flex items-center gap-3">
              {logoPreview ? (
                <div className="relative">
                  <img src={logoPreview} alt="Logo" className="w-16 h-16 rounded-lg object-cover border" />
                  <button
                    onClick={() => { setLogoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <span className="text-sm text-muted-foreground">PNG, JPG bis 2 MB</span>
            </div>
          </div>

          <div>
            <Label>Primärfarbe</Label>
            <div className="flex items-center gap-3 mt-1">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
              <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
            </div>
          </div>

          <div>
            <Label>Akzentfarbe</Label>
            <div className="flex items-center gap-3 mt-1">
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
              <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1" />
            </div>
          </div>

          <div>
            <Label>Hintergrundfarbe</Label>
            <div className="flex items-center gap-3 mt-1">
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
              <Input value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1" />
            </div>
          </div>

          <Button onClick={handleCreate} disabled={!name.trim()} className="w-full min-h-[44px]">Erstellen</Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default PFCreateTenantDialog;
