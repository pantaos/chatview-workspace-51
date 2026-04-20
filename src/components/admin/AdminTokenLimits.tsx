import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Activity, Cpu, Users, Image as ImageIcon, Type, Wallet } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockModels, mockOrgLimits, mockTeamAccess, mockUserDailyLimits } from "@/data/tokenLimitsData";
import { mockBilling, EUR_PER_1K_TOKENS } from "@/data/billingData";
import TeamModelAccessMatrix from "./TeamModelAccessMatrix";
import UserDailyLimitsDialog from "./UserDailyLimitsDialog";

const formatEur = (n: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

const formatNum = (n: number) => n.toLocaleString();
const usageColor = (pct: number) =>
  pct >= 90 ? "bg-destructive" : pct >= 75 ? "bg-amber-500" : "bg-primary";

const AdminTokenLimits = () => {
  const [org, setOrg] = useState(mockOrgLimits);
  const [models, setModels] = useState(mockModels);
  const [billing, setBilling] = useState(mockBilling);
  const [overridesOpen, setOverridesOpen] = useState(false);

  const orgPct = (org.globalUsed / org.globalLimit) * 100;

  const spentEur = (org.globalUsed / 1000) * EUR_PER_1K_TOKENS;
  const overageActive = billing.overageEnabled;
  const totalAllowedEur = billing.planBudgetEur + (overageActive ? billing.overageCapEur : 0);
  const spendPct = Math.min((spentEur / totalAllowedEur) * 100, 100);

  let status: { text: string; tone: "ok" | "warn" | "crit" };
  if (spentEur >= totalAllowedEur) {
    status = { text: "Hard limit reached — requests blocked", tone: "crit" };
  } else if (spentEur >= billing.planBudgetEur && overageActive) {
    const overUsed = spentEur - billing.planBudgetEur;
    status = {
      text: `Using overage budget · ${formatEur(overUsed)} of ${formatEur(billing.overageCapEur)} overage used`,
      tone: "warn",
    };
  } else if (spentEur >= billing.planBudgetEur) {
    status = { text: "Plan budget exceeded — enable overage to continue", tone: "crit" };
  } else {
    status = {
      text: `Within plan budget · ${formatEur(billing.planBudgetEur - spentEur)} remaining`,
      tone: "ok",
    };
  }

  const saveOrg = () => toast.success("Organization limit saved");
  const saveOverage = () => toast.success("Overage settings saved");

  const updateModel = (id: string, patch: Partial<typeof models[0]>) => {
    setModels(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  };

  return (
    <div className="space-y-6">
      {/* Spending & Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5 text-primary" />
            Spending & Budget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
              <div className="text-xs text-muted-foreground mb-1">Spent this cycle</div>
              <div className="text-2xl font-semibold">{formatEur(spentEur)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                of {formatEur(billing.planBudgetEur)} included
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
              <div className="text-xs text-muted-foreground mb-1">Plan budget</div>
              <div className="text-2xl font-semibold">{formatEur(billing.planBudgetEur)}</div>
              <div className="text-xs text-muted-foreground mt-1">{billing.planName} plan</div>
            </div>
            <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
              <div className="text-xs text-muted-foreground mb-1">Overage cap</div>
              <div className="text-2xl font-semibold">
                {overageActive ? formatEur(billing.overageCapEur) : "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {overageActive ? "extra allowed" : "disabled"}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>
                {formatEur(spentEur)} of {formatEur(totalAllowedEur)} total allowed
              </span>
              <span>{spendPct.toFixed(0)}%</span>
            </div>
            <Progress value={spendPct} className="h-2" indicatorClassName={usageColor(spendPct)} />
          </div>

          <div
            className={cn(
              "text-sm rounded-md px-3 py-2 border",
              status.tone === "ok" && "bg-muted/30 border-border/40 text-foreground",
              status.tone === "warn" && "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
              status.tone === "crit" && "bg-destructive/10 border-destructive/30 text-destructive",
            )}
          >
            Status: {status.text}
          </div>

          <div className="pt-2 border-t border-border/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Allow spending beyond plan budget</div>
                <div className="text-xs text-muted-foreground">
                  When enabled, requests can continue past your included budget up to the overage cap
                </div>
              </div>
              <Switch
                checked={billing.overageEnabled}
                onCheckedChange={v => {
                  setBilling({ ...billing, overageEnabled: v });
                  toast.success(`Overage ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>

            <div
              className={cn(
                "grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end",
                !billing.overageEnabled && "opacity-50 pointer-events-none",
              )}
            >
              <div>
                <Label className="text-xs text-muted-foreground">Max additional spend (€)</Label>
                <Input
                  type="number"
                  value={billing.overageCapEur}
                  onChange={e => setBilling({ ...billing, overageCapEur: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <Button onClick={saveOverage}>Save</Button>
            </div>

            {billing.overageEnabled && (
              <div className="text-xs text-muted-foreground">
                Hard stop at {formatEur(billing.planBudgetEur + billing.overageCapEur)} total. Requests
                rejected after.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" />
            Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
              <div className="text-xs text-muted-foreground mb-1">Total tokens used</div>
              <div className="text-2xl font-semibold">{formatNum(org.globalUsed)}</div>
              <div className="text-xs text-muted-foreground mt-1">of {formatNum(org.globalLimit)}</div>
              <Progress value={orgPct} className="mt-3 h-2" indicatorClassName={usageColor(orgPct)} />
            </div>
            <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
              <div className="text-xs text-muted-foreground mb-1">Total requests</div>
              <div className="text-2xl font-semibold">{formatNum(org.totalRequests)}</div>
              <div className="text-xs text-muted-foreground mt-1">this cycle</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <Label className="text-xs text-muted-foreground">Global token limit</Label>
              <Input
                type="number"
                value={org.globalLimit}
                onChange={e => setOrg({ ...org, globalLimit: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <Button onClick={saveOrg}>Save</Button>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Reset cycle</Label>
            <RadioGroup
              value={org.resetCycle}
              onValueChange={v => setOrg({ ...org, resetCycle: v as 'monthly' | 'custom' })}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer">Monthly</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cpu className="w-5 h-5 text-primary" />
            Models
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {models.map(m => {
            const pct = (m.used / m.limit) * 100;
            const Icon = m.category === 'image' ? ImageIcon : Type;
            return (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col md:flex-row md:items-center gap-3 py-3 border-b border-border/40 last:border-b-0",
                  !m.enabled && "opacity-50"
                )}
              >
                <div className="flex items-center gap-2 md:w-48 shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{m.name}</span>
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider px-1.5 py-0 h-4">
                    {m.category}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{formatNum(m.used)} / {formatNum(m.limit)}</span>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" indicatorClassName={usageColor(pct)} />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Input
                    type="number"
                    value={m.limit}
                    onChange={e => updateModel(m.id, { limit: Number(e.target.value) })}
                    className="w-32 h-8 text-sm"
                  />
                  <Switch
                    checked={m.enabled}
                    onCheckedChange={v => {
                      updateModel(m.id, { enabled: v });
                      toast.success(`${m.name} ${v ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Team Model Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-primary" />
            Team Model Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TeamModelAccessMatrix models={models} teamAccess={mockTeamAccess} />
        </CardContent>
      </Card>

      {/* User Daily Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Daily Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Enable per-user daily token caps</div>
              <div className="text-xs text-muted-foreground">Optional — restrict each user's daily token usage</div>
            </div>
            <Switch
              checked={org.userDailyLimitsEnabled}
              onCheckedChange={v => {
                setOrg({ ...org, userDailyLimitsEnabled: v });
                toast.success(`Daily limits ${v ? "enabled" : "disabled"}`);
              }}
            />
          </div>

          <div className={cn("space-y-4 pt-2", !org.userDailyLimitsEnabled && "opacity-50 pointer-events-none")}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <Label className="text-xs text-muted-foreground">Default daily limit per user (tokens)</Label>
                <Input
                  type="number"
                  value={org.defaultUserDailyLimit}
                  onChange={e => setOrg({ ...org, defaultUserDailyLimit: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <Button variant="outline" onClick={() => toast.success("Default limit saved")}>Save</Button>
            </div>
            <Button variant="outline" onClick={() => setOverridesOpen(true)} className="w-full md:w-auto">
              Manage user overrides →
            </Button>
          </div>
        </CardContent>
      </Card>

      <UserDailyLimitsDialog
        open={overridesOpen}
        onOpenChange={setOverridesOpen}
        users={mockUserDailyLimits}
        defaultLimit={org.defaultUserDailyLimit}
      />
    </div>
  );
};

export default AdminTokenLimits;
