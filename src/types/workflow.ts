
export interface WorkflowTag {
  id: string;
  name: string;
  color: string;
}

export interface WorkflowField {
  id: string;
  type: 'text' | 'textarea' | 'url' | 'file' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select fields
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'input' | 'editor' | 'download';
  fields?: WorkflowField[];
  description?: string;
}

export interface ConversationalStep {
  id: string;
  title: string;
  description: string;
  fields: WorkflowField[];
  nextStep?: string;
}

export interface BaseWorkflow {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: WorkflowTag[];
  translationKey?: string;
  isFavorite?: boolean;
}

export interface Assistant extends BaseWorkflow {
  type: 'assistant';
  systemPrompt: string;
  starters: Array<{
    displayText: string;
    fullPrompt: string;
  }>;
}

export interface Workflow extends BaseWorkflow {
  type: 'workflow';
  steps: WorkflowStep[];
  route: string;
}

export interface ConversationalWorkflow extends BaseWorkflow {
  type: 'conversational';
  steps: ConversationalStep[];
  initialMessage: string;
}

export type WorkflowItem = Assistant | Workflow | ConversationalWorkflow;

export interface TagCreationData {
  name: string;
  color: string;
}
