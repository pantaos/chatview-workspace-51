import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Workflow } from "lucide-react";
import { mockAssistantsWorkflows } from "@/data/pantaFlowsData";
import { AssistantWorkflow } from "@/types/pantaFlows";
import PFAssistantDetailDialog from "./PFAssistantDetailDialog";

const PFAssistantsWorkflows = () => {
  const [selectedItem, setSelectedItem] = useState<AssistantWorkflow | null>(null);

  const assistants = mockAssistantsWorkflows.filter((item) => item.type === "assistant");
  const workflows = mockAssistantsWorkflows.filter((item) => item.type === "workflow");

  const renderCard = (item: AssistantWorkflow) => (
    <Card
      key={item.id}
      className="p-5 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => setSelectedItem(item)}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-muted/30 rounded-lg shrink-0">
          {item.type === "assistant" ? (
            <Bot className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Workflow className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold">{item.name}</h4>
            <Badge variant="secondary" className="text-xs">
              {item.type === "assistant" ? "Assistent" : "Workflow"}
            </Badge>
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
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Assistants Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Assistenten</h3>
          <p className="text-sm text-muted-foreground">KI-Assistenten aus dem Pool — Tenants zuordnen</p>
        </div>
        <div className="space-y-3">
          {assistants.map(renderCard)}
        </div>
      </div>

      {/* Workflows Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Workflows</h3>
          <p className="text-sm text-muted-foreground">Workflows aus dem Pool — Tenants zuordnen</p>
        </div>
        <div className="space-y-3">
          {workflows.map(renderCard)}
        </div>
      </div>

      <PFAssistantDetailDialog
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(o) => !o && setSelectedItem(null)}
      />
    </div>
  );
};

export default PFAssistantsWorkflows;
