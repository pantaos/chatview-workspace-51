import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
  Play,
  BarChart3,
  Bell,
  Users,
  ExternalLink,
  RefreshCw,
  Calendar,
  Settings2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ScheduleDialog from "@/components/ScheduleDialog";

// Use case definitions with their step configurations
const useCaseDefinitions: Record<string, UseCaseDefinition> = {
  "1": {
    id: "1",
    name: "Weekly Summary",
    icon: BarChart3,
    description: "Generate and post a weekly engineering summary to Slack",
    integrations: ["GitHub", "Slack"],
    configSteps: [
      {
        id: "repos",
        title: "Select Repositories",
        description: "Which GitHub repositories should I include?",
        type: "radio",
        options: [
          { id: "all", label: "All repos I have access to" },
          { id: "specific", label: "Let me specify", hasInput: true, inputPlaceholder: "e.g. frontend, backend, infra" },
        ],
      },
      {
        id: "channel",
        title: "Slack Channel",
        description: "Which Slack channel should the summary be posted to?",
        type: "radio",
        options: [
          { id: "engineering", label: "#engineering" },
          { id: "engineering-updates", label: "#engineering-updates" },
          { id: "other", label: "Other", hasInput: true, inputPlaceholder: "#channel-name" },
        ],
      },
      {
        id: "content",
        title: "Summary Content",
        description: "What should the summary include?",
        type: "checkbox",
        options: [
          { id: "commits", label: "Commits and PRs", defaultChecked: true },
          { id: "issues", label: "Issues opened/closed", defaultChecked: true },
          { id: "reviews", label: "Code review activity" },
          { id: "deployments", label: "Deployment status" },
        ],
      },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to GitHub (3 repositories)", duration: 1200 },
      { id: "commits", label: "Fetched commits from last 7 days (47 commits)", duration: 1800 },
      { id: "prs", label: "Fetched pull requests (12 merged, 3 open)", duration: 1500 },
      { id: "issues", label: "Fetched issues (8 closed, 5 opened)", duration: 1400 },
      { id: "summary", label: "Generating summary with AI...", duration: 2500 },
      { id: "post", label: "Posting to #engineering-updates", duration: 800 },
    ],
    result: {
      title: "📊 Weekly Engineering Summary (Feb 17–24)",
      destination: "Summary posted to #engineering-updates",
      content: [
        "Commits: 47 across 3 repos",
        "PRs: 12 merged, 3 in review",
        "Issues: 8 closed, 5 new",
      ],
      highlights: [
        "Payment service refactor completed (PR #234)",
        "New user onboarding flow deployed",
        "3 critical bugs fixed in auth module",
      ],
      viewLink: "View in Slack",
    },
  },
  "2": {
    id: "2",
    name: "PR Review Alert",
    icon: Bell,
    description: "Get notified about pending pull requests that need your review",
    integrations: ["GitHub", "Jira"],
    configSteps: [
      {
        id: "repos",
        title: "Repositories",
        description: "Which repositories should I monitor?",
        type: "radio",
        options: [
          { id: "all", label: "All assigned repos" },
          { id: "specific", label: "Let me choose", hasInput: true, inputPlaceholder: "e.g. api, web-app" },
        ],
      },
      {
        id: "frequency",
        title: "Alert Frequency",
        description: "How often should I check for pending reviews?",
        type: "radio",
        options: [
          { id: "realtime", label: "Real-time (instant)" },
          { id: "hourly", label: "Every hour" },
          { id: "daily", label: "Once a day (morning)" },
        ],
      },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to GitHub", duration: 1000 },
      { id: "scan", label: "Scanning assigned PRs (5 pending)", duration: 2000 },
      { id: "jira", label: "Cross-referencing with Jira tickets", duration: 1500 },
      { id: "alert", label: "Sending alert digest", duration: 800 },
    ],
    result: {
      title: "🔔 PR Review Alert Configured",
      destination: "5 PRs need your attention",
      content: [
        "High priority: 2 PRs (linked to P1 Jira tickets)",
        "Normal: 3 PRs waiting > 24 hours",
      ],
      highlights: [
        "PR #312: Auth token refresh logic",
        "PR #298: Database migration v2.4",
      ],
      viewLink: "View PRs",
    },
  },
  "3": {
    id: "3",
    name: "Standup Bot",
    icon: Users,
    description: "Automate daily standup collection and summary for your team",
    integrations: ["Slack"],
    configSteps: [
      {
        id: "channel",
        title: "Standup Channel",
        description: "Where should standups be collected?",
        type: "radio",
        options: [
          { id: "standup", label: "#daily-standup" },
          { id: "team", label: "#team-updates" },
          { id: "other", label: "Other", hasInput: true, inputPlaceholder: "#channel-name" },
        ],
      },
      {
        id: "time",
        title: "Schedule",
        description: "When should the standup prompt be sent?",
        type: "radio",
        options: [
          { id: "9am", label: "9:00 AM" },
          { id: "930am", label: "9:30 AM" },
          { id: "10am", label: "10:00 AM" },
        ],
      },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to Slack workspace", duration: 1000 },
      { id: "channel", label: "Configured #daily-standup channel", duration: 800 },
      { id: "schedule", label: "Scheduled daily prompt at 9:00 AM", duration: 1200 },
      { id: "test", label: "Sending test standup message...", duration: 1500 },
    ],
    result: {
      title: "🤖 Standup Bot Active",
      destination: "Bot configured in #daily-standup",
      content: ["Daily prompt at 9:00 AM", "Auto-summary posted at 10:30 AM", "6 team members will be pinged"],
      highlights: ["Standup format: Yesterday / Today / Blockers", "Summary includes participation rate"],
      viewLink: "View in Slack",
    },
  },
  // Sales
  "10": {
    id: "10",
    name: "Deal Pipeline Report",
    icon: BarChart3,
    description: "Generate a weekly deal pipeline overview and share with your sales team",
    integrations: ["Salesforce", "Slack"],
    configSteps: [
      { id: "pipeline", title: "Pipeline", description: "Which pipeline should I report on?", type: "radio", options: [{ id: "all", label: "All pipelines" }, { id: "enterprise", label: "Enterprise only" }, { id: "smb", label: "SMB only" }] },
      { id: "channel", title: "Destination", description: "Where should the report go?", type: "radio", options: [{ id: "sales", label: "#sales" }, { id: "sales-ops", label: "#sales-ops" }, { id: "other", label: "Other", hasInput: true, inputPlaceholder: "#channel-name" }] },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to Salesforce", duration: 1200 },
      { id: "fetch", label: "Fetching pipeline data (42 active deals)", duration: 2000 },
      { id: "analyze", label: "Analyzing win rates and stage progression", duration: 1800 },
      { id: "post", label: "Posting report to #sales", duration: 800 },
    ],
    result: {
      title: "📈 Deal Pipeline Report (Feb 17–24)",
      destination: "Report posted to #sales",
      content: ["Active deals: 42 ($2.1M total)", "Moved to Close: 5 deals ($380K)", "At risk: 3 deals stalled > 14 days"],
      highlights: ["Acme Corp moved to negotiation ($120K)", "3 new enterprise leads added", "Win rate up 4% vs last week"],
      viewLink: "View in Salesforce",
    },
  },
  "11": {
    id: "11",
    name: "Lead Score Digest",
    icon: Bell,
    description: "Get a daily digest of top scored leads from HubSpot",
    integrations: ["HubSpot", "Slack"],
    configSteps: [
      { id: "threshold", title: "Score Threshold", description: "Minimum lead score to include?", type: "radio", options: [{ id: "80", label: "80+ (Hot leads only)" }, { id: "60", label: "60+ (Warm & hot)" }, { id: "all", label: "All scored leads" }] },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to HubSpot", duration: 1000 },
      { id: "fetch", label: "Fetching scored leads (18 above threshold)", duration: 1500 },
      { id: "rank", label: "Ranking by engagement signals", duration: 1200 },
      { id: "post", label: "Sending digest", duration: 800 },
    ],
    result: {
      title: "🎯 Lead Score Digest",
      destination: "Digest sent to #sales",
      content: ["18 leads scored 80+", "Top lead: TechCorp (score 96)", "5 leads moved up from warm to hot"],
      highlights: ["TechCorp opened pricing page 4x today", "DataInc requested demo via chatbot"],
      viewLink: "View in HubSpot",
    },
  },
  "12": {
    id: "12",
    name: "Meeting Prep Brief",
    icon: BarChart3,
    description: "Auto-generate a prep brief before each sales meeting",
    integrations: ["Salesforce", "Calendar"],
    configSteps: [
      { id: "scope", title: "Meeting Types", description: "Which meetings should get a brief?", type: "radio", options: [{ id: "external", label: "External meetings only" }, { id: "all", label: "All calendar events" }] },
      { id: "content", title: "Brief Content", description: "What to include?", type: "checkbox", options: [{ id: "company", label: "Company overview", defaultChecked: true }, { id: "deal", label: "Deal history", defaultChecked: true }, { id: "news", label: "Recent news" }, { id: "linkedin", label: "Attendee LinkedIn summaries" }] },
    ],
    executionSteps: [
      { id: "cal", label: "Scanning calendar (3 meetings today)", duration: 1000 },
      { id: "crm", label: "Pulling CRM data for attendees", duration: 1500 },
      { id: "research", label: "Researching company news", duration: 2000 },
      { id: "brief", label: "Generating prep briefs", duration: 1800 },
    ],
    result: {
      title: "📋 Meeting Prep Briefs Ready",
      destination: "3 briefs generated for today",
      content: ["10:00 AM – Acme Corp (Renewal)", "1:00 PM – TechStart (Discovery)", "3:30 PM – GlobalFin (Demo)"],
      highlights: ["Acme Corp raised $20M Series B last week", "TechStart CEO previously at Stripe"],
      viewLink: "View Briefs",
    },
  },
  "13": {
    id: "13",
    name: "CRM Data Sync",
    icon: BarChart3,
    description: "Keep Salesforce and HubSpot contacts in sync automatically",
    integrations: ["Salesforce", "HubSpot"],
    configSteps: [
      { id: "direction", title: "Sync Direction", description: "How should data flow?", type: "radio", options: [{ id: "bi", label: "Bi-directional" }, { id: "sf-to-hs", label: "Salesforce → HubSpot" }, { id: "hs-to-sf", label: "HubSpot → Salesforce" }] },
    ],
    executionSteps: [
      { id: "connect-sf", label: "Connected to Salesforce", duration: 1000 },
      { id: "connect-hs", label: "Connected to HubSpot", duration: 1000 },
      { id: "diff", label: "Comparing records (234 contacts)", duration: 2000 },
      { id: "sync", label: "Syncing 12 updated records", duration: 1500 },
    ],
    result: {
      title: "🔄 CRM Sync Complete",
      destination: "12 records synced",
      content: ["Salesforce → HubSpot: 8 updates", "HubSpot → Salesforce: 4 updates", "0 conflicts detected"],
      highlights: ["All contact emails and phone numbers in sync", "Next auto-sync in 1 hour"],
      viewLink: "View Sync Log",
    },
  },
  // HR
  "20": {
    id: "20",
    name: "Onboarding Checklist",
    icon: Users,
    description: "Auto-create onboarding tasks and send welcome messages for new hires",
    integrations: ["Slack", "Notion"],
    configSteps: [
      { id: "template", title: "Template", description: "Which onboarding template?", type: "radio", options: [{ id: "eng", label: "Engineering" }, { id: "sales", label: "Sales" }, { id: "general", label: "General" }] },
      { id: "notify", title: "Notifications", description: "Who should be notified?", type: "checkbox", options: [{ id: "manager", label: "Direct manager", defaultChecked: true }, { id: "buddy", label: "Onboarding buddy", defaultChecked: true }, { id: "it", label: "IT team" }, { id: "hr", label: "HR team" }] },
    ],
    executionSteps: [
      { id: "create", label: "Creating Notion checklist (14 tasks)", duration: 1500 },
      { id: "assign", label: "Assigning tasks to stakeholders", duration: 1200 },
      { id: "welcome", label: "Sending welcome message to #new-hires", duration: 800 },
      { id: "calendar", label: "Scheduling orientation meetings", duration: 1000 },
    ],
    result: {
      title: "✅ Onboarding Checklist Created",
      destination: "14 tasks assigned across 4 people",
      content: ["Week 1: Setup & introductions (6 tasks)", "Week 2: Training & shadowing (5 tasks)", "Week 3: First project assignment (3 tasks)"],
      highlights: ["Welcome message sent to #new-hires", "IT provisioning ticket auto-created"],
      viewLink: "View in Notion",
    },
  },
  "21": {
    id: "21",
    name: "PTO Balance Alert",
    icon: Bell,
    description: "Remind team members about unused PTO balances",
    integrations: ["BambooHR", "Slack"],
    configSteps: [
      { id: "frequency", title: "Reminder Frequency", description: "How often to send reminders?", type: "radio", options: [{ id: "weekly", label: "Weekly" }, { id: "biweekly", label: "Bi-weekly" }, { id: "monthly", label: "Monthly" }] },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to BambooHR", duration: 1000 },
      { id: "fetch", label: "Fetching PTO balances (24 employees)", duration: 1500 },
      { id: "filter", label: "Identifying employees with > 10 days unused", duration: 800 },
      { id: "notify", label: "Sending personalized reminders", duration: 1200 },
    ],
    result: {
      title: "🏖️ PTO Balance Alerts Sent",
      destination: "8 reminders sent via Slack DM",
      content: ["8 employees have > 10 days unused PTO", "Average unused: 14.2 days", "Company average utilization: 62%"],
      highlights: ["Q1 deadline approaching – 3 employees at risk of losing days", "Auto-reminder scheduled for next Monday"],
      viewLink: "View in BambooHR",
    },
  },
  "22": {
    id: "22",
    name: "Engagement Survey",
    icon: Users,
    description: "Launch a quick pulse survey and collect anonymous feedback",
    integrations: ["Slack", "Google Forms"],
    configSteps: [
      { id: "type", title: "Survey Type", description: "What kind of survey?", type: "radio", options: [{ id: "pulse", label: "Quick pulse (3 questions)" }, { id: "detailed", label: "Detailed (8 questions)" }, { id: "custom", label: "Custom", hasInput: true, inputPlaceholder: "Describe your survey" }] },
    ],
    executionSteps: [
      { id: "create", label: "Creating Google Form", duration: 1500 },
      { id: "distribute", label: "Sending survey link to #general", duration: 800 },
      { id: "schedule", label: "Setting reminder for non-respondents", duration: 1000 },
    ],
    result: {
      title: "📊 Engagement Survey Launched",
      destination: "Survey link posted to #general",
      content: ["3-question pulse survey", "Anonymous responses enabled", "Deadline: Friday EOD"],
      highlights: ["Reminder scheduled for Thursday", "Results will be auto-summarized"],
      viewLink: "View Survey",
    },
  },
  // Marketing
  "30": {
    id: "30",
    name: "Campaign Performance",
    icon: BarChart3,
    description: "Weekly summary of ad campaign performance across channels",
    integrations: ["Google Ads", "Slack"],
    configSteps: [
      { id: "campaigns", title: "Campaigns", description: "Which campaigns to track?", type: "radio", options: [{ id: "all", label: "All active campaigns" }, { id: "top", label: "Top 5 by spend" }] },
      { id: "metrics", title: "Key Metrics", description: "What to highlight?", type: "checkbox", options: [{ id: "roas", label: "ROAS", defaultChecked: true }, { id: "cpc", label: "Cost per click", defaultChecked: true }, { id: "conv", label: "Conversions" }, { id: "impressions", label: "Impressions" }] },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to Google Ads", duration: 1000 },
      { id: "fetch", label: "Pulling campaign data (12 active)", duration: 1800 },
      { id: "analyze", label: "Calculating ROAS and trends", duration: 1500 },
      { id: "report", label: "Generating visual report", duration: 2000 },
      { id: "post", label: "Posting to #marketing", duration: 800 },
    ],
    result: {
      title: "📣 Campaign Performance (Feb 17–24)",
      destination: "Report posted to #marketing",
      content: ["Total spend: $12,400", "ROAS: 3.2x (up 0.4x)", "Top campaign: Spring Launch (4.1x ROAS)"],
      highlights: ["Spring Launch outperforming by 28%", "Retargeting CPC dropped 15%", "2 campaigns below target – paused"],
      viewLink: "View in Google Ads",
    },
  },
  "31": {
    id: "31",
    name: "Social Media Digest",
    icon: Bell,
    description: "Daily digest of social media engagement and mentions",
    integrations: ["Buffer", "Slack"],
    configSteps: [
      { id: "platforms", title: "Platforms", description: "Which platforms to monitor?", type: "checkbox", options: [{ id: "twitter", label: "Twitter/X", defaultChecked: true }, { id: "linkedin", label: "LinkedIn", defaultChecked: true }, { id: "instagram", label: "Instagram" }, { id: "facebook", label: "Facebook" }] },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to Buffer", duration: 1000 },
      { id: "fetch", label: "Fetching engagement data", duration: 1500 },
      { id: "mentions", label: "Scanning brand mentions (23 new)", duration: 1200 },
      { id: "digest", label: "Compiling daily digest", duration: 800 },
    ],
    result: {
      title: "📱 Social Media Digest",
      destination: "Digest posted to #marketing",
      content: ["Total impressions: 45.2K", "Engagement rate: 3.8%", "Brand mentions: 23 (12 positive, 11 neutral)"],
      highlights: ["LinkedIn post went viral – 12K impressions", "Influencer @techguru mentioned us"],
      viewLink: "View in Buffer",
    },
  },
  "32": {
    id: "32",
    name: "Content Ideas Generator",
    icon: BarChart3,
    description: "Generate content ideas based on trending topics and competitor analysis",
    integrations: ["Google Trends", "Notion"],
    configSteps: [
      { id: "topics", title: "Focus Areas", description: "What topics to explore?", type: "checkbox", options: [{ id: "industry", label: "Industry trends", defaultChecked: true }, { id: "competitor", label: "Competitor content" }, { id: "audience", label: "Audience questions", defaultChecked: true }] },
    ],
    executionSteps: [
      { id: "trends", label: "Analyzing Google Trends", duration: 1500 },
      { id: "competitor", label: "Scanning competitor blogs", duration: 2000 },
      { id: "generate", label: "Generating 10 content ideas with AI", duration: 2500 },
      { id: "save", label: "Saving to Notion content calendar", duration: 800 },
    ],
    result: {
      title: "💡 10 Content Ideas Generated",
      destination: "Ideas added to Notion content calendar",
      content: ["5 blog post ideas", "3 social media series", "2 video concepts"],
      highlights: ["'AI in Sales' trending +240% this month", "Competitor gap: No one covering 'automation ROI'"],
      viewLink: "View in Notion",
    },
  },
  "33": {
    id: "33",
    name: "Email Drip Sync",
    icon: Bell,
    description: "Sync email drip campaigns between Mailchimp and HubSpot",
    integrations: ["Mailchimp", "HubSpot"],
    configSteps: [
      { id: "direction", title: "Sync Direction", description: "How should contacts flow?", type: "radio", options: [{ id: "mc-to-hs", label: "Mailchimp → HubSpot" }, { id: "hs-to-mc", label: "HubSpot → Mailchimp" }, { id: "bi", label: "Bi-directional" }] },
    ],
    executionSteps: [
      { id: "connect-mc", label: "Connected to Mailchimp", duration: 1000 },
      { id: "connect-hs", label: "Connected to HubSpot", duration: 1000 },
      { id: "sync", label: "Syncing subscriber lists (1,240 contacts)", duration: 2000 },
      { id: "verify", label: "Verifying drip sequence alignment", duration: 1200 },
    ],
    result: {
      title: "📧 Email Drip Sync Complete",
      destination: "1,240 contacts synced",
      content: ["New subscribers synced: 48", "Unsubscribes synced: 12", "Drip sequences aligned: 3"],
      highlights: ["Welcome series now triggers in both platforms", "Next auto-sync in 6 hours"],
      viewLink: "View Sync Log",
    },
  },
  // Finance
  "40": {
    id: "40",
    name: "Expense Report Summary",
    icon: BarChart3,
    description: "Weekly summary of team expenses and budget utilization",
    integrations: ["QuickBooks", "Slack"],
    configSteps: [
      { id: "scope", title: "Scope", description: "Which departments?", type: "radio", options: [{ id: "all", label: "All departments" }, { id: "specific", label: "Select departments", hasInput: true, inputPlaceholder: "e.g. Engineering, Marketing" }] },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to QuickBooks", duration: 1000 },
      { id: "fetch", label: "Fetching expense data", duration: 1800 },
      { id: "categorize", label: "Categorizing expenses (142 entries)", duration: 1500 },
      { id: "report", label: "Generating summary report", duration: 1200 },
    ],
    result: {
      title: "💰 Expense Report (Feb 17–24)",
      destination: "Report posted to #finance",
      content: ["Total expenses: $34,200", "Budget utilization: 78%", "Top category: Software subscriptions ($12,400)"],
      highlights: ["Marketing 15% over budget – flagged", "Engineering under budget by $3,200"],
      viewLink: "View in QuickBooks",
    },
  },
  "41": {
    id: "41",
    name: "Invoice Reminder",
    icon: Bell,
    description: "Automatically remind clients about overdue invoices",
    integrations: ["QuickBooks", "Email"],
    configSteps: [
      { id: "threshold", title: "Overdue Threshold", description: "When to start reminding?", type: "radio", options: [{ id: "7", label: "7 days overdue" }, { id: "14", label: "14 days overdue" }, { id: "30", label: "30 days overdue" }] },
    ],
    executionSteps: [
      { id: "connect", label: "Connected to QuickBooks", duration: 1000 },
      { id: "scan", label: "Scanning overdue invoices", duration: 1500 },
      { id: "draft", label: "Drafting reminder emails (6 clients)", duration: 1200 },
      { id: "send", label: "Sending reminders", duration: 800 },
    ],
    result: {
      title: "📨 Invoice Reminders Sent",
      destination: "6 reminder emails sent",
      content: ["Total overdue: $28,500", "7–14 days: 3 invoices ($12,000)", "14–30 days: 2 invoices ($11,500)", "30+ days: 1 invoice ($5,000)"],
      highlights: ["Escalation flagged for 30+ day invoice (ClientCo)", "Auto follow-up scheduled in 7 days"],
      viewLink: "View in QuickBooks",
    },
  },
};

