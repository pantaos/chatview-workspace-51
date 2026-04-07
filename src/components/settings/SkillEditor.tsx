
import { useState } from "react";
import { Skill, SkillParameter, SkillScheduleFrequency } from "@/types/skills";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Clock } from "lucide-react";

interface SkillEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Skill | null;
  onSave: (data: Partial<Skill>) => void;
}

const SkillEditor = ({ open, onOpenChange, skill, onSave }: SkillEditorProps) => {
  const [name, setName] = useState(skill?.name || "");
  const [description, setDescription] = useState(skill?.description || "");
  const [instruction, setInstruction] = useState(skill?.instruction || "");
  const [triggerPhrases, setTriggerPhrases] = useState<string[]>(skill?.triggers.phrases || []);
  const [slashCommand, setSlashCommand] = useState(skill?.triggers.slashCommand || "");
  const [newPhrase, setNewPhrase] = useState("");
  const [scheduleEnabled, setScheduleEnabled] = useState(skill?.schedule?.enabled || false);
  const [frequency, setFrequency] = useState<SkillScheduleFrequency>(skill?.schedule?.frequency || "weekly");
  const [scheduleDay, setScheduleDay] = useState(skill?.schedule?.day || "Montag");
  const [scheduleTime, setScheduleTime] = useState(skill?.schedule?.time || "09:00");

  const handleAddPhrase = () => {
    if (newPhrase.trim() && !triggerPhrases.includes(newPhrase.trim())) {
      setTriggerPhrases([...triggerPhrases, newPhrase.trim()]);
      setNewPhrase("");
    }
  };

  const handleRemovePhrase = (phrase: string) => {
    setTriggerPhrases(triggerPhrases.filter(p => p !== phrase));
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      instruction,
      triggers: { phrases: triggerPhrases, slashCommand: slashCommand || undefined },
      schedule: scheduleEnabled ? {
        enabled: true,
        frequency,
        day: frequency !== "daily" ? scheduleDay : undefined,
        time: scheduleTime,
        notifyOnComplete: true,
      } : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{skill ? "Skill bearbeiten" : "Neuen Skill erstellen"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Wöchentliche Zusammenfassung" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Beschreibung</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Was macht dieser Skill?" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Instruktion (System Prompt)</Label>
            <Textarea
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              placeholder="Detaillierte Anweisung, wie der Skill ausgeführt werden soll..."
              rows={4}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Trigger-Phrasen</Label>
            <div className="flex gap-2">
              <Input
                value={newPhrase}
                onChange={e => setNewPhrase(e.target.value)}
                placeholder="z.B. wochenbericht"
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddPhrase())}
              />
              <Button variant="outline" size="sm" onClick={handleAddPhrase}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
            {triggerPhrases.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {triggerPhrases.map(phrase => (
                  <Badge key={phrase} variant="secondary" className="text-xs gap-1">
                    {phrase}
                    <button onClick={() => handleRemovePhrase(phrase)}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Slash-Command (optional)</Label>
            <Input
              value={slashCommand}
              onChange={e => setSlashCommand(e.target.value)}
              placeholder="z.B. /weekly-summary"
            />
          </div>

          {/* Schedule */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Label className="text-xs font-medium">Zeitplan</Label>
              </div>
              <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
            </div>
            
            {scheduleEnabled && (
              <div className="space-y-3 pl-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Frequenz</Label>
                    <Select value={frequency} onValueChange={(v) => setFrequency(v as SkillScheduleFrequency)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Täglich</SelectItem>
                        <SelectItem value="weekly">Wöchentlich</SelectItem>
                        <SelectItem value="biweekly">Alle 2 Wochen</SelectItem>
                        <SelectItem value="monthly">Monatlich</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {frequency !== "daily" && (
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Tag</Label>
                      <Select value={scheduleDay} onValueChange={setScheduleDay}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Uhrzeit</Label>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="h-8 text-xs w-32"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={!name.trim() || !instruction.trim()}>
            {skill ? "Speichern" : "Erstellen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillEditor;
