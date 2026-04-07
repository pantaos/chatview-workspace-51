
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Plus, Search, Zap, FileText, Calendar, Mail, GitPullRequest, 
  Users, CheckSquare, BarChart3, MoreVertical
} from "lucide-react";
import { Skill } from "@/types/skills";
import { allSkills } from "@/data/skillsData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SkillEditor from "@/components/settings/SkillEditor";

const iconMap: Record<string, React.ElementType> = {
  FileText, Calendar, Mail, GitPullRequest, Users, CheckSquare, Search, Zap
};

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>(allSkills);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const teams = [...new Set(skills.filter(s => s.teamName).map(s => s.teamName!))];

  const filtered = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTeam = teamFilter === "all" || s.teamName === teamFilter || (teamFilter === "personal" && s.scope === "personal");
    return matchSearch && matchTeam;
  });

  const handleToggleStatus = (skill: Skill) => {
    setSkills(prev => prev.map(s => 
      s.id === skill.id ? { ...s, status: s.status === "active" ? "disabled" : "active" } : s
    ));
    toast.success(`${skill.name} ${skill.status === "active" ? "deaktiviert" : "aktiviert"}`);
  };

  const handleDelete = (skill: Skill) => {
    setSkills(prev => prev.filter(s => s.id !== skill.id));
    toast.success("Skill gelöscht");
  };

  const handleSave = (data: Partial<Skill>) => {
    if (editingSkill) {
      setSkills(prev => prev.map(s => s.id === editingSkill.id ? { ...s, ...data, updatedAt: new Date() } : s));
      toast.success("Skill aktualisiert");
    } else {
      const newSkill: Skill = {
        id: `org-${Date.now()}`,
        name: data.name || "",
        description: data.description || "",
        icon: "Zap",
        instruction: data.instruction || "",
        triggers: data.triggers || { phrases: [] },
        parameters: [],
        requiredIntegrations: [],
        status: "active",
        scope: "organization",
        schedule: data.schedule,
        createdBy: { id: "u1", name: "Moin Arian" },
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSkills(prev => [newSkill, ...prev]);
      toast.success("Skill erstellt");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "draft": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "disabled": return "bg-muted text-muted-foreground";
      default: return "";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "active": return "Aktiv";
      case "draft": return "Entwurf";
      case "disabled": return "Deaktiviert";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Skills verwalten</h2>
          <p className="text-sm text-muted-foreground">Organisation-weite Skills erstellen, zuweisen und überwachen</p>
        </div>
        <Button onClick={() => { setEditingSkill(null); setEditorOpen(true); }} className="gap-1.5">
          <Plus className="w-4 h-4" />
          Skill erstellen
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Skills durchsuchen..."
            className="pl-9"
          />
        </div>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Team Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="personal">Persönlich</SelectItem>
            {teams.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Gesamt", value: skills.length, icon: Zap },
          { label: "Aktiv", value: skills.filter(s => s.status === "active").length, icon: CheckSquare },
          { label: "Teams", value: teams.length, icon: Users },
          { label: "Nutzungen (gesamt)", value: skills.reduce((sum, s) => sum + s.usageCount, 0), icon: BarChart3 },
        ].map(stat => (
          <div key={stat.label} className="p-3 rounded-lg border border-border/50 bg-card">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid gap-3">
        {filtered.map(skill => {
          const Icon = iconMap[skill.icon] || Zap;
          return (
            <div key={skill.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors group">
              <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{skill.name}</span>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColor(skill.status)}`}>
                    {statusLabel(skill.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{skill.description}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium">{skill.usageCount}×</p>
                  <p className="text-[10px] text-muted-foreground">
                    {skill.scope === "personal" ? "Persönlich" : skill.teamName}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditingSkill(skill); setEditorOpen(true); }}>Bearbeiten</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(skill)}>
                      {skill.status === "active" ? "Deaktivieren" : "Aktivieren"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(skill)} className="text-destructive">Löschen</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Keine Skills gefunden
          </div>
        )}
      </div>

      <SkillEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        skill={editingSkill}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminSkills;
