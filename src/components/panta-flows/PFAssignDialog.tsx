import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { mockTenants } from "@/data/pantaFlowsData";
import { toast } from "@/hooks/use-toast";

interface PFAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
}

const PFAssignDialog = ({ open, onOpenChange, itemName }: PFAssignDialogProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<"admin-only" | "organization">("organization");

  const toggleTenant = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const handleAssign = () => {
    toast({ title: "Zuordnung gespeichert", description: `${itemName} wurde ${selected.length} Tenant(s) zugeordnet.` });
    setSelected([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>„{itemName}" zuordnen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="mb-2 block">Tenants auswählen</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {mockTenants.filter(t => t.status === "active").map((tenant) => (
                <label key={tenant.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                  <Checkbox checked={selected.includes(tenant.id)} onCheckedChange={() => toggleTenant(tenant.id)} />
                  <span className="text-sm">{tenant.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Sichtbarkeit</Label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as "admin-only" | "organization")}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="organization">Gesamte Organisation</option>
              <option value="admin-only">Nur Admin</option>
            </select>
          </div>
          <Button onClick={handleAssign} disabled={selected.length === 0} className="w-full">Zuordnen</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PFAssignDialog;