// Types
interface ConfigOption {
  id: string;
  label: string;
  hasInput?: boolean;
  inputPlaceholder?: string;
  defaultChecked?: boolean;
}

interface ConfigStep {
  id: string;
  title: string;
  description: string;
  type: "radio" | "checkbox";
  options: ConfigOption[];
}

interface ExecutionStep {
  id: string;
  label: string;
  duration: number;
}

interface UseCaseResult {
  title: string;
  destination: string;
  content: string[];
  highlights: string[];
  viewLink: string;
}

interface UseCaseDefinition {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  integrations: string[];
  configSteps: ConfigStep[];
  executionSteps: ExecutionStep[];
  result: UseCaseResult;
}

type Phase = "configure" | "executing" | "done";

const UseCaseRun = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const useCase = useCaseDefinitions[id || "1"];

  const [phase, setPhase] = useState<Phase>("configure");
  const [currentConfigStep, setCurrentConfigStep] = useState(0);
  const [configData, setConfigData] = useState<Record<string, any>>({});
  const [completedExecSteps, setCompletedExecSteps] = useState<number>(-1);
  const [activeExecStep, setActiveExecStep] = useState(0);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Execution simulation
  useEffect(() => {
    if (phase !== "executing") return;
    if (activeExecStep >= useCase.executionSteps.length) {
      setPhase("done");
      return;
    }

    const timer = setTimeout(() => {
      setCompletedExecSteps(activeExecStep);
      setActiveExecStep((s) => s + 1);
    }, useCase.executionSteps[activeExecStep].duration);

    return () => clearTimeout(timer);
  }, [phase, activeExecStep, useCase]);

  const handleRadioSelect = useCallback((stepId: string, optionId: string) => {
    setConfigData((prev) => ({ ...prev, [stepId]: optionId }));
  }, []);

  const handleCheckboxToggle = useCallback((stepId: string, optionId: string, checked: boolean) => {
    setConfigData((prev) => {
      const current = (prev[stepId] as string[]) || [];
      return {
        ...prev,
        [stepId]: checked ? [...current, optionId] : current.filter((i: string) => i !== optionId),
      };
    });
  }, []);

  const handleNextStep = useCallback(() => {
    if (currentConfigStep < useCase.configSteps.length - 1) {
      setCurrentConfigStep((s) => s + 1);
    }
  }, [currentConfigStep, useCase]);

  const handlePrevStep = useCallback(() => {
    if (currentConfigStep > 0) {
      setCurrentConfigStep((s) => s - 1);
    }
  }, [currentConfigStep]);

  const handleExecute = useCallback(() => {
    setPhase("executing");
    setActiveExecStep(0);
    setCompletedExecSteps(-1);
  }, []);

  if (!useCase) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Use case not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/use-cases")}>
            Back to Marketplace
          </Button>
        </div>
      </MainLayout>
    );
  }

  const Icon = useCase.icon;
  const totalSteps = useCase.configSteps.length;
  const progressPercent =
    phase === "configure"
      ? ((currentConfigStep + 1) / (totalSteps + 2)) * 100
      : phase === "executing"
      ? (((completedExecSteps + 1) / useCase.executionSteps.length) * 50 + 50)
      : 100;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/use-cases")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{useCase.name}</h1>
            <p className="text-xs text-muted-foreground">{useCase.description}</p>
          </div>
        </div>

        {/* Phase tabs / progress */}
        <div className="flex items-center gap-1 my-6">
          {["Configure", "Execute", "Result"].map((label, i) => {
            const phaseMap: Phase[] = ["configure", "executing", "done"];
            const isActive = phase === phaseMap[i];
            const isDone = phaseMap.indexOf(phase) > i;
            return (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1",
                  isActive && "bg-primary/10 text-primary ring-1 ring-primary/20",
                  isDone && "bg-primary/5 text-primary",
                  !isActive && !isDone && "text-muted-foreground"
                )}>
                  {isDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : isActive ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                  {label}
                </div>
                {i < 2 && <div className={cn("h-px w-4 shrink-0", isDone ? "bg-primary/30" : "bg-border")} />}
              </div>
            );
          })}
        </div>

        <Progress value={progressPercent} className="h-1 mb-8" />

        {/* ── CONFIGURE PHASE ── */}
        {phase === "configure" && (
          <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Step {currentConfigStep + 1} of {totalSteps}</span>
              <span>·</span>
              <span>{useCase.configSteps[currentConfigStep].title}</span>
            </div>

            {/* Agent message */}
            <div className="border border-border/60 rounded-xl bg-card p-5">
              <p className="text-sm font-medium text-foreground mb-1">
                {currentConfigStep === 0 ? "I'll help you with that. A few quick questions:" : useCase.configSteps[currentConfigStep].title}
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                {useCase.configSteps[currentConfigStep].description}
              </p>

              <div className="space-y-3">
                {useCase.configSteps[currentConfigStep].options.map((opt) => {
                  const step = useCase.configSteps[currentConfigStep];
                  const isRadio = step.type === "radio";
                  const isSelected = isRadio
                    ? configData[step.id] === opt.id
                    : ((configData[step.id] as string[]) || []).includes(opt.id);

                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        isSelected
                          ? "border-primary/40 bg-primary/5"
                          : "border-border/60 hover:border-border hover:bg-muted/30"
                      )}
                    >
                      {isRadio ? (
                        <input
                          type="radio"
                          name={step.id}
                          checked={isSelected}
                          onChange={() => handleRadioSelect(step.id, opt.id)}
                          className="mt-0.5 accent-[hsl(var(--primary))]"
                        />
                      ) : (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(c) => handleCheckboxToggle(step.id, opt.id, !!c)}
                          className="mt-0.5"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground">{opt.label}</span>
                        {opt.hasInput && isSelected && (
                          <Input
                            placeholder={opt.inputPlaceholder}
                            value={customInputs[`${step.id}-${opt.id}`] || ""}
                            onChange={(e) =>
                              setCustomInputs((p) => ({ ...p, [`${step.id}-${opt.id}`]: e.target.value }))
                            }
                            className="mt-2 h-8 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevStep}
                disabled={currentConfigStep === 0}
                className="gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <div className="flex gap-2">
                {currentConfigStep < totalSteps - 1 ? (
                  <Button size="sm" onClick={handleNextStep} className="gap-1">
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => setScheduleOpen(true)}>
                      <Calendar className="h-3.5 w-3.5" /> Save as recurring
                    </Button>
                    <Button size="sm" onClick={handleExecute} className="gap-1">
                      <Play className="h-3.5 w-3.5" /> Execute
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── EXECUTING PHASE ── */}
        {phase === "executing" && (
          <div className="space-y-6">
            <div className="border border-border/60 rounded-xl bg-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-semibold text-foreground">Executing...</span>
              </div>

              <div className="space-y-3">
                {useCase.executionSteps.map((step, i) => {
                  const isComplete = i <= completedExecSteps;
                  const isActive = i === activeExecStep;
                  const isPending = i > activeExecStep;

                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={cn(
                        "text-sm",
                        isComplete && "text-foreground",
                        isActive && "text-foreground font-medium",
                        isPending && "text-muted-foreground/50"
                      )}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-border/40">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Estimated completion: ~{Math.ceil(
                      useCase.executionSteps
                        .slice(activeExecStep)
                        .reduce((sum, s) => sum + s.duration, 0) / 1000
                    )}s remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── DONE PHASE ── */}
        {phase === "done" && (
          <div className="space-y-6">
            {/* Status banner */}
            <div className="border border-primary/20 rounded-xl bg-primary/5 p-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-foreground">DONE</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{useCase.result.destination}</p>

              {/* Result card */}
              <div className="border border-border/60 rounded-lg bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">{useCase.result.title}</h3>

                <div className="space-y-1">
                  {useCase.result.content.map((line, i) => (
                    <p key={i} className="text-sm text-muted-foreground">{line}</p>
                  ))}
                </div>

                {useCase.result.highlights.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1.5">Highlights:</p>
                    <ul className="space-y-1">
                      {useCase.result.highlights.map((h, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                {useCase.result.viewLink}
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => {
                setPhase("executing");
                setActiveExecStep(0);
                setCompletedExecSteps(-1);
              }}>
                <RefreshCw className="h-3.5 w-3.5" />
                Run Again
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setScheduleOpen(true)}>
                <Calendar className="h-3.5 w-3.5" />
                Schedule Weekly
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => {
                setPhase("configure");
                setCurrentConfigStep(0);
              }}>
                <Settings2 className="h-3.5 w-3.5" />
                Modify & Re-run
              </Button>
            </div>
          </div>
        )}
      </div>
      <ScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        useCaseName={useCase.name}
      />
    </MainLayout>
  );
};

export default UseCaseRun;
