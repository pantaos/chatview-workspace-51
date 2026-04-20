import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import { templates as seedTemplates, TemplateItem, TemplateVisibility } from "@/data/templates";
import { mockTenants } from "@/data/pantaFlowsData";
import { CommunityApp, seedCommunityApps } from "@/data/communityApps";
import { Globe, Users, Search, Sparkles, Pencil, Clock, Check, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const defaultVisibility = (): TemplateVisibility => ({ scope: "public", tenantIds: [] });

const PFTemplateStore = () => {
  const [items, setItems] = useState<TemplateItem[]>(() =>
    seedTemplates
      .filter((t) => t.category === "assistant")
      .map((t) => ({ ...t, visibility: t.visibility ?? defaultVisibility() }))
  );
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<TemplateItem | null>(null);
  const [editScope, setEditScope] = useState<TemplateVisibility["scope"]>("public");
  const [editTenantIds, setEditTenantIds] = useState<string[]>([]);

  // Pending community apps awaiting review
  const [pendingApps, setPendingApps] = useState<CommunityApp[]>(() =>
    seedCommunityApps.filter((a) => a.status === "pending")
  );
  const [reviewing, setReviewing] = useState<CommunityApp | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectMode, setRejectMode] = useState(false);

  const approveApp = (app: CommunityApp) => {
    setPendingApps((prev) => prev.filter((a) => a.id !== app.id));
    const asTemplate: TemplateItem = {
      id: app.id,
      title: app.title,
      description: app.description,
      icon: app.icon,
      tags: app.tags,
      category: "app",
      screenshots: [],
      useCases: [],
      features: ["Community-built app"],
      customizable: [],
      systemPrompt: "",
      suggestedIntegrations: [],
      starters: [],
      visibility: defaultVisibility(),
    };
    setItems((prev) => [asTemplate, ...prev]);
    toast.success(`Approved "${app.title}"`);
    setReviewing(null);
    setRejectMode(false);
    setRejectReason("");
  };

  const rejectApp = (app: CommunityApp, reason: string) => {
    setPendingApps((prev) => prev.filter((a) => a.id !== app.id));
    toast.success(`Rejected "${app.title}"`, { description: reason });
    setReviewing(null);
    setRejectMode(false);
    setRejectReason("");
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(
      (t) =>
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [items, query]);

  const openEditor = (t: TemplateItem) => {
    setEditing(t);
    const v = t.visibility ?? defaultVisibility();
    setEditScope(v.scope);
    setEditTenantIds(v.tenantIds);
  };

  const closeEditor = () => setEditing(null);

  const saveVisibility = () => {
    if (!editing) return;
    setItems((prev) =>
      prev.map((t) =>
        t.id === editing.id
          ? { ...t, visibility: { scope: editScope, tenantIds: editTenantIds } }
          : t
      )
    );
    toast.success(`Visibility updated for "${editing.title}"`);
    closeEditor();
  };

  const toggleTenant = (id: string) => {
    setEditTenantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Template Store</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage which assistant templates are available to which tenants.
          </p>
        </div>
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((t) => {
          const Icon =
            (LucideIcons[t.icon as keyof typeof LucideIcons] as React.ComponentType<{
              className?: string;
            }>) || Sparkles;
          const v = t.visibility ?? defaultVisibility();
          const isPublic = v.scope === "public";
          return (
            <Card
              key={t.id}
              className="p-4 cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => openEditor(t)}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center ring-1 ring-primary/10 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold truncate">{t.title}</h3>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {t.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1",
                    isPublic
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  )}
                >
                  {isPublic ? <Globe className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                  {isPublic ? "Public" : "Tenants only"}
                </Badge>
                {v.tenantIds.length > 0 && (
                  <span className="text-muted-foreground">
                    {isPublic ? "+" : ""}
                    {v.tenantIds.length} tenant{v.tenantIds.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <ResponsiveDialog
        open={!!editing}
        onOpenChange={(o) => !o && closeEditor()}
        title={editing ? `Visibility · ${editing.title}` : ""}
      >
        <ResponsiveDialogBody>
          <ResponsiveDialogContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Who can see this template?</h4>
                <RadioGroup
                  value={editScope}
                  onValueChange={(v) => setEditScope(v as TemplateVisibility["scope"])}
                  className="space-y-2"
                >
                  <label
                    htmlFor="vis-public"
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors",
                      editScope === "public"
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-border/80"
                    )}
                  >
                    <RadioGroupItem value="public" id="vis-public" className="mt-0.5" />
                    <div>
                      <div className="text-sm font-medium flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" /> Public
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Available to all tenants by default. You can additionally force-assign it
                        to specific tenants below.
                      </div>
                    </div>
                  </label>
                  <label
                    htmlFor="vis-tenants"
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors",
                      editScope === "tenants"
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-border/80"
                    )}
                  >
                    <RadioGroupItem value="tenants" id="vis-tenants" className="mt-0.5" />
                    <div>
                      <div className="text-sm font-medium flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> Specific tenants only
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Only tenants you select below can see this template.
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">
                    {editScope === "public" ? "Force-assign to tenants" : "Allowed tenants"}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {editTenantIds.length} selected
                  </span>
                </div>
                <div className="space-y-1.5 rounded-xl border border-border/50 divide-y divide-border/40">
                  {mockTenants.map((tenant) => {
                    const checked = editTenantIds.includes(tenant.id);
                    return (
                      <label
                        key={tenant.id}
                        htmlFor={`t-${tenant.id}`}
                        className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: tenant.primaryColor }}
                          >
                            {tenant.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{tenant.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {tenant.totalUsers} users · {tenant.planName ?? "—"}
                            </div>
                          </div>
                        </div>
                        <Checkbox
                          id={`t-${tenant.id}`}
                          checked={checked}
                          onCheckedChange={() => toggleTenant(tenant.id)}
                        />
                      </label>
                    );
                  })}
                </div>
                {editScope === "tenants" && editTenantIds.length === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    Select at least one tenant or switch to Public.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button variant="outline" onClick={closeEditor}>
                  Cancel
                </Button>
                <Button
                  onClick={saveVisibility}
                  disabled={editScope === "tenants" && editTenantIds.length === 0}
                >
                  Save visibility
                </Button>
              </div>
            </div>
          </ResponsiveDialogContent>
        </ResponsiveDialogBody>
      </ResponsiveDialog>
    </div>
  );
};

export default PFTemplateStore;
