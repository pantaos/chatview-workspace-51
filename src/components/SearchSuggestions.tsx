import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Code,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Music,
  Video,
  Rss,
  Crop,
  GraduationCap,
  Sparkles,
  Workflow as WorkflowIcon,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  Assistant,
  Workflow,
  ConversationalWorkflow,
  WorkflowItem,
} from "@/types/workflow";
import type { Skill } from "@/types/skills";

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Code,
  FileText,
  Image: ImageIcon,
  MessageSquare,
  Music,
  Video,
  Rss,
  Crop,
  GraduationCap,
  Sparkles,
};

export type SuggestionType = "assistant" | "workflow" | "conversational" | "skill";

export interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  type: SuggestionType;
  raw: WorkflowItem | Skill;
}

interface SearchSuggestionsProps {
  query: string;
  assistants: Assistant[];
  workflows: Workflow[];
  conversational: ConversationalWorkflow[];
  skills: Skill[];
  onSelect: (item: SuggestionItem) => void;
  onClose: () => void;
}

const typeLabel: Record<SuggestionType, string> = {
  assistant: "Assistent",
  workflow: "Workflow",
  conversational: "Workflow",
  skill: "Skill",
};

const typeIcon: Record<SuggestionType, LucideIcon> = {
  assistant: Bot,
  workflow: WorkflowIcon,
  conversational: WorkflowIcon,
  skill: Zap,
};

const matches = (q: string, ...fields: (string | undefined)[]) =>
  fields.some((f) => f && f.toLowerCase().includes(q));

const SearchSuggestions = ({
  query,
  assistants,
  workflows,
  conversational,
  skills,
  onSelect,
  onClose,
}: SearchSuggestionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo<SuggestionItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const items: SuggestionItem[] = [];

    assistants.forEach((a) => {
      if (matches(q, a.title, a.description))
        items.push({
          id: a.id,
          title: a.title,
          description: a.description,
          icon: iconMap[a.icon] || Bot,
          type: "assistant",
          raw: a,
        });
    });

    workflows.forEach((w) => {
      if (matches(q, w.title, w.description))
        items.push({
          id: w.id,
          title: w.title,
          description: w.description,
          icon: iconMap[w.icon] || WorkflowIcon,
          type: "workflow",
          raw: w,
        });
    });

    conversational.forEach((c) => {
      if (matches(q, c.title, c.description))
        items.push({
          id: c.id,
          title: c.title,
          description: c.description,
          icon: iconMap[c.icon] || WorkflowIcon,
          type: "conversational",
          raw: c,
        });
    });

    skills.forEach((s) => {
      if (s.status !== "active") return;
      const triggerHit = s.triggers.phrases.some((p) =>
        p.toLowerCase().includes(q),
      ) || (s.triggers.slashCommand?.toLowerCase().includes(q) ?? false);
      if (matches(q, s.name, s.description) || triggerHit)
        items.push({
          id: s.id,
          title: s.name,
          description: s.description,
          icon: iconMap[s.icon] || Zap,
          type: "skill",
          raw: s,
        });
    });

    return items.slice(0, 5);
  }, [query, assistants, workflows, conversational, skills]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (suggestions.length === 0) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter" && suggestions[activeIndex]) {
        e.preventDefault();
        onSelect(suggestions[activeIndex]);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [suggestions, activeIndex, onClose, onSelect]);

  if (suggestions.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-full mt-2 z-50 bg-background border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
        Vorschläge
      </div>
      <ul className="py-1">
        {suggestions.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <li key={`${item.type}-${item.id}`}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => onSelect(item)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2 text-left transition-colors",
                  isActive ? "bg-muted" : "hover:bg-muted/60",
                )}
              >
                <span className="text-sm font-medium text-foreground truncate">
                  {item.title}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[10px] font-medium flex-shrink-0"
                >
                  {typeLabel[item.type]}
                </Badge>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
