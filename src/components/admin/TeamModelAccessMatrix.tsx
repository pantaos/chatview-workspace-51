import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ModelLimit, TeamModelAccess } from "@/types/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  models: ModelLimit[];
  teamAccess: TeamModelAccess[];
}

const TeamModelAccessMatrix = ({ models, teamAccess: initial }: Props) => {
  const [teamAccess, setTeamAccess] = useState(initial);
  const enabledModels = models.filter(m => m.enabled);

  const toggle = (teamId: string, modelId: string) => {
    setTeamAccess(prev => prev.map(t => {
      if (t.teamId !== teamId) return t;
      const has = t.modelIds.includes(modelId);
      const modelIds = has ? t.modelIds.filter(id => id !== modelId) : [...t.modelIds, modelId];
      toast.success(`${t.teamName}: ${has ? "removed" : "added"} ${models.find(m => m.id === modelId)?.name}`);
      return { ...t, modelIds };
    }));
  };

  const toggleAll = (teamId: string) => {
    setTeamAccess(prev => prev.map(t => {
      if (t.teamId !== teamId) return t;
      const allIds = enabledModels.map(m => m.id);
      const hasAll = allIds.every(id => t.modelIds.includes(id));
      toast.success(`${t.teamName}: ${hasAll ? "cleared" : "all models granted"}`);
      return { ...t, modelIds: hasAll ? [] : allIds };
    }));
  };

  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      <table className="w-full text-sm border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="text-left font-medium text-muted-foreground py-2 pr-4 sticky left-0 bg-card">Team</th>
            {enabledModels.map(m => (
              <th key={m.id} className="text-center font-medium text-muted-foreground py-2 px-2 min-w-[90px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs">{m.name}</span>
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider px-1.5 py-0 h-4">{m.category}</Badge>
                </div>
              </th>
            ))}
            <th className="text-center font-medium text-muted-foreground py-2 px-2">All</th>
          </tr>
        </thead>
        <tbody>
          {teamAccess.map(t => {
            const allOn = enabledModels.every(m => t.modelIds.includes(m.id));
            return (
              <tr key={t.teamId} className="border-t border-border/40">
                <td className="py-3 pr-4 sticky left-0 bg-card">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", `bg-${t.teamColor}-500`)} />
                    <span className="font-medium">{t.teamName}</span>
                  </div>
                </td>
                {enabledModels.map(m => (
                  <td key={m.id} className="text-center py-3 px-2">
                    <Checkbox
                      checked={t.modelIds.includes(m.id)}
                      onCheckedChange={() => toggle(t.teamId, m.id)}
                    />
                  </td>
                ))}
                <td className="text-center py-3 px-2">
                  <Checkbox checked={allOn} onCheckedChange={() => toggleAll(t.teamId)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TeamModelAccessMatrix;
