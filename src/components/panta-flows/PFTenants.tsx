import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { mockTenants } from "@/data/pantaFlowsData";
import { Tenant } from "@/types/pantaFlows";
import PFCreateTenantDialog from "./PFCreateTenantDialog";
import PFTenantDetailDialog from "./PFTenantDetailDialog";

const PFTenants = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Tenants</h3>
          <p className="text-sm text-muted-foreground">{mockTenants.length} Organisationen verwaltet</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Neuen Tenant anlegen
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTenants.map((tenant) => (
          <Card
            key={tenant.id}
            className="p-5 cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => setSelectedTenant(tenant)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tenant.primaryColor }} />
                <h4 className="font-semibold">{tenant.name}</h4>
              </div>
              <Badge variant={tenant.status === "active" ? "default" : "secondary"}>
                {tenant.status === "active" ? "Aktiv" : "Inaktiv"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tenant.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {tenant.totalUsers} User</span>
              <span>{tenant.tokensUsed.toLocaleString()} Tokens</span>
            </div>
          </Card>
        ))}
      </div>

      <PFCreateTenantDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={() => {}} />
      <PFTenantDetailDialog tenant={selectedTenant} open={!!selectedTenant} onOpenChange={(o) => !o && setSelectedTenant(null)} />
    </div>
  );
};

export default PFTenants;
