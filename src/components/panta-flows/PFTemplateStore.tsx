import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { templates as seedTemplates, TemplateItem, TemplateVisibility } from "@/data/templates";
import { allUseCases as seedUseCases, UseCase } from "@/data/useCases";
import { mockTenants } from "@/data/pantaFlowsData";
import { Globe, Users, Search, Sparkles, Pencil, Plus, ListChecks } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import PFAssistantEditorDialog from "./PFAssistantEditorDialog";
import PFTaskEditorDialog from "./PFTaskEditorDialog";

const defaultVisibility = (): TemplateVisibility => ({ scope: "public", tenantIds: [] });

const PFTemplateStore = () => {
  const [activeTab, setActiveTab] = useState<"assistants" | "tasks">("assistants");

  // ---- Assistants
  const [items, setItems] = useState<TemplateItem[]>(() =>
    seedTemplates
      .filter((t) => t.category === "assistant")
      .map((t) => ({ ...t, visibility: t.visibility ?? defaultVisibility() }))
  );
  const [tasks, setTasks] = useState<UseCase[]>(() => seedUseCases);

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<TemplateItem | null>(null);
  const [editScope, setEditScope] = useState<TemplateVisibility["scope"]>("public");
  const [editTenantIds, setEditTenantIds] = useState<string[]>([]);

  const [assistantEditorOpen, setAssistantEditorOpen] = useState(false);
  const [assistantEditorInitial, setAssistantEditorInitial] = useState<TemplateItem | null>(null);

  const [taskEditorOpen, setTaskEditorOpen] = useState(false);
  const [taskEditorInitial, setTaskEditorInitial] = useState<UseCase | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(
      (t) =>
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [items, query]);

  const filteredTasks = useMemo(() => {
    const q = query.toLowerCase();
    return tasks.filter(
      (t) =>
        q === "" ||
        t.name.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q)
    );
  }, [tasks, query]);

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
          <h2 className="text-xl font-semibold">Discover</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte Assistenten und Use Cases, die deinen Tenants zur Verfügung stehen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl"
            />
          </div>
          {activeTab === "assistants" ? (
            <Button
              onClick={() => {
                setAssistantEditorInitial(null);
                setAssistantEditorOpen(true);
              }}
              className="h-10 shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Neuer Assistent
            </Button>
          ) : (
            <Button
              onClick={() => {
                setTaskEditorInitial(null);
                setTaskEditorOpen(true);
              }}
              className="h-10 shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Neuer Use Case
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="bg-transparent rounded-none p-0 h-auto border-b border-border/60 w-full justify-start gap-4">
          <TabsTrigger
            value="assistants"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 pt-0 text-sm text-muted-foreground data-[state=active]:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Assistenten ({items.length})
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 pt-0 text-sm text-muted-foreground data-[state=active]:text-foreground"
          >
            <ListChecks className="h-3.5 w-3.5 mr-1.5" /> Use Cases ({tasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistants" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((t) => {
              const Icon =
                (LucideIcons[t.icon as keyof typeof LucideIcons] as React.ComponentType<{
                  className?: string;
                }>) || Sparkles;
              const v = t.visibility ?? defaultVisibility();
              const isPublic = v.scope === "public";
              return (
                <Card key={t.id} className="p-4 transition-colors hover:border-primary/40">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center ring-1 ring-primary/10 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold truncate">{t.title}</h3>
                        <button
                          onClick={() => {
                            setAssistantEditorInitial(t);
                            setAssistantEditorOpen(true);
                          }}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                          title="Edit content"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => openEditor(t)}
                      className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    >
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
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTasks.map((t) => {
              const Icon = t.icon || Sparkles;
              return (
                <Card key={t.id} className="p-4 transition-colors hover:border-primary/40">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold truncate">{t.name}</h3>
                        <button
                          onClick={() => {
                            setTaskEditorInitial(t);
                            setTaskEditorOpen(true);
                          }}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                          title="Edit task"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {t.description || `${t.team} · ${t.taskType}`}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className="rounded bg-muted px-1.5 py-0.5">{t.team}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5">{t.taskType}</span>
                        {t.prefilledPrompt && (
                          <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 font-medium">
                            Prompt ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

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
                        Available to all tenants by default.
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

      <PFAssistantEditorDialog
        open={assistantEditorOpen}
        onOpenChange={(o) => {
          setAssistantEditorOpen(o);
          if (!o) setAssistantEditorInitial(null);
        }}
        initial={assistantEditorInitial}
        onSave={(t) => {
          setItems((prev) => {
            const exists = prev.some((p) => p.id === t.id);
            return exists ? prev.map((p) => (p.id === t.id ? t : p)) : [t, ...prev];
          });
          toast.success(
            assistantEditorInitial ? `"${t.title}" updated` : `"${t.title}" created`
          );
        }}
      />

      <PFTaskEditorDialog
        open={taskEditorOpen}
        onOpenChange={(o) => {
          setTaskEditorOpen(o);
          if (!o) setTaskEditorInitial(null);
        }}
        initial={taskEditorInitial}
        onSave={(t) => {
          setTasks((prev) => {
            const exists = prev.some((p) => p.id === t.id);
            return exists ? prev.map((p) => (p.id === t.id ? t : p)) : [t, ...prev];
          });
          toast.success(taskEditorInitial ? `"${t.name}" aktualisiert` : `"${t.name}" erstellt`);
        }}
      />
    </div>
  );
};

export default PFTemplateStore;
