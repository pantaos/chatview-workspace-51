import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/types/pantaFlows";
import { toast } from "@/hooks/use-toast";
import { Users, Coins, Activity, Plus } from "lucide-react";

interface PFTenantDetailDialogProps {
  tenant: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PFTenantDetailDialog = ({ tenant, open, onOpenChange }: PFTenantDetailDialogProps) => {
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"Admin" | "Super Admin">("Admin");

  if (!tenant) return null;

  const handleAddAdmin = () => {
    if (!newAdminName.trim() || !newAdminEmail.trim()) return;
    toast({ title: "Admin hinzugefügt", description: `${newAdminName} wurde als ${newAdminRole} hinzugefügt.` });
    setNewAdminName("");
    setNewAdminEmail("");
    setAddAdminOpen(false);
  };

  const tokenPercent = Math.round((tenant.tokensUsed / tenant.tokensLimit) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tenant.primaryColor }} />
            {tenant.name}
            <Badge variant={tenant.status === "active" ? "default" : "secondary"}>
              {tenant.status === "active" ? "Aktiv" : "Inaktiv"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="analytics" className="mt-4">
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto w-full justify-start">
            <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="theme" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">
              Theme
            </TabsTrigger>
            <TabsTrigger value="admins" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary">
              Admins
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Users className="h-4 w-4" /> Aktive User
                </div>
                <div className="text-2xl font-bold">{tenant.activeUsers} <span className="text-sm font-normal text-muted-foreground">/ {tenant.totalUsers}</span></div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Coins className="h-4 w-4" /> Token-Nutzung
                </div>
                <div className="text-2xl font-bold">{tenant.tokensUsed.toLocaleString()}</div>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(tokenPercent, 100)}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{tokenPercent}% von {tenant.tokensLimit.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Activity className="h-4 w-4" /> Status
                </div>
                <div className="text-2xl font-bold capitalize">{tenant.status}</div>
                <div className="text-xs text-muted-foreground mt-1">Seit {tenant.createdAt}</div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="mt-6 space-y-4">
            <div>
              <Label>Primärfarbe</Label>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-10 h-10 rounded border" style={{ backgroundColor: tenant.primaryColor }} />
                <Input value={tenant.primaryColor} readOnly className="flex-1" />
              </div>
            </div>
            <div>
              <Label>Akzentfarbe</Label>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-10 h-10 rounded border" style={{ backgroundColor: tenant.accentColor }} />
                <Input value={tenant.accentColor} readOnly className="flex-1" />
              </div>
            </div>
            <div>
              <Label>Logo-URL</Label>
              <Input value={tenant.logoUrl || "—"} readOnly className="mt-1" />
            </div>
          </TabsContent>

          <TabsContent value="admins" className="mt-6 space-y-4">
            {tenant.admins.length > 0 ? (
              <div className="space-y-2">
                {tenant.admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-sm text-muted-foreground">{admin.email}</div>
                    </div>
                    <Badge variant="secondary">{admin.role}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Noch keine Admins zugewiesen.</p>
            )}

            {!addAdminOpen ? (
              <Button variant="outline" size="sm" onClick={() => setAddAdminOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Admin hinzufügen
              </Button>
            ) : (
              <Card className="p-4 space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} placeholder="Name" />
                </div>
                <div>
                  <Label>E-Mail</Label>
                  <Input value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="email@example.com" />
                </div>
                <div>
                  <Label>Rolle</Label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as "Admin" | "Super Admin")}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddAdmin} disabled={!newAdminName.trim() || !newAdminEmail.trim()}>Hinzufügen</Button>
                  <Button size="sm" variant="outline" onClick={() => setAddAdminOpen(false)}>Abbrechen</Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PFTenantDetailDialog;
