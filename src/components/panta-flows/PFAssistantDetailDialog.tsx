import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bot, Workflow, Plus, X } from "lucide-react";
import { AssistantWorkflow, TenantAssignment } from "@/types/pantaFlows";
import { mockTenants } from "@/data/pantaFlowsData";
import { toast } from "@/hooks/use-toast";

interface PFAssistantDetailDialogProps {
  item: AssistantWorkflow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PFAssistantDetailDialog = ({ item, open, onOpenChange }: PFAssistantDetailDialogProps) => {
  const [selectedTenant, setSelectedTenant] = useState("");
  const [visibility, setVisibility] = useState<"organization" | "admin-only">("organization");

  if (!item) return null;

  const Icon = item.type === "assistant" ? Bot : Workflow;
  const availableTenants = mockTenants.filter((t) => !item.assignments.some((a) => a.tenantId === t.id));

  const handleAssign = () => {
    if (!selectedTenant) return;
    const tenant = mockTenants.find((t) => t.id === selectedTenant);
    if (!tenant) return;
    toast({ title: "Zugeordnet", description: `${item.name} wurde ${tenant.name} zugeordnet.` });
    setSelectedTenant("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-muted/30 rounded-lg">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span>{item.name}</span>
                <Badge variant="secondary" className="text-xs">{item.type === "assistant" ? "Assistent" : "Workflow"}</Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">{item.description}</p>

        {/* Current assignments */}
        <div className="mt-4">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Zugeordnete Tenants</Label>
          {item.assignments.length > 0 ? (
            <div className="space-y-2 mt-2">
              {item.assignments.map((a) => {
                const tenant = mockTenants.find((t) => t.id === a.tenantId);
                return (
                  <div key={a.tenantId} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: tenant?.primaryColor || "#888" }}
                      >
                        {a.tenantName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{a.tenantName}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {a.visibility === "organization" ? "Alle" : "Nur Admin"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">Noch keinem Tenant zugeordnet.</p>
          )}
        </div>

        {/* Add assignment */}
        {availableTenants.length > 0 && (
          <div className="mt-4 border-t pt-4 space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tenant hinzufügen</Label>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Tenant auswählen…</option>
              {availableTenants.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "organization"}
                  onChange={() => setVisibility("organization")}
                  className="accent-primary"
                />
                <span className="text-sm">Gesamte Organisation</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "admin-only"}
                  onChange={() => setVisibility("admin-only")}
                  className="accent-primary"
                />
                <span className="text-sm">Nur Admin</span>
              </label>
            </div>

            <Button size="sm" onClick={handleAssign} disabled={!selectedTenant} className="w-full">
              <Plus className="h-4 w-4 mr-1" /> Zuordnen
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PFAssistantDetailDialog;
