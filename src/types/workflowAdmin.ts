export interface WorkflowAdminConfig {
  id: string;
  name: string;
  description: string;
  welcomeMessage: string;
  icon: string;
  iconBg: string;
  steps: WorkflowStepAdmin[];
  settings: WorkflowSettings;
  lastModified: string;
}

export interface WorkflowSettings {
  imageCropping: {
    enabled: boolean;
    width: number;
    height: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export interface WorkflowStepAdmin {
  id: string;
  title: string;
  type: 'form' | 'processing' | 'approval' | 'branch' | 'output';
  description?: string;
  processorType?: string;
  config: StepConfig;
  collaboration?: CollaborationConfig;
}

export interface StepConfig {
  // Form step config
  submitButtonText?: string;
  fields?: { id: string; label: string; type: string }[];
  
  // Processing step config
  targetDuration?: number;
  maxScriptLength?: number;
  minScriptLength?: number;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  minScenes?: number;
  maxScenes?: number;
  maxBullets?: number;
  numQuestions?: number;
  useCaptions?: boolean;
  useSubtitles?: boolean;
  captionMode?: string;
  autoExecute?: boolean;
  pollingInterval?: number;
  pollingTimeout?: number;
  maxRetries?: number;
  
  // Approval step config
  onApproveStep?: string;
  onRejectStep?: string;
  autoApprove?: boolean;
  approvalMessage?: string;
  rejectionMessage?: string;
  groupByField?: string;
  
  // Branch step config
  branchField?: string;
  routeMapping?: { value: string; targetStep: string }[];
  
  // Output step config
  outputType?: 'text' | 'completion' | 'download';
  template?: string;
}

export interface CollaborationConfig {
  enabled: boolean;
  type: 'approval' | 'handoff';
  assigneeType: 'user' | 'team' | 'role';
  assigneeIds: string[];
  timeoutHours: number;
  requireComments: boolean;
  allowReassignment: boolean;
  escalation?: EscalationConfig;
}

export interface EscalationConfig {
  enabled: boolean;
  afterHours: number;
  toType: 'user' | 'team' | 'role';
  toIds: string[];
  notifyOriginal: boolean;
}

// Step type badges
export const stepTypeBadgeColors: Record<string, { bg: string; text: string }> = {
  form: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  processing: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
  approval: { bg: 'bg-green-500/10', text: 'text-green-600' },
  branch: { bg: 'bg-purple-500/10', text: 'text-purple-600' },
  output: { bg: 'bg-slate-500/10', text: 'text-slate-600' },
};

// Mock workflows data
export const mockWorkflows: WorkflowAdminConfig[] = [
  {
    id: "trendcast",
    name: "TrendCast Versa",
    description: "Video generation from URLs",
    welcomeMessage: "Welcome to TrendCast!",
    icon: "Video",
    iconBg: "bg-rose-500",
    lastModified: "2024-01-15",
    settings: {
      imageCropping: { enabled: false, width: 1920, height: 1080 },
      notifications: { email: true, push: true }
    },
    steps: [
      {
        id: "upload",
        title: "Upload Links",
        type: "form",
        description: "Enter URLs for content",
        config: {
          submitButtonText: "Continue",
          fields: [
            { id: "urls", label: "Video URLs", type: "textarea" }
          ]
        }
      },
      {
        id: "scrape",
        title: "Generate Script",
        type: "processing",
        description: "AI script generation",
        processorType: "scrape_and_generate_script",
        config: {
          targetDuration: 120,
          maxScriptLength: 4500,
          autoExecute: true,
          pollingInterval: 5,
          pollingTimeout: 300,
          maxRetries: 60
        }
      },
      {
        id: "script_approval",
        title: "Approve Script",
        type: "approval",
        description: "Review generated script",
        config: {
          approvalMessage: "Script approved",
          rejectionMessage: "Script rejected"
        },
        collaboration: {
          enabled: true,
          type: "approval",
          assigneeType: "team",
          assigneeIds: ["1"],
          timeoutHours: 24,
          requireComments: false,
          allowReassignment: true
        }
      },
      {
        id: "tts",
        title: "Text to Speech",
        type: "processing",
        description: "Generate audio",
        processorType: "text_to_speech",
        config: {
          voiceId: "default",
          stability: 0.5,
          similarityBoost: 0.75,
          autoExecute: true
        }
      },
      {
        id: "scenes",
        title: "Generate Scenes",
        type: "processing",
        description: "Create video scenes",
        processorType: "content_to_video_generate_scenes",
        config: {
          minScenes: 3,
          maxScenes: 10,
          autoExecute: true
        }
      },
      {
        id: "scenes_approval",
        title: "Approve Scenes",
        type: "approval",
        description: "Review scenes",
        config: {}
      },
      {
        id: "render",
        title: "Render Video",
        type: "processing",
        description: "Final video render",
        processorType: "json_to_video",
        config: {
          useCaptions: true,
          useSubtitles: false,
          captionMode: "word"
        }
      },
      {
        id: "output",
        title: "Download",
        type: "output",
        description: "Get final video",
        config: {
          outputType: "download"
        }
      }
    ]
  },
  {
    id: "hdi",
    name: "HDI Content-to-Video",
    description: "Document to video conversion",
    welcomeMessage: "Convert your documents to videos",
    icon: "FileVideo",
    iconBg: "bg-blue-500",
    lastModified: "2024-01-12",
    settings: {
      imageCropping: { enabled: true, width: 1920, height: 1080 },
      notifications: { email: true, push: false }
    },
    steps: [
      {
        id: "upload",
        title: "Upload Document",
        type: "form",
        config: { fields: [{ id: "file", label: "Document", type: "file" }] }
      },
      {
        id: "extract",
        title: "Extract Text",
        type: "processing",
        processorType: "extract_text_and_generate_script",
        config: { minScriptLength: 500, maxScriptLength: 3000 }
      },
      {
        id: "approval1",
        title: "Script Review",
        type: "approval",
        config: {},
        collaboration: {
          enabled: true,
          type: "approval",
          assigneeType: "user",
          assigneeIds: ["1", "2"],
          timeoutHours: 48,
          requireComments: true,
          allowReassignment: true,
          escalation: {
            enabled: true,
            afterHours: 24,
            toType: "team",
            toIds: ["1"],
            notifyOriginal: true
          }
        }
      },
      {
        id: "scenes",
        title: "Generate Scenes",
        type: "processing",
        processorType: "content_to_video_generate_scenes",
        config: { minScenes: 5, maxScenes: 15 }
      },
      {
        id: "approval2",
        title: "Scene Review",
        type: "approval",
        config: {}
      },
      {
        id: "bullets",
        title: "Generate Bullets",
        type: "processing",
        processorType: "generate_titles_and_bullets",
        config: { maxBullets: 5 }
      },
      {
        id: "images",
        title: "Generate Images",
        type: "processing",
        processorType: "generate_background_images",
        config: {}
      },
      {
        id: "approval3",
        title: "Final Review",
        type: "approval",
        config: {}
      },
      {
        id: "render",
        title: "Render",
        type: "processing",
        processorType: "json_to_video",
        config: { useCaptions: true }
      },
      {
        id: "output",
        title: "Download",
        type: "output",
        config: { outputType: "download" }
      }
    ]
  },
  {
    id: "asb",
    name: "ASB AI Avatar",
    description: "Interactive avatar videos with quizzes",
    welcomeMessage: "Create engaging avatar content",
    icon: "UserCircle",
    iconBg: "bg-emerald-500",
    lastModified: "2024-01-10",
    settings: {
      imageCropping: { enabled: true, width: 1080, height: 1920 },
      notifications: { email: true, push: true }
    },
    steps: [
      { id: "upload", title: "Upload Content", type: "form", config: {} },
      { id: "extract", title: "Extract Script", type: "processing", processorType: "extract_text_and_generate_script", config: { minScriptLength: 300, maxScriptLength: 2000 } },
      { id: "approval1", title: "Script Approval", type: "approval", config: {}, collaboration: { enabled: true, type: "approval", assigneeType: "team", assigneeIds: ["2"], timeoutHours: 24, requireComments: false, allowReassignment: true } },
      { id: "scenes", title: "Scenes", type: "processing", processorType: "content_to_video_generate_scenes", config: { minScenes: 3, maxScenes: 8 } },
      { id: "approval2", title: "Scene Approval", type: "approval", config: {} },
      { id: "bullets", title: "Bullets", type: "processing", processorType: "generate_titles_and_bullets", config: { maxBullets: 4 } },
      { id: "approval3", title: "Bullet Review", type: "approval", config: {} },
      { id: "images", title: "Images", type: "processing", processorType: "generate_background_images", config: {} },
      { id: "approval4", title: "Image Review", type: "approval", config: {} },
      { id: "quiz", title: "Generate Quiz", type: "processing", processorType: "generate_mcq_from_script", config: { numQuestions: 5 } },
      { id: "approval5", title: "Quiz Review", type: "approval", config: {} },
      { id: "render", title: "Render", type: "processing", processorType: "json_to_video", config: { useCaptions: true, useSubtitles: true } },
      { id: "approval6", title: "Final Approval", type: "approval", config: {} },
      { id: "output", title: "Download", type: "output", config: { outputType: "download" } }
    ]
  },
  {
    id: "bitproject",
    name: "BitProject FTP",
    description: "Automated FTP distribution",
    welcomeMessage: "Distribute content via FTP",
    icon: "Upload",
    iconBg: "bg-slate-700",
    lastModified: "2024-01-08",
    settings: {
      imageCropping: { enabled: false, width: 0, height: 0 },
      notifications: { email: true, push: false }
    },
    steps: [
      { id: "select", title: "Select Content", type: "form", config: {} },
      { id: "branch", title: "Category", type: "branch", config: { branchField: "category", routeMapping: [{ value: "news", targetStep: "news_process" }, { value: "sports", targetStep: "sports_process" }] } },
      { id: "process", title: "Process", type: "processing", processorType: "ftp_distribution", config: {} },
      { id: "upload", title: "FTP Upload", type: "processing", processorType: "ftp_distribution", config: {} },
      { id: "output", title: "Complete", type: "output", config: { outputType: "completion" } }
    ]
  },
  {
    id: "newsletter",
    name: "BitProject Newsletter",
    description: "Automated newsletter generation",
    welcomeMessage: "Create newsletters from RSS",
    icon: "Mail",
    iconBg: "bg-violet-500",
    lastModified: "2024-01-05",
    settings: {
      imageCropping: { enabled: false, width: 0, height: 0 },
      notifications: { email: true, push: false }
    },
    steps: [
      { id: "sources", title: "RSS Sources", type: "form", config: {} },
      { id: "fetch", title: "Fetch Content", type: "processing", config: {} },
      { id: "generate", title: "Generate Newsletter", type: "processing", config: {} },
      { id: "approval", title: "Review", type: "approval", config: {} },
      { id: "send", title: "Send", type: "processing", config: {} },
      { id: "output", title: "Complete", type: "output", config: { outputType: "completion" } }
    ]
  }
];
