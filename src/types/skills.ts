
export type SkillStatus = "active" | "draft" | "disabled";
export type SkillScope = "personal" | "team" | "organization";
export type SkillScheduleFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export interface SkillTrigger {
  phrases: string[];
  slashCommand?: string; // e.g. "/weekly-summary"
}

export interface SkillSchedule {
  enabled: boolean;
  frequency: SkillScheduleFrequency;
  day?: string;
  time?: string;
  notifyOnComplete: boolean;
}

export interface SkillParameter {
  id: string;
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "file";
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  instruction: string; // system prompt / structured instruction
  triggers: SkillTrigger;
  parameters: SkillParameter[];
  requiredIntegrations: string[];
  status: SkillStatus;
  scope: SkillScope;
  schedule?: SkillSchedule;
  createdBy: {
    id: string;
    name: string;
  };
  teamId?: string;
  teamName?: string;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
}

export interface SkillExecutionResult {
  skillId: string;
  skillName: string;
  content: string;
  timestamp: Date;
  parameters: Record<string, any>;
}
