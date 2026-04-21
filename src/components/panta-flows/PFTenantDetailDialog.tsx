import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tenant, PendingInvite } from "@/types/pantaFlows";
import { toast } from "@/hooks/use-toast";
import { Users, Coins, Activity, Plus, MessageSquare, Clock, Bot, Upload, X, Download, Trash2, Send, Pencil, Wallet } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { EUR_PER_1K_TOKENS } from "@/data/billingData";
import { cn } from "@/lib/utils";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogTabs,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";

interface PFTenantDetailDialogProps {
  tenant: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockTokenHistory = [
  { date: "KW 1", tokens: 1200 },
  { date: "KW 2", tokens: 1800 },
  { date: "KW 3", tokens: 2400 },
  { date: "KW 4", tokens: 2100 },
  { date: "KW 5", tokens: 3200 },
  { date: "KW 6", tokens: 2800 },
  { date: "KW 7", tokens: 3500 },
  { date: "KW 8", tokens: 3100 },
];

const mockTopAssistants = [
  { name: "TonalitätsGPT", requests: 342, tokens: 8200 },
  { name: "ArianGPT", requests: 218, tokens: 5100 },
  { name: "Content Workflow", requests: 156, tokens: 3800 },
];

const mockPendingInvites: PendingInvite[] = [
  { id: "inv1", email: "m.schmidt@hdi.de", role: "Admin", invitedOn: "2025-08-19" },
  { id: "inv2", email: "k.braun@hdi.de", role: "Admin", invitedOn: "2025-12-09" },
];

const chartConfig = {
  tokens: { label: "Tokens", color: "hsl(var(--primary))" },
};

const dialogTabs = [
  { id: "analytics", label: "Analytics" },
  { id: "billing", label: "Billing" },
  { id: "theme", label: "Theme" },
  { id: "admins", label: "Admins" },
];

const formatEur = (n: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

const usageColor = (pct: number) =>
  pct >= 90 ? "bg-destructive" : pct >= 75 ? "bg-amber-500" : "bg-primary";

const PFTenantDetailDialog = ({ tenant, open, onOpenChange }: PFTenantDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [adminSubTab, setAdminSubTab] = useState("active");
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"Admin" | "Super Admin">("Admin");
  const [primaryColor, setPrimaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [planName, setPlanName] = useState(tenant?.planName ?? "Pro");
  const [planBudgetEur, setPlanBudgetEur] = useState<number | string>(tenant?.planBudgetEur ?? 50);
  const [overageEnabled, setOverageEnabled] = useState(tenant?.overageEnabled ?? false);
  const [overageCapEur, setOverageCapEur] = useState<number | string>(tenant?.overageCapEur ?? 0);

  useEffect(() => {
    if (tenant) {
      setPlanName(tenant.planName ?? "Pro");
      setPlanBudgetEur(tenant.planBudgetEur ?? 50);
      setOverageEnabled(tenant.overageEnabled ?? false);
      setOverageCapEur(tenant.overageCapEur ?? 0);
    }
  }, [tenant?.id]);

  if (!tenant) return null;

  const planBudgetNum = Number(planBudgetEur) || 0;
  const overageCapNum = Number(overageCapEur) || 0;

  const pc = primaryColor || tenant.primaryColor;
  const ac = accentColor || tenant.accentColor;
  const bc = bgColor || tenant.backgroundColor || "#F0F4FF";

  const handleAddAdmin = () => {
    if (!newAdminName.trim() || !newAdminEmail.trim()) return;
    toast({ title: "Admin hinzugefügt", description: `${newAdminName} wurde als ${newAdminRole} hinzugefügt.` });
    setNewAdminName("");
    setNewAdminEmail("");
    setAddAdminOpen(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleSaveTheme = () => {
    toast({ title: "Theme gespeichert", description: "Die Änderungen wurden übernommen." });
  };

  const tokenPercent = Math.round((tenant.tokensUsed / tenant.tokensLimit) * 100);
  const currentLogo = logoPreview || tenant.logoUrl;

  const titleContent = (
    <span className="flex items-center gap-3">
      {currentLogo ? (
        <img src={currentLogo} alt={tenant.name} className="w-6 h-6 rounded-full object-cover border" />
      ) : (
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: tenant.primaryColor }}>
          {tenant.name.charAt(0)}
        </div>
      )}
      {tenant.name}
      <Badge variant={tenant.status === "active" ? "default" : "secondary"} className="text-xs">
        {tenant.status === "active" ? "Aktiv" : "Inaktiv"}
      </Badge>
    </span>
  );

  const renderContent = () => {
    if (activeTab === "analytics") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Users className="h-3.5 w-3.5" /> Aktive User
              </div>
              <div className="text-2xl font-bold">{tenant.activeUsers}</div>
              <div className="text-xs text-muted-foreground">von {tenant.totalUsers}</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Coins className="h-3.5 w-3.5" /> Tokens
              </div>
              <div className="text-2xl font-bold">{tenant.tokensUsed.toLocaleString()}</div>
              <div className="mt-1.5 w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(tokenPercent, 100)}%` }} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{tokenPercent}%</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <MessageSquare className="h-3.5 w-3.5" /> Queries
              </div>
              <div className="text-2xl font-bold">{Math.round(tenant.tokensUsed / 3.2).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">gesendet</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Clock className="h-3.5 w-3.5" /> Stunden
              </div>
              <div className="text-2xl font-bold">{Math.round(tenant.tokensUsed / 12)}</div>
              <div className="text-xs text-muted-foreground">gespart</div>
            </Card>
          </div>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-3">Token-Nutzung über Zeit</h4>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTokenHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tenantTokenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={35} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`${Number(value).toLocaleString()} Tokens`, "Nutzung"]} />
                  <Area type="monotone" dataKey="tokens" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#tenantTokenGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Bot className="h-4 w-4" /> Top Assistenten</h4>
            <div className="space-y-2">
              {mockTopAssistants.map((a, i) => (
                <div key={a.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">#{i + 1}</div>
                    <div>
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.requests} Anfragen</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{a.tokens.toLocaleString()} T</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => {
              const headers = ["Metric", "Value"];
              const rows = [
                ["Tenant", tenant.name],
                ["Status", tenant.status],
                ["Active Users", tenant.activeUsers.toString()],
                ["Total Users", tenant.totalUsers.toString()],
                ["Tokens Used", tenant.tokensUsed.toString()],
                ["Tokens Limit", tenant.tokensLimit.toString()],
                ["Queries", Math.round(tenant.tokensUsed / 3.2).toString()],
                ["Hours Saved", Math.round(tenant.tokensUsed / 12).toString()],
              ];
              const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${tenant.name.replace(/\s+/g, "-")}-analytics-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              sonnerToast.success("CSV heruntergeladen");
            }}>
              <Download className="h-4 w-4 mr-1" />
              CSV Export
            </Button>
          </div>
        </div>
      );
    }

    if (activeTab === "billing") {
      const spentEur = (tenant.tokensUsed / 1000) * EUR_PER_1K_TOKENS;
      const totalAllowedEur = planBudgetNum + (overageEnabled ? overageCapNum : 0);
      const spendPct = totalAllowedEur > 0 ? Math.min((spentEur / totalAllowedEur) * 100, 100) : 0;
      let statusText: string;
      let statusTone: "ok" | "warn" | "crit";
      if (spentEur >= totalAllowedEur && totalAllowedEur > 0) {
        statusText = "Hard limit reached — requests blocked";
        statusTone = "crit";
      } else if (spentEur >= planBudgetNum && overageEnabled) {
        statusText = `Using overage budget · ${formatEur(spentEur - planBudgetNum)} of ${formatEur(overageCapNum)} overage used`;
        statusTone = "warn";
      } else if (spentEur >= planBudgetNum) {
        statusText = "Plan budget exceeded — enable overage to continue";
        statusTone = "crit";
      } else {
        statusText = `Within plan budget · ${formatEur(planBudgetNum - spentEur)} remaining`;
        statusTone = "ok";
      }

      const billingControls = (
        <div className="space-y-3">
          <Card className="p-4 space-y-3">
            <h4 className="text-sm font-semibold">Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <Label className="text-xs text-muted-foreground">Included budget (€)</Label>
                <Input type="number" min={0} value={planBudgetEur} onChange={(e) => setPlanBudgetEur(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1" />
              </div>
              <Button className="w-full md:w-auto" onClick={() => sonnerToast.success("Plan saved")}>Save</Button>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h4 className="text-sm font-semibold">Overage</h4>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-sm">Allow spend beyond plan budget</div>
                <div className="text-xs text-muted-foreground">When enabled, requests can continue past the plan budget up to the overage cap</div>
              </div>
              <Switch
                checked={overageEnabled}
                onCheckedChange={(v) => {
                  setOverageEnabled(v);
                  sonnerToast.success(`Overage ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>
            <div className={cn("grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end", !overageEnabled && "opacity-50 pointer-events-none")}>
              <div>
                <Label className="text-xs text-muted-foreground">Max additional spend (€)</Label>
                <Input type="number" min={0} value={overageCapEur} onChange={(e) => setOverageCapEur(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1" />
              </div>
              <Button className="w-full md:w-auto" onClick={() => sonnerToast.success("Overage settings saved")}>Save</Button>
            </div>
            {overageEnabled && (
              <div className="text-xs text-muted-foreground">
                Hard stop at {formatEur(planBudgetNum + overageCapNum)} total. Requests rejected after.
              </div>
            )}
          </Card>
        </div>
      );

      return (
        <div className="space-y-5">
          {isMobile && billingControls}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Spent this cycle</div>
              <div className="text-2xl font-semibold">{formatEur(spentEur)}</div>
              <div className="text-xs text-muted-foreground mt-1">of {formatEur(planBudgetNum)} included</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Plan budget</div>
              <div className="text-2xl font-semibold">{formatEur(planBudgetNum)}</div>
              <div className="text-xs text-muted-foreground mt-1">{planName} plan</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Overage cap</div>
              <div className="text-2xl font-semibold">{overageEnabled ? formatEur(overageCapNum) : "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">{overageEnabled ? "extra allowed" : "disabled"}</div>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{formatEur(spentEur)} of {formatEur(totalAllowedEur)} total allowed</span>
              <span>{spendPct.toFixed(0)}%</span>
            </div>
            <Progress value={spendPct} className="h-2" indicatorClassName={usageColor(spendPct)} />
          </div>

          <div
            className={cn(
              "text-sm rounded-md px-3 py-2 border",
              statusTone === "ok" && "bg-muted/30 border-border/40 text-foreground",
              statusTone === "warn" && "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
              statusTone === "crit" && "bg-destructive/10 border-destructive/30 text-destructive",
            )}
          >
            Status: {statusText}
          </div>

          {!isMobile && billingControls}
        </div>
      );
    }

    if (activeTab === "theme") {
      return (
        <div className="space-y-4">
          <div>
            <Label>Logo</Label>
            <div className="mt-1 flex items-center gap-3">
              {currentLogo ? (
                <div className="relative">
                  <img src={currentLogo} alt="Logo" className="w-16 h-16 rounded-lg object-cover border" />
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
            </div>
          </div>

          <div>
            <Label>Primärfarbe</Label>
            <div className="flex items-center gap-3 mt-1">
              <input type="color" value={pc} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
              <Input value={pc} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
            </div>
          </div>
          <div>
            <Label>Akzentfarbe</Label>
            <div className="flex items-center gap-3 mt-1">
              <input type="color" value={ac} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
              <Input value={ac} onChange={(e) => setAccentColor(e.target.value)} className="flex-1" />
            </div>
          </div>
          <div>
            <Label>Hintergrundfarbe</Label>
            <div className="flex items-center gap-3 mt-1">
              <input type="color" value={bc} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
              <Input value={bc} onChange={(e) => setBgColor(e.target.value)} className="flex-1" />
            </div>
          </div>
          <Button onClick={handleSaveTheme} className="w-full">Speichern</Button>
        </div>
      );
    }

    // Admins tab
    return (
      <div className="space-y-4">
        <Tabs value={adminSubTab} onValueChange={setAdminSubTab}>
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">Active Users</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">Pending Invites</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-4">
            {tenant.admins.length > 0 ? (
              <div className="space-y-2">
                {tenant.admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-sm text-muted-foreground">{admin.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{admin.role}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                        sonnerToast.success(`${admin.name} bearbeiten`);
                      }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => {
                        sonnerToast.success(`${admin.name} wurde entfernt.`);
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

          <TabsContent value="pending" className="mt-4 space-y-2">
            {mockPendingInvites.length > 0 ? (
              <div className="space-y-2">
                {mockPendingInvites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <div className="font-medium">{invite.email}</div>
                      <div className="text-xs text-muted-foreground">Eingeladen am {new Date(invite.invitedOn).toLocaleDateString("de-DE")}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{invite.role}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary" onClick={() => {
                        sonnerToast.success(`Erinnerung an ${invite.email} gesendet.`);
                      }}>
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => {
                        sonnerToast.success(`Einladung für ${invite.email} gelöscht.`);
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Keine ausstehenden Einladungen.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={tenant.name}
    >
      <ResponsiveDialogBody
        sidebar={
          <ResponsiveDialogTabs
            tabs={dialogTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        }
      >
        {isMobile && (
          <ResponsiveDialogTabs
            tabs={dialogTabs}
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

export default PFTenantDetailDialog;
