import { useEffect, useState } from "react";
import ELearningLayout from "./ELearningLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getModules, saveModules, getAnnouncements, saveAnnouncements,
  getProgress, moduleCompletion,
  Module, Material, Task, Announcement, STUDENTS, uid, MaterialType,
} from "@/data/elearningData";

export default function ELearningManage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // dialogs
  const [moduleDlg, setModuleDlg] = useState<Module | null>(null);
  const [materialDlg, setMaterialDlg] = useState<{ moduleId: string; material: Material | null } | null>(null);
  const [taskDlg, setTaskDlg] = useState<{ moduleId: string; task: Task | null } | null>(null);
  const [annDlg, setAnnDlg] = useState<Announcement | null>(null);

  useEffect(() => {
    setModules(getModules());
    setAnnouncements(getAnnouncements());
  }, []);

  const persistModules = (next: Module[]) => { setModules(next); saveModules(next); };
  const persistAnn = (next: Announcement[]) => { setAnnouncements(next); saveAnnouncements(next); };

  // ----- Module CRUD -----
  const newModule = (): Module => ({
    id: uid(),
    order: modules.length + 1,
    title: "",
    description: "",
    scheduledAt: new Date().toISOString().slice(0, 16),
    teamsLink: "",
    materials: [],
    tasks: [],
  });

  const saveModule = (m: Module) => {
    const exists = modules.some((x) => x.id === m.id);
    const next = exists ? modules.map((x) => (x.id === m.id ? m : x)) : [...modules, m];
    persistModules(next);
    toast.success(exists ? "Module updated" : "Module added");
    setModuleDlg(null);
  };
  const deleteModule = (id: string) => {
    persistModules(modules.filter((m) => m.id !== id));
    toast.success("Module deleted");
  };

  // ----- Material CRUD -----
  const saveMaterial = (moduleId: string, mat: Material) => {
    persistModules(modules.map((m) => {
      if (m.id !== moduleId) return m;
      const exists = m.materials.some((x) => x.id === mat.id);
      return { ...m, materials: exists ? m.materials.map((x) => x.id === mat.id ? mat : x) : [...m.materials, mat] };
    }));
    toast.success("Material saved");
    setMaterialDlg(null);
  };
  const deleteMaterial = (moduleId: string, mid: string) => {
    persistModules(modules.map((m) => m.id === moduleId ? { ...m, materials: m.materials.filter((x) => x.id !== mid) } : m));
  };

  // ----- Task CRUD -----
  const saveTask = (moduleId: string, task: Task) => {
    persistModules(modules.map((m) => {
      if (m.id !== moduleId) return m;
      const exists = m.tasks.some((x) => x.id === task.id);
      return { ...m, tasks: exists ? m.tasks.map((x) => x.id === task.id ? task : x) : [...m.tasks, task] };
    }));
    toast.success("Task saved");
    setTaskDlg(null);
  };
  const deleteTask = (moduleId: string, tid: string) => {
    persistModules(modules.map((m) => m.id === moduleId ? { ...m, tasks: m.tasks.filter((x) => x.id !== tid) } : m));
  };

  // ----- Announcement CRUD -----
  const saveAnnouncement = (a: Announcement) => {
    const exists = announcements.some((x) => x.id === a.id);
    persistAnn(exists ? announcements.map((x) => x.id === a.id ? a : x) : [a, ...announcements]);
    toast.success("Announcement saved");
    setAnnDlg(null);
  };
  const deleteAnnouncement = (id: string) => {
    persistAnn(announcements.filter((a) => a.id !== id));
  };

  return (
    <ELearningLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage course</h1>
        <p className="text-muted-foreground mt-1.5">Create modules, materials, tasks, and track student progress.</p>
      </div>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="overview">Student progress</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Button onClick={() => setModuleDlg(newModule())}>
              <Plus className="h-4 w-4" /> New module
            </Button>
          </div>
          <div className="space-y-3">
            {modules.map((m) => (
              <div key={m.id} className="rounded-2xl bg-white border p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-xs text-primary font-medium">Module {m.order}</div>
                    <h3 className="font-semibold">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => setModuleDlg(m)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteModule(m.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Materials</h4>
                      <Button variant="ghost" size="sm" onClick={() => setMaterialDlg({ moduleId: m.id, material: null })}>
                        <Plus className="h-3.5 w-3.5" /> Add
                      </Button>
                    </div>
                    <ul className="space-y-1.5">
                      {m.materials.map((mat) => (
                        <li key={mat.id} className="flex items-center justify-between text-sm border rounded-md px-3 py-2">
                          <span className="truncate"><span className="text-xs text-muted-foreground uppercase mr-2">{mat.type}</span>{mat.title}</span>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMaterialDlg({ moduleId: m.id, material: mat })}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteMaterial(m.id, mat.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Tasks</h4>
                      <Button variant="ghost" size="sm" onClick={() => setTaskDlg({ moduleId: m.id, task: null })}>
                        <Plus className="h-3.5 w-3.5" /> Add
                      </Button>
                    </div>
                    <ul className="space-y-1.5">
                      {m.tasks.map((t) => (
                        <li key={t.id} className="flex items-center justify-between text-sm border rounded-md px-3 py-2">
                          <span className="truncate">{t.title}</span>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setTaskDlg({ moduleId: m.id, task: t })}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteTask(m.id, t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Button onClick={() => setAnnDlg({ id: uid(), title: "", body: "", createdAt: new Date().toISOString(), author: "Instructor" })}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-2xl bg-white border p-5 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold">{a.title}</h3>
                  <div className="text-xs text-muted-foreground mb-1">{new Date(a.createdAt).toLocaleString()}</div>
                  <p className="text-sm">{a.body}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => setAnnDlg(a)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteAnnouncement(a.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <div className="rounded-2xl bg-white border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  {modules.map((m) => <TableHead key={m.id}>M{m.order}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {STUDENTS.map((s) => {
                  const p = getProgress(s.id);
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      {modules.map((m) => {
                        const pct = moduleCompletion(m, p);
                        return (
                          <TableCell key={m.id}>
                            <div className="flex items-center gap-2">
                              <Progress value={pct} className="h-1.5 w-20" />
                              <span className="text-xs text-muted-foreground w-9">{pct}%</span>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Module Dialog */}
      {moduleDlg && (
        <Dialog open onOpenChange={() => setModuleDlg(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{modules.some(m => m.id === moduleDlg.id) ? "Edit module" : "New module"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={moduleDlg.title} onChange={(e) => setModuleDlg({ ...moduleDlg, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={moduleDlg.description} onChange={(e) => setModuleDlg({ ...moduleDlg, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Order</Label><Input type="number" value={moduleDlg.order} onChange={(e) => setModuleDlg({ ...moduleDlg, order: parseInt(e.target.value) || 1 })} /></div>
                <div><Label>Scheduled at</Label><Input type="datetime-local" value={moduleDlg.scheduledAt.slice(0, 16)} onChange={(e) => setModuleDlg({ ...moduleDlg, scheduledAt: new Date(e.target.value).toISOString() })} /></div>
              </div>
              <div><Label>Teams link</Label><Input value={moduleDlg.teamsLink} onChange={(e) => setModuleDlg({ ...moduleDlg, teamsLink: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={() => saveModule(moduleDlg)}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Material Dialog */}
      {materialDlg && (
        <Dialog open onOpenChange={() => setMaterialDlg(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{materialDlg.material ? "Edit material" : "New material"}</DialogTitle></DialogHeader>
            {(() => {
              const mat = materialDlg.material || { id: uid(), moduleId: materialDlg.moduleId, type: "pdf" as MaterialType, title: "", url: "" };
              return (
                <MaterialForm initial={mat} onSave={(m) => saveMaterial(materialDlg.moduleId, m)} />
              );
            })()}
          </DialogContent>
        </Dialog>
      )}

      {/* Task Dialog */}
      {taskDlg && (
        <Dialog open onOpenChange={() => setTaskDlg(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{taskDlg.task ? "Edit task" : "New task"}</DialogTitle></DialogHeader>
            {(() => {
              const t = taskDlg.task || { id: uid(), moduleId: taskDlg.moduleId, title: "", description: "" };
              return <TaskForm initial={t} onSave={(x) => saveTask(taskDlg.moduleId, x)} />;
            })()}
          </DialogContent>
        </Dialog>
      )}

      {/* Announcement Dialog */}
      {annDlg && (
        <Dialog open onOpenChange={() => setAnnDlg(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Announcement</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={annDlg.title} onChange={(e) => setAnnDlg({ ...annDlg, title: e.target.value })} /></div>
              <div><Label>Body</Label><Textarea value={annDlg.body} onChange={(e) => setAnnDlg({ ...annDlg, body: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={() => saveAnnouncement(annDlg)}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ELearningLayout>
  );
}

function MaterialForm({ initial, onSave }: { initial: Material; onSave: (m: Material) => void }) {
  const [m, setM] = useState<Material>(initial);
  return (
    <>
      <div className="space-y-3">
        <div>
          <Label>Type</Label>
          <Select value={m.type} onValueChange={(v) => setM({ ...m, type: v as MaterialType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Title</Label><Input value={m.title} onChange={(e) => setM({ ...m, title: e.target.value })} /></div>
        <div><Label>URL</Label><Input value={m.url} onChange={(e) => setM({ ...m, url: e.target.value })} placeholder="https://..." /></div>
      </div>
      <DialogFooter className="mt-4"><Button onClick={() => onSave(m)}>Save</Button></DialogFooter>
    </>
  );
}

function TaskForm({ initial, onSave }: { initial: Task; onSave: (t: Task) => void }) {
  const [t, setT] = useState<Task>(initial);
  return (
    <>
      <div className="space-y-3">
        <div><Label>Title</Label><Input value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea value={t.description} onChange={(e) => setT({ ...t, description: e.target.value })} /></div>
        <div>
          <Label>Embed type (optional)</Label>
          <Select value={t.embedType || "none"} onValueChange={(v) => setT({ ...t, embedType: v === "none" ? undefined : (v as "pdf" | "video") })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {t.embedType && (
          <div><Label>Embed URL</Label><Input value={t.embedUrl || ""} onChange={(e) => setT({ ...t, embedUrl: e.target.value })} /></div>
        )}
      </div>
      <DialogFooter className="mt-4"><Button onClick={() => onSave(t)}>Save</Button></DialogFooter>
    </>
  );
}
