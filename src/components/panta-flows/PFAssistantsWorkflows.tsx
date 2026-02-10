import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Workflow, Link } from "lucide-react";
import { mockAssistantsWorkflows } from "@/data/pantaFlowsData";
import PFAssignDialog from "./PFAssignDialog";

const PFAssistantsWorkflows = () => {
  const [assignItem, setAssignItem] = useState<string | null>(null);
  const assignName = mockAssistantsWorkflows.find((a) => a.id === assignItem)?.name || "";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Assistenten & Workflows</h3>
        <p className="text-sm text-muted-foreground">Verfügbare Assistenten und Workflows aus dem Pool — Tenants zuordnen</p>
      </div>

      <div className="space-y-3">
        {mockAssistantsWorkflows.map((item) => {
          const Icon = item.type === "assistant" ? Bot : Workflow;
          return (
            <Card key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-muted/30 rounded-lg shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold">{item.name}</h4>
                      <Badge variant="secondary" className="text-xs">{item.type === "assistant" ? "Assistent" : "Workflow"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    {item.assignments.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {item.assignments.map((a) => (
                          <Badge key={a.tenantId} variant="outline" className="text-xs">
                            {a.tenantName} · {a.visibility === "organization" ? "Alle" : "Admin"}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setAssignItem(item.id)} className="shrink-0">
                  <Link className="h-3.5 w-3.5 mr-1" /> Zuordnen
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <PFAssignDialog open={!!assignItem} onOpenChange={(o) => !o && setAssignItem(null)} itemName={assignName} />
    </div>
  );
};

export default PFAssistantsWorkflows;
