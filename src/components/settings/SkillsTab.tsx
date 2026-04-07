
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { Skill } from "@/types/skills";
import { personalSkills as initialPersonal, teamSkills as initialTeam } from "@/data/skillsData";
import SkillCard from "./SkillCard";
import SkillEditor from "./SkillEditor";

const SkillsTab = () => {
  const [mySkills, setMySkills] = useState<Skill[]>(initialPersonal);
  const [sharedSkills, setSharedSkills] = useState<Skill[]>(initialTeam);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleCreate = () => {
    setEditingSkill(null);
    setEditorOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setEditorOpen(true);
  };

  const handleSave = (data: Partial<Skill>) => {
    if (editingSkill) {
      setMySkills(prev => prev.map(s => s.id === editingSkill.id ? { ...s, ...data, updatedAt: new Date() } : s));
      toast.success("Skill aktualisiert");
    } else {
      const newSkill: Skill = {
        id: `ps-${Date.now()}`,
        name: data.name || "",
        description: data.description || "",
        icon: "Zap",
        instruction: data.instruction || "",
        triggers: data.triggers || { phrases: [] },
        parameters: [],
        requiredIntegrations: [],
        status: "active",
        scope: "personal",
        schedule: data.schedule,
        createdBy: { id: "u1", name: "Moin Arian" },
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMySkills(prev => [newSkill, ...prev]);
      toast.success("Skill erstellt");
    }
  };

  const handleToggle = (skill: Skill) => {
    setMySkills(prev => prev.map(s =>
      s.id === skill.id ? { ...s, status: s.status === "active" ? "disabled" : "active" } : s
    ));
  };

  const handleDelete = (skill: Skill) => {
    setMySkills(prev => prev.filter(s => s.id !== skill.id));
    toast.success("Skill gelöscht");
  };

  const handleDuplicate = (skill: Skill) => {
    const dup: Skill = {
      ...skill,
      id: `ps-${Date.now()}`,
      name: `${skill.name} (Kopie)`,
      usageCount: 0,
      lastUsed: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMySkills(prev => [dup, ...prev]);
    toast.success("Skill dupliziert");
  };

  const handlePin = (skill: Skill) => {
    setSharedSkills(prev => prev.map(s =>
      s.id === skill.id ? { ...s, pinned: !s.pinned } : s
    ));
    toast.success(skill.pinned ? "Skill losgelöst" : "Skill angepinnt");
  };

  return (
    <div className="space-y-8">
      {/* My Skills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Meine Skills</h3>
            <span className="text-xs text-muted-foreground">({mySkills.length})</span>
          </div>
          <Button size="sm" onClick={handleCreate} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Skill erstellen
          </Button>
        </div>
        <div className="space-y-2">
          {mySkills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              isOwner={true}
              onEdit={handleEdit}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
          {mySkills.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Noch keine eigenen Skills erstellt
            </div>
          )}
        </div>
      </div>

      {/* Team Skills */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Team Skills</h3>
          <span className="text-xs text-muted-foreground">({sharedSkills.length})</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Geteilte Skills deines Teams und deiner Organisation. Du kannst Skills anpinnen, um sie im Chat zu priorisieren.
        </p>
        <div className="space-y-2">
          {sharedSkills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              isOwner={false}
              onPin={handlePin}
              onViewDetails={() => toast.info(`${skill.name}: ${skill.description}`)}
            />
          ))}
        </div>
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

export default SkillsTab;
