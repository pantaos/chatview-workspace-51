import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Workflow, Plus, X, Check } from "lucide-react";
import { AssistantWorkflow } from "@/types/pantaFlows";
import { mockTenants } from "@/data/pantaFlowsData";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogTabs,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";

interface PFAssistantDetailDialogProps {
  item: AssistantWorkflow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tabs = [
  { id: "general", label: "General" },
  { id: "tenants", label: "Tenants" },
];

const PFAssistantDetailDialog = ({ item, open, onOpenChange }: PFAssistantDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [visibility, setVisibility] = useState<"organization" | "admin-only">("organization");
  const isMobile = useIsMobile();

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

  const handleRemove = (tenantName: string) => {
    toast({ title: "Entfernt", description: `${tenantName} wurde von ${item.name} entfernt.` });
  };

  const useCases = item.type === "assistant"
    ? ["Beantwortet Fragen der Mitarbeiter", "Unterstützt bei der Recherche", "Fasst Dokumente zusammen", "Automatisiert Routineaufgaben"]
    : ["Automatisiert wiederkehrende Prozesse", "Verbindet mehrere Systeme", "Reduziert manuelle Arbeit", "Standardisiert Abläufe"];

  const renderContent = () => {
    if (activeTab === "general") {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-muted/40 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <Badge variant="secondary" className="text-xs">
                  {item.type === "assistant" ? "Assistent" : "Workflow"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.assignments.length} Tenant{item.assignments.length !== 1 ? "s" : ""} zugeordnet
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{item.description}</p>

          <div>
            <h3 className="text-sm font-medium mb-3">Use Cases</h3>
            <ul className="space-y-2">
              {useCases.map((uc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Current assignments */}
        <div>
          <h3 className="text-sm font-medium mb-3">Zugeordnete Tenants</h3>
          {item.assignments.length > 0 ? (
            <div className="space-y-2">
              {item.assignments.map((a) => {
                const tenant = mockTenants.find((t) => t.id === a.tenantId);
                return (
                  <div key={a.tenantId} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: tenant?.primaryColor || "#888" }}
                      >
                        {a.tenantName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{a.tenantName}</span>
                      <Badge variant="outline" className="text-xs">
                        {a.visibility === "organization" ? "Alle" : "Nur Admin"}
                      </Badge>
                    </div>
                    <button
                      onClick={() => handleRemove(a.tenantName)}
                      className="p-1.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Noch keinem Tenant zugeordnet.</p>
          )}
        </div>

        {/* Add assignment */}
        {availableTenants.length > 0 && (
          <div className="border-t border-border/40 pt-4 space-y-3">
            <h3 className="text-sm font-medium">Tenant hinzufügen</h3>
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

            <Button size="sm" onClick={handleAssign} disabled={!selectedTenant} className="w-full min-h-[44px]">
              <Plus className="h-4 w-4 mr-1" /> Zuordnen
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={item.name}
    >
      <ResponsiveDialogBody
        sidebar={
          <ResponsiveDialogTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        }
      >
        {isMobile && (
          <ResponsiveDialogTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
        <ResponsiveDialogContent>
          {renderContent()}
        </ResponsiveDialogContent>
      </ResponsiveDialogBody>
    </ResponsiveDialog>
  );
};

export default PFAssistantDetailDialog;
