import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Integration } from "./AdminIntegrations";

interface AddIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableIntegrations: Integration[];
  onAddIntegration: (integrationId: string) => void;
}

export const AddIntegrationDialog = ({
  open,
  onOpenChange,
  availableIntegrations,
  onAddIntegration,
}: AddIntegrationDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIntegrations = availableIntegrations.filter(
    (integration) =>
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (integrationId: string) => {
    onAddIntegration(integrationId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Integration hinzufügen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Integration suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredIntegrations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Keine Integrationen verfügbar
              </p>
            ) : (
              filteredIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 ${integration.iconBg} rounded-lg flex items-center justify-center`}
                    >
                      {integration.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAdd(integration.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Hinzufügen
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
