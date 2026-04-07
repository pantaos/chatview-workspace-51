
import { Skill } from "@/types/skills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  FileText, Calendar, Mail, GitPullRequest, Users, CheckSquare, Search,
  MoreVertical, Pin, Clock, Zap
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const iconMap: Record<string, React.ElementType> = {
  FileText, Calendar, Mail, GitPullRequest, Users, CheckSquare, Search, Zap
};

interface SkillCardProps {
  skill: Skill;
  isOwner: boolean;
  onEdit?: (skill: Skill) => void;
  onToggle?: (skill: Skill) => void;
  onDelete?: (skill: Skill) => void;
  onDuplicate?: (skill: Skill) => void;
  onPin?: (skill: Skill) => void;
  onViewDetails?: (skill: Skill) => void;
}

const SkillCard = ({ skill, isOwner, onEdit, onToggle, onDelete, onDuplicate, onPin, onViewDetails }: SkillCardProps) => {
  const Icon = iconMap[skill.icon] || Zap;
  
  const formatLastUsed = (date?: Date) => {
    if (!date) return "Noch nie";
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Gerade eben";
    if (hours < 24) return `Vor ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Gestern";
    return `Vor ${days} Tagen`;
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors group">
      <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm truncate">{skill.name}</span>
          {skill.pinned && <Pin className="w-3 h-3 text-primary flex-shrink-0" />}
          {skill.schedule?.enabled && (
            <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">{skill.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {skill.scope === "team" && skill.teamName && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{skill.teamName}</Badge>
          )}
          <span className="text-[10px] text-muted-foreground">{skill.usageCount}× genutzt</span>
          <span className="text-[10px] text-muted-foreground">· {formatLastUsed(skill.lastUsed)}</span>
        </div>
        {skill.triggers.slashCommand && (
          <code className="text-[10px] text-primary/70 bg-primary/5 px-1 py-0.5 rounded mt-1 inline-block">
            {skill.triggers.slashCommand}
          </code>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {isOwner && (
          <Switch
            checked={skill.status === "active"}
            onCheckedChange={() => onToggle?.(skill)}
            className="scale-75"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwner ? (
              <>
                <DropdownMenuItem onClick={() => onEdit?.(skill)}>Bearbeiten</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(skill)}>Duplizieren</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(skill)} className="text-destructive">Löschen</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => onViewDetails?.(skill)}>Details ansehen</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPin?.(skill)}>
                  {skill.pinned ? "Nicht mehr anpinnen" : "Anpinnen"}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SkillCard;
