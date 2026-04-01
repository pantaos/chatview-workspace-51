import { useState } from "react";
import {
  X, ChevronRight, ChevronLeft, Check, Sparkles,
  FileText, BarChart3, Mail, Users, Headphones,
  Calendar, Database, Globe, Shield, Zap,
  MessageSquare, PenTool, Search, ClipboardList, BookOpen,
  ArrowRight, Loader2, Upload, TrendingUp, DollarSign,
  UserCheck, Megaphone, Briefcase, HelpCircle, FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface WizardOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface AssistantCreatorWizardProps {
  open: boolean;
  onClose: () => void;
  onCreateAssistant: (data: {
    title: string;
    description: string;
    systemPrompt: string;
    starters: Array<{ displayText: string; fullPrompt: string }>;
    icon: string;
    tags: Array<{ id: string; name: string; color: string }>;
  }) => void;
}

// Step 1: Departments
const departments: WizardOption[] = [
  { id: "sales", label: "Sales", description: "Proposals, client communication, pipeline management, CRM maintenance", icon: <TrendingUp className="w-6 h-6" /> },
  { id: "marketing", label: "Marketing", description: "Campaigns, content creation, social media, analytics", icon: <Megaphone className="w-6 h-6" /> },
  { id: "finance", label: "Finance / Controlling", description: "Budgeting, reporting, invoicing, cost analysis", icon: <DollarSign className="w-6 h-6" /> },
  { id: "hr", label: "HR / People", description: "Recruiting, onboarding, employee management, internal communication", icon: <UserCheck className="w-6 h-6" /> },
  { id: "general", label: "General / Other", description: "Cross-functional or not assigned to a specific department", icon: <Briefcase className="w-6 h-6" /> },
];

// Step 2: Tasks per department
const tasksByDepartment: Record<string, WizardOption[]> = {
  sales: [
    { id: "proposal-creation", label: "Create proposals", description: "Assemble and draft proposal documents from client inquiries", icon: <FileText className="w-6 h-6" /> },
    { id: "lead-qualification", label: "Qualify leads", description: "Evaluate and prioritize incoming inquiries", icon: <Search className="w-6 h-6" /> },
    { id: "crm-maintenance", label: "Keep CRM up to date", description: "Maintain customer data, activities and pipeline status", icon: <Database className="w-6 h-6" /> },
    { id: "customer-followup", label: "Follow up with clients", description: "Prepare and send follow-ups after meetings or proposals", icon: <Mail className="w-6 h-6" /> },
    { id: "sales-reporting", label: "Create sales reports", description: "Weekly or monthly reports on revenue, pipeline and activities", icon: <BarChart3 className="w-6 h-6" /> },
  ],
  marketing: [
    { id: "campaign-content", label: "Write campaign copy", description: "Create email campaigns, landing pages and ad copy", icon: <PenTool className="w-6 h-6" /> },
    { id: "social-media-mgmt", label: "Manage social media", description: "Plan posts, write copy and create editorial calendars", icon: <Globe className="w-6 h-6" /> },
    { id: "market-research", label: "Conduct market research", description: "Analyze competitors, identify trends, understand target audiences", icon: <Search className="w-6 h-6" /> },
    { id: "event-planning", label: "Plan events and webinars", description: "Organize invitations, agendas and post-event follow-ups", icon: <Calendar className="w-6 h-6" /> },
    { id: "marketing-reporting", label: "Create performance reports", description: "Evaluate and present campaign results", icon: <BarChart3 className="w-6 h-6" /> },
  ],
  finance: [
    { id: "invoice-processing", label: "Process invoices", description: "Review, assign and prepare incoming invoices for approval", icon: <FileText className="w-6 h-6" /> },
    { id: "budget-planning", label: "Plan and monitor budgets", description: "Create cost plans, detect deviations and document them", icon: <BarChart3 className="w-6 h-6" /> },
    { id: "financial-reporting", label: "Create monthly/quarterly reports", description: "Compile and comment on financial KPIs", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "expense-management", label: "Travel expenses and reimbursements", description: "Review, categorize and approve expense claims", icon: <DollarSign className="w-6 h-6" /> },
    { id: "audit-preparation", label: "Prepare audit documentation", description: "Compile documents for internal or external audits", icon: <Shield className="w-6 h-6" /> },
  ],
  hr: [
    { id: "recruiting-support", label: "Process applications", description: "Write job postings, screen and evaluate applications", icon: <Users className="w-6 h-6" /> },
    { id: "onboarding-process", label: "Onboard new employees", description: "Create checklists, info packages and training plans", icon: <UserCheck className="w-6 h-6" /> },
    { id: "employee-communication", label: "Employee communication", description: "Write announcements, newsletters and internal updates", icon: <MessageSquare className="w-6 h-6" /> },
    { id: "contract-management", label: "Contracts and documents", description: "Prepare employment contracts, references and certificates", icon: <FileText className="w-6 h-6" /> },
    { id: "training-coordination", label: "Coordinate training", description: "Compile training offerings and organize participation", icon: <BookOpen className="w-6 h-6" /> },
  ],
  general: [
    { id: "email-management", label: "Write and reply to emails", description: "Draft professional emails quickly and accurately", icon: <Mail className="w-6 h-6" /> },
    { id: "meeting-support", label: "Prepare and follow up on meetings", description: "Create agendas, write minutes, extract action items", icon: <Calendar className="w-6 h-6" /> },
    { id: "document-creation", label: "Create documents and reports", description: "Write texts, summaries and presentations", icon: <FileText className="w-6 h-6" /> },
    { id: "information-gathering", label: "Gather information", description: "Conduct research and consolidate from various sources", icon: <Search className="w-6 h-6" /> },
    { id: "task-coordination", label: "Coordinate tasks", description: "Manage to-dos, set priorities, keep an overview", icon: <ClipboardList className="w-6 h-6" /> },
  ],
};

// Step 3: Pain Points per task
const painPointsByTask: Record<string, WizardOption[]> = {
  // Sales
  "proposal-creation": [
    { id: "manual-assembly", label: "I manually assemble proposals from many sources", description: "Price lists, templates, client data - everything needs to be gathered separately", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "inconsistent-quality", label: "Proposals look different every time", description: "No consistent format, varying quality depending on who writes them", icon: <FileText className="w-6 h-6" /> },
    { id: "slow-turnaround", label: "Proposal creation takes too long", description: "Clients wait for days because internal coordination eats up time", icon: <Zap className="w-6 h-6" /> },
    { id: "missing-info", label: "I often lack important information", description: "I have to ask colleagues before I can finalize a proposal", icon: <HelpCircle className="w-6 h-6" /> },
  ],
  "lead-qualification": [
    { id: "no-criteria", label: "I lack clear criteria for evaluation", description: "I don't know exactly which leads should be prioritized", icon: <HelpCircle className="w-6 h-6" /> },
    { id: "scattered-data", label: "Lead info is scattered across many tools", description: "Emails, CRM, LinkedIn - I have to look everywhere", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "time-consuming", label: "Researching each lead takes too long", description: "Manually compiling company info and contacts is very time-consuming", icon: <Zap className="w-6 h-6" /> },
  ],
  "crm-maintenance": [
    { id: "forgotten-updates", label: "I often forget to update the CRM", description: "After meetings or calls, documentation gets left behind", icon: <Database className="w-6 h-6" /> },
    { id: "duplicate-entries", label: "There are many duplicates and outdated data", description: "Data quality in the CRM is poor", icon: <Shield className="w-6 h-6" /> },
    { id: "manual-entry", label: "Data entry is pure busywork", description: "I keep typing the same information manually over and over", icon: <Zap className="w-6 h-6" /> },
  ],
  "customer-followup": [
    { id: "forget-followups", label: "I forget follow-ups or do them too late", description: "Without reminders, important follow-up actions fall through the cracks", icon: <Calendar className="w-6 h-6" /> },
    { id: "repetitive-texts", label: "I keep writing similar texts over and over", description: "Follow-up emails are similar, but I draft each one from scratch", icon: <PenTool className="w-6 h-6" /> },
    { id: "no-context", label: "I lack context from the last conversation", description: "I have to search through notes and emails to find what was discussed", icon: <Search className="w-6 h-6" /> },
  ],
  "sales-reporting": [
    { id: "data-collection", label: "Gathering data from different systems", description: "CRM, Excel, emails - the numbers are scattered everywhere", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "formatting-effort", label: "Reports need to be formatted every time", description: "A lot of time goes into layout and presentation", icon: <FileText className="w-6 h-6" /> },
    { id: "lack-of-insights", label: "I often lack the right metrics", description: "I'm not sure exactly which KPIs are relevant", icon: <BarChart3 className="w-6 h-6" /> },
  ],
  // Marketing
  "campaign-content": [
    { id: "writers-block", label: "I often can't think of the right words", description: "Getting started on new copy takes me a lot of time and energy", icon: <PenTool className="w-6 h-6" /> },
    { id: "brand-consistency", label: "Copy doesn't always match the brand voice", description: "Different writers produce different styles", icon: <Shield className="w-6 h-6" /> },
    { id: "repetitive-writing", label: "I keep writing similar texts over and over", description: "Creating variations for different channels is tedious", icon: <Zap className="w-6 h-6" /> },
  ],
  "social-media-mgmt": [
    { id: "content-ideas", label: "I'm running out of content ideas", description: "Delivering fresh content regularly is exhausting", icon: <HelpCircle className="w-6 h-6" /> },
    { id: "platform-adaptation", label: "Each platform needs different content", description: "LinkedIn, Instagram, Twitter - different formats and tones everywhere", icon: <Globe className="w-6 h-6" /> },
    { id: "scheduling-chaos", label: "The editorial calendar is chaotic", description: "Posts are created ad-hoc instead of being strategically planned", icon: <Calendar className="w-6 h-6" /> },
  ],
  "market-research": [
    { id: "info-overload", label: "Too many sources, not enough structure", description: "Information is everywhere, but I lose track", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "outdated-data", label: "My market data is often outdated", description: "It's hard to always have current information", icon: <Database className="w-6 h-6" /> },
    { id: "analysis-paralysis", label: "I don't know where to start", description: "The amount of information overwhelms me", icon: <HelpCircle className="w-6 h-6" /> },
  ],
  "event-planning": [
    { id: "coordination-overhead", label: "Coordinating with all stakeholders is time-consuming", description: "Many emails and back-and-forth until everything is set", icon: <Users className="w-6 h-6" /> },
    { id: "template-missing", label: "I create everything from scratch every time", description: "No reusable templates for invitations and agendas", icon: <FileText className="w-6 h-6" /> },
    { id: "followup-forgotten", label: "Post-event follow-up often falls through", description: "Collecting feedback and documenting results gets forgotten", icon: <ClipboardList className="w-6 h-6" /> },
  ],
  "marketing-reporting": [
    { id: "data-collection", label: "Gathering data from different tools", description: "Google Analytics, social media, email tool - all separate", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "visualization-effort", label: "Preparing reports takes too much time", description: "Turning raw data into appealing charts and reports is tedious", icon: <BarChart3 className="w-6 h-6" /> },
    { id: "no-actionable-insights", label: "Reports rarely lead to concrete actions", description: "Numbers are there, but actionable recommendations are missing", icon: <Zap className="w-6 h-6" /> },
  ],
  // Finance
  "invoice-processing": [
    { id: "manual-checking", label: "Every invoice needs to be manually checked", description: "Amounts, account assignments and approvals checked one by one", icon: <Shield className="w-6 h-6" /> },
    { id: "lost-invoices", label: "Invoices get lost in the email flood", description: "Without a clear process, invoices are processed too late", icon: <Mail className="w-6 h-6" /> },
    { id: "approval-delays", label: "Approvals take too long", description: "Responsible people don't respond in time", icon: <Zap className="w-6 h-6" /> },
  ],
  "budget-planning": [
    { id: "scattered-data", label: "Budget data is in different spreadsheets", description: "No central overview of all cost centers", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "version-chaos", label: "Many versions, no overview", description: "Different Excel files with different statuses", icon: <FileText className="w-6 h-6" /> },
    { id: "deviation-detection", label: "Deviations are detected too late", description: "Budget overruns only show up at month-end", icon: <BarChart3 className="w-6 h-6" /> },
  ],
  "financial-reporting": [
    { id: "data-collection", label: "Consolidating data from ERP and accounting", description: "Manual consolidation from different systems", icon: <Database className="w-6 h-6" /> },
    { id: "formatting-effort", label: "Reports need to look the same every time", description: "A lot of time spent on formatting and standardization", icon: <FileText className="w-6 h-6" /> },
    { id: "commentary-writing", label: "Writing commentary on numbers is time-consuming", description: "Every deviation needs to be explained and assessed", icon: <PenTool className="w-6 h-6" /> },
  ],
  "expense-management": [
    { id: "receipt-chaos", label: "Receipts get lost or are incomplete", description: "Employees submit receipts too late or incorrectly", icon: <FileText className="w-6 h-6" /> },
    { id: "policy-checking", label: "Manually checking policy compliance", description: "Every claim checked individually against travel policies", icon: <Shield className="w-6 h-6" /> },
    { id: "categorization", label: "Expenses need to be manually categorized", description: "Assigning cost center, project and category is tedious", icon: <ClipboardList className="w-6 h-6" /> },
  ],
  "audit-preparation": [
    { id: "document-search", label: "Gathering documents takes days", description: "Documents are in different folders and systems", icon: <Search className="w-6 h-6" /> },
    { id: "completeness-check", label: "I'm unsure if everything is complete", description: "No clear checklist of what the auditor needs", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "last-minute-prep", label: "Preparation always happens at the last minute", description: "No ongoing documentation, everything is gathered shortly before", icon: <Zap className="w-6 h-6" /> },
  ],
  // HR
  "recruiting-support": [
    { id: "job-posting-effort", label: "Writing job postings takes a long time", description: "Every position needs its own appealing text", icon: <PenTool className="w-6 h-6" /> },
    { id: "screening-volume", label: "Too many applications, too little time", description: "Screening and comparing hundreds of applications is overwhelming", icon: <Users className="w-6 h-6" /> },
    { id: "candidate-communication", label: "Communicating with candidates is tedious", description: "Acceptances, rejections, scheduling - many individual messages", icon: <Mail className="w-6 h-6" /> },
  ],
  "onboarding-process": [
    { id: "checklist-tracking", label: "Onboarding checklists aren't consistently followed", description: "Steps get forgotten or done in the wrong order", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "info-package", label: "Every new employee asks the same questions", description: "No central knowledge source for new colleagues", icon: <BookOpen className="w-6 h-6" /> },
    { id: "stakeholder-coordination", label: "Coordination between IT, HR and department is complex", description: "Many stakeholders need to be coordinated", icon: <Users className="w-6 h-6" /> },
  ],
  "employee-communication": [
    { id: "repetitive-messages", label: "I keep writing similar messages over and over", description: "Birthdays, anniversaries, policy updates - similar texts", icon: <PenTool className="w-6 h-6" /> },
    { id: "tone-consistency", label: "The tone should be professional yet approachable", description: "Finding the right balance is difficult", icon: <MessageSquare className="w-6 h-6" /> },
    { id: "reach-all", label: "Not all employees are reached", description: "Important info gets lost in the email flood", icon: <Mail className="w-6 h-6" /> },
  ],
  "contract-management": [
    { id: "template-outdated", label: "Templates are outdated or hard to find", description: "Different versions circulate across the company", icon: <FileText className="w-6 h-6" /> },
    { id: "individual-adjustments", label: "Every contract needs individual adjustments", description: "Standard templates need to be manually modified each time", icon: <PenTool className="w-6 h-6" /> },
    { id: "deadline-tracking", label: "Deadlines are missed", description: "Probation periods, contract renewals and notice periods", icon: <Calendar className="w-6 h-6" /> },
  ],
  "training-coordination": [
    { id: "overview-missing", label: "No overview of training needs", description: "Who needs which training? That's unclear", icon: <HelpCircle className="w-6 h-6" /> },
    { id: "booking-management", label: "Registration and scheduling is time-consuming", description: "Many emails and back-and-forth for each training session", icon: <Calendar className="w-6 h-6" /> },
    { id: "documentation-gap", label: "Training records are missing", description: "Attendance is not systematically documented", icon: <ClipboardList className="w-6 h-6" /> },
  ],
  // General
  "email-management": [
    { id: "repetitive-texts", label: "I keep writing similar texts over and over", description: "Standard replies and phrasings repeat constantly", icon: <PenTool className="w-6 h-6" /> },
    { id: "time-consuming", label: "Emails take too much of my day", description: "I spend hours drafting messages", icon: <Zap className="w-6 h-6" /> },
    { id: "tone-difficulty", label: "Finding the right tone is difficult", description: "Formal, friendly, assertive - different depending on the recipient", icon: <MessageSquare className="w-6 h-6" /> },
  ],
  "meeting-support": [
    { id: "no-agenda", label: "Meetings often lack a clear agenda", description: "Without structure, meetings become inefficient", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "protocol-forgotten", label: "Minutes are rarely written", description: "Results and tasks are lost after the meeting", icon: <FileText className="w-6 h-6" /> },
    { id: "action-items-lost", label: "Action items aren't tracked", description: "Agreed tasks are forgotten", icon: <ClipboardList className="w-6 h-6" /> },
  ],
  "document-creation": [
    { id: "blank-page", label: "Getting started is always the hardest part", description: "Sitting in front of a blank document, not knowing how to begin", icon: <PenTool className="w-6 h-6" /> },
    { id: "structure-unclear", label: "I don't know how to structure the text", description: "Outlining and organizing takes a lot of thought", icon: <FileText className="w-6 h-6" /> },
    { id: "version-management", label: "Many versions, no overview", description: "Document_v2_final_FINAL.docx - which one is current?", icon: <FolderOpen className="w-6 h-6" /> },
  ],
  "information-gathering": [
    { id: "scattered-sources", label: "Information is spread across many different tools", description: "SharePoint, emails, Teams, CRM - I have to search everywhere", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "time-wasted", label: "I spend more time searching than actually working", description: "Research often takes longer than the actual task", icon: <Zap className="w-6 h-6" /> },
    { id: "outdated-info", label: "I'm never sure if the information is current", description: "Outdated documents and contradictory information", icon: <HelpCircle className="w-6 h-6" /> },
  ],
  "task-coordination": [
    { id: "lost-overview", label: "I lose track of my tasks", description: "To-dos in emails, notes, Teams - nothing is centralized", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "priority-unclear", label: "I struggle to set priorities", description: "Everything seems urgent, but I don't know what comes first", icon: <HelpCircle className="w-6 h-6" /> },
    { id: "delegation-hard", label: "Delegating tasks is cumbersome", description: "Clearly formulating assignments and tracking them takes time", icon: <Users className="w-6 h-6" /> },
  ],
};

// Step 4: Concretization suggestions based on pain points
interface ConcretizationSuggestion {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  type: "integration" | "knowledge" | "feature";
}

const getConcretizationSuggestions = (
  department: string,
  task: string,
  painPoints: string[]
): ConcretizationSuggestion[] => {
  const suggestions: ConcretizationSuggestion[] = [];

  const needsEmailAccess = painPoints.some(p =>
    ["repetitive-texts", "customer-followup", "candidate-communication", "reach-all",
     "lost-invoices", "forget-followups", "repetitive-messages", "time-consuming",
     "tone-difficulty"].includes(p)
  );
  const needsDocumentAccess = painPoints.some(p =>
    ["manual-assembly", "scattered-data", "document-search", "template-outdated",
     "info-package", "scattered-sources", "version-management", "version-chaos",
     "template-missing", "blank-page", "data-collection"].includes(p)
  );
  const needsCalendarAccess = painPoints.some(p =>
    ["forget-followups", "coordination-overhead", "booking-management", "deadline-tracking",
     "scheduling-chaos", "no-agenda", "followup-forgotten"].includes(p)
  );
  const needsTeamsAccess = painPoints.some(p =>
    ["stakeholder-coordination", "coordination-overhead", "action-items-lost",
     "protocol-forgotten", "reach-all"].includes(p)
  );
  const needsCrmAccess = ["sales"].includes(department) || painPoints.some(p =>
    ["crm-maintenance", "forgotten-updates", "scattered-data", "no-context",
     "duplicate-entries", "manual-entry"].includes(p)
  );

  if (needsEmailAccess) {
    suggestions.push({
      id: "outlook", label: "Connect Microsoft Outlook",
      description: "Read, compose and automatically process emails",
      icon: <Mail className="w-6 h-6" />, type: "integration"
    });
  }
  if (needsDocumentAccess) {
    suggestions.push({
      id: "sharepoint", label: "Connect SharePoint / OneDrive",
      description: "Access documents, templates and files",
      icon: <Database className="w-6 h-6" />, type: "integration"
    });
  }
  if (needsCalendarAccess) {
    suggestions.push({
      id: "calendar", label: "Connect Calendar",
      description: "View appointments, set reminders, check availability",
      icon: <Calendar className="w-6 h-6" />, type: "integration"
    });
  }
  if (needsTeamsAccess) {
    suggestions.push({
      id: "teams", label: "Connect Microsoft Teams",
      description: "Use chat messages and meeting information",
      icon: <MessageSquare className="w-6 h-6" />, type: "integration"
    });
  }
  if (needsCrmAccess) {
    suggestions.push({
      id: "crm", label: "Connect CRM system",
      description: "Use customer data, pipeline and sales activities",
      icon: <Users className="w-6 h-6" />, type: "integration"
    });
  }

  const needsTemplates = painPoints.some(p =>
    ["inconsistent-quality", "template-outdated", "template-missing", "brand-consistency",
     "individual-adjustments", "formatting-effort", "blank-page", "structure-unclear",
     "repetitive-writing", "repetitive-texts", "repetitive-messages"].includes(p)
  );
  const needsGuidelines = painPoints.some(p =>
    ["no-criteria", "policy-checking", "completeness-check", "overview-missing",
     "no-actionable-insights", "priority-unclear", "tone-consistency", "tone-difficulty"].includes(p)
  );

  if (needsTemplates) {
    suggestions.push({
      id: "templates", label: "Upload templates to Knowledge Base",
      description: "Upload existing templates so the assistant can use them as a basis",
      icon: <Upload className="w-6 h-6" />, type: "knowledge"
    });
  }
  if (needsGuidelines) {
    suggestions.push({
      id: "guidelines", label: "Upload guidelines and policies",
      description: "Provide internal guidelines so the assistant follows them",
      icon: <BookOpen className="w-6 h-6" />, type: "knowledge"
    });
  }

  if (!needsTemplates && !needsGuidelines) {
    suggestions.push({
      id: "knowledge-general", label: "Use own documents as knowledge base",
      description: "Upload PDFs, Word files or other documents the assistant should know about",
      icon: <Upload className="w-6 h-6" />, type: "knowledge"
    });
  }

  suggestions.push({
    id: "no-extras", label: "No additional connections needed",
    description: "The assistant should work independently without external tools",
    icon: <Shield className="w-6 h-6" />, type: "feature"
  });

  return suggestions;
};

// ---- Config generation ----

function generateAssistantConfig(
  department: string,
  task: string,
  painPoints: string[],
  concretizations: string[],
  freeTextTask: string,
  freeTextPain: string
) {
  const deptLabels: Record<string, string> = {
    sales: "Sales", marketing: "Marketing", finance: "Finance",
    hr: "HR", general: "General"
  };

  const taskOptions = tasksByDepartment[department] || [];
  const taskLabel = taskOptions.find(t => t.id === task)?.label || freeTextTask || "General task";
  const taskDesc = taskOptions.find(t => t.id === task)?.description || freeTextTask || "";

  const title = `${taskLabel} Assistant`;
  const description = `Supports ${deptLabels[department] || "General"}: ${taskDesc}`;

  const allPainOptions = painPointsByTask[task] || [];
  const selectedPainLabels = allPainOptions
    .filter(p => painPoints.includes(p.id))
    .map(p => p.label);
  if (freeTextPain) selectedPainLabels.push(freeTextPain);

  const integrationIds = ["outlook", "sharepoint", "calendar", "teams", "crm"];
  const selectedIntegrations = concretizations.filter(c => integrationIds.includes(c));
  const wantsKnowledge = concretizations.some(c => ["templates", "guidelines", "knowledge-general"].includes(c));

  const integrationDescriptions: Record<string, string> = {
    outlook: "You have access to Microsoft Outlook. You can read, compose and organize emails.",
    sharepoint: "You have access to SharePoint and OneDrive. You can search, read and use documents as templates.",
    calendar: "You have access to the calendar. You can view appointments, suggest reminders and check availability.",
    teams: "You have access to Microsoft Teams. You can send chat messages and retrieve meeting information.",
    crm: "You have access to the CRM system. You can view customer data and support sales processes.",
  };

  const systemPrompt = [
    `You are a specialized AI assistant for the ${deptLabels[department] || "General"} department.`,
    `Your main task: ${taskLabel} - ${taskDesc}.`,
    "",
    "The user has described the following specific challenges that you should address:",
    ...selectedPainLabels.map(p => `- ${p}`),
    "",
    selectedIntegrations.length > 0
      ? "Available integrations:\n" + selectedIntegrations.map(i => integrationDescriptions[i]).join("\n")
      : "",
    "",
    wantsKnowledge
      ? "The user has uploaded documents to the Knowledge Base. Use these as reference for templates, guidelines and information. Actively refer to them when relevant."
      : "",
    "",
    "Important rules:",
    "- Always respond in the same language the user writes in.",
    "- Ask for clarification when you lack important information, rather than making assumptions.",
    "- Follow company guidelines and treat all information confidentially.",
    "- If you are unsure about something, communicate that transparently.",
    "- Formulate answers that are directly usable - no generic boilerplate.",
    "- Consider the user's specific context and department.",
  ].filter(Boolean).join("\n");

  const starterTemplates: Record<string, Array<{ displayText: string; fullPrompt: string }>> = {
    "proposal-creation": [
      { displayText: "Create proposal from client inquiry", fullPrompt: "I received a client inquiry and want to create a proposal from it. Please ask me for the details of the inquiry." },
      { displayText: "Adapt an existing proposal", fullPrompt: "I want to adapt an existing proposal for a new client. Help me with that." },
      { displayText: "Improve proposal copy", fullPrompt: "I have a draft proposal and want to make the text more professional and persuasive." },
    ],
    "lead-qualification": [
      { displayText: "Evaluate a new lead", fullPrompt: "I received a new lead. Help me systematically qualify it." },
      { displayText: "Research a lead", fullPrompt: "I need background information on a potential client. Please ask me about the company." },
    ],
    "campaign-content": [
      { displayText: "Create campaign copy", fullPrompt: "I need copy for a marketing campaign. Please ask me about the target audience, channel and message." },
      { displayText: "Draft an email campaign", fullPrompt: "I want to create an email campaign. Help me with the subject line and content." },
      { displayText: "Create text variations", fullPrompt: "I have a text and need variations for different channels." },
    ],
    "recruiting-support": [
      { displayText: "Write a job posting", fullPrompt: "I want to write an appealing job posting. Please ask me about the position and requirements." },
      { displayText: "Evaluate an application", fullPrompt: "I want to evaluate an application. I'll show you the documents." },
      { displayText: "Draft a rejection letter", fullPrompt: "I need a respectful rejection for a candidate." },
    ],
    "email-management": [
      { displayText: "Create email from bullet points", fullPrompt: "I have bullet points and want to turn them into a professional email. Please ask me for the details." },
      { displayText: "Reply to an email", fullPrompt: "I received an email and want to reply professionally." },
      { displayText: "Create an email template", fullPrompt: "I need a reusable email template for a specific occasion." },
    ],
    "meeting-support": [
      { displayText: "Create meeting agenda", fullPrompt: "I need a structured agenda. Please ask me about the topic and participants." },
      { displayText: "Write meeting minutes", fullPrompt: "I have notes from a meeting and want to create structured minutes." },
      { displayText: "Extract action items", fullPrompt: "Help me extract specific tasks with owners and deadlines from my meeting notes." },
    ],
  };

  const defaultStarters = [
    { displayText: "How can you help me?", fullPrompt: "Briefly explain what you can do for me and how I can best work with you." },
    { displayText: "Start a new task", fullPrompt: "I have a new task for you. Please ask me what exactly I need." },
    { displayText: "Use a template", fullPrompt: "I want to use an existing template as a starting point. Help me customize it." },
  ];

  const starters = starterTemplates[task] || defaultStarters;

  const iconMap: Record<string, string> = {
    sales: "TrendingUp", marketing: "Megaphone", finance: "DollarSign",
    hr: "UserCheck", general: "Briefcase"
  };

  const tagMap: Record<string, { id: string; name: string; color: string }> = {
    sales: { id: "sales", name: "Sales", color: "#10B981" },
    marketing: { id: "marketing", name: "Marketing", color: "#8B5CF6" },
    finance: { id: "finance", name: "Finance", color: "#3B82F6" },
    hr: { id: "hr", name: "HR", color: "#F59E0B" },
    general: { id: "general", name: "General", color: "#6B7280" },
  };

  return {
    title,
    description,
    systemPrompt,
    starters,
    icon: iconMap[department] || "MessageSquare",
    tags: [tagMap[department] || { id: "general", name: "General", color: "#6B7280" }],
  };
}

// ---- Component ----

const STEPS = ["department", "task", "painpoints", "concretization"] as const;
type StepId = typeof STEPS[number];

const stepTitles: Record<StepId, { title: string; subtitle: string }> = {
  department: {
    title: "Which department do you work in?",
    subtitle: "This helps us give you the most relevant suggestions.",
  },
  task: {
    title: "Which task would you like to simplify?",
    subtitle: "Choose the task that costs you the most time - or describe it yourself.",
  },
  painpoints: {
    title: "What exactly makes this task difficult?",
    subtitle: "The more precisely you describe the pain, the better the assistant can help.",
  },
  concretization: {
    title: "What would help you the most?",
    subtitle: "We suggest relevant integrations and resources based on your input.",
  },
};

const AssistantCreatorWizard = ({ open, onClose, onCreateAssistant }: AssistantCreatorWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [department, setDepartment] = useState<string>("");
  const [task, setTask] = useState<string>("");
  const [freeTextTask, setFreeTextTask] = useState("");
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [freeTextPain, setFreeTextPain] = useState("");
  const [concretizations, setConcretizations] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationComplete, setCreationComplete] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<ReturnType<typeof generateAssistantConfig> | null>(null);
  const [showFreeText, setShowFreeText] = useState(false);
  const [showFreeTextPain, setShowFreeTextPain] = useState(false);

  if (!open) return null;

  const stepId = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const progress = ((currentStep + 1) / (totalSteps + 1)) * 100;

  const handleDepartmentSelect = (id: string) => {
    setDepartment(id);
    setTask("");
    setFreeTextTask("");
    setPainPoints([]);
    setFreeTextPain("");
    setConcretizations([]);
    setShowFreeText(false);
    setShowFreeTextPain(false);
    setTimeout(() => setCurrentStep(1), 300);
  };

  const handleTaskSelect = (id: string) => {
    setTask(id);
    setShowFreeText(false);
    setPainPoints([]);
    setFreeTextPain("");
    setConcretizations([]);
    setShowFreeTextPain(false);
    setTimeout(() => setCurrentStep(2), 300);
  };

  const handleTaskFreeText = () => {
    if (freeTextTask.trim()) {
      setTask("custom");
      setTimeout(() => setCurrentStep(2), 300);
    }
  };

  const handlePainPointToggle = (id: string) => {
    setPainPoints(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleConcretizationToggle = (id: string) => {
    if (id === "no-extras") {
      setConcretizations(["no-extras"]);
    } else {
      setConcretizations(prev => {
        const filtered = prev.filter(c => c !== "no-extras");
        return filtered.includes(id) ? filtered.filter(c => c !== id) : [...filtered, id];
      });
    }
  };

  const canProceedPainPoints = painPoints.length > 0 || freeTextPain.trim().length > 0;
  const canProceedConcretization = concretizations.length > 0;

  const handleCreate = async () => {
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const config = generateAssistantConfig(department, task, painPoints, concretizations, freeTextTask, freeTextPain);
    setGeneratedConfig(config);
    setIsCreating(false);
    setCreationComplete(true);
  };

  const handleConfirm = () => {
    if (generatedConfig) {
      onCreateAssistant(generatedConfig);
      toast.success(`"${generatedConfig.title}" was created successfully`);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setDepartment("");
    setTask("");
    setFreeTextTask("");
    setPainPoints([]);
    setFreeTextPain("");
    setConcretizations([]);
    setIsCreating(false);
    setCreationComplete(false);
    setGeneratedConfig(null);
    setShowFreeText(false);
    setShowFreeTextPain(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Creating screen
  if (isCreating) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Creating your assistant</h2>
            <p className="text-muted-foreground">Based on your input, the optimal assistant is being configured...</p>
          </div>
          <Progress value={66} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  // Success screen
  if (creationComplete && generatedConfig) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-auto">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <button onClick={handleClose} className="absolute top-6 right-6 p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Your assistant is ready</h2>
            <p className="text-muted-foreground">Here's a preview of your new assistant.</p>
          </div>

          <Card className="p-6 mb-6 border-2 border-primary/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{generatedConfig.title}</h3>
                <p className="text-sm text-muted-foreground">{generatedConfig.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {generatedConfig.tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {concretizations.filter(c => !["no-extras", "templates", "guidelines", "knowledge-general"].includes(c)).map(c => (
                <Badge key={c} variant="outline" className="text-xs">
                  {c === "outlook" ? "Outlook" : c === "sharepoint" ? "SharePoint" : c === "calendar" ? "Calendar" : c === "teams" ? "Teams" : c === "crm" ? "CRM" : c}
                </Badge>
              ))}
              {concretizations.some(c => ["templates", "guidelines", "knowledge-general"].includes(c)) && (
                <Badge variant="outline" className="text-xs">Knowledge Base</Badge>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Quick-start actions:</p>
              {generatedConfig.starters.map((starter, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer">
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{starter.displayText}</span>
                </div>
              ))}
            </div>
          </Card>

          <details className="mb-8">
            <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              Show system prompt
            </summary>
            <Card className="mt-3 p-4">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {generatedConfig.systemPrompt}
              </pre>
            </Card>
          </details>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Start over
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Create assistant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render options for current step
  const renderStepContent = () => {
    switch (stepId) {
      case "department":
        return (
          <div className="space-y-3">
            {departments.map(option => (
              <button
                key={option.id}
                onClick={() => handleDepartmentSelect(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                  department === option.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  department === option.id ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        );

      case "task": {
        const tasks = tasksByDepartment[department] || [];
        return (
          <div className="space-y-3">
            {tasks.map(option => (
              <button
                key={option.id}
                onClick={() => handleTaskSelect(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                  task === option.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  task === option.id ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{option.description}</div>
                </div>
              </button>
            ))}

            {/* Free text option */}
            {!showFreeText ? (
              <button
                onClick={() => setShowFreeText(true)}
                className="w-full text-left p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/50 transition-all duration-200 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent text-muted-foreground">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">Describe a different task</div>
                  <div className="text-sm text-muted-foreground mt-0.5">Your task isn't listed? Describe it in your own words.</div>
                </div>
              </button>
            ) : (
              <div className="p-5 rounded-xl border-2 border-primary/40 bg-primary/5 space-y-3">
                <Textarea
                  value={freeTextTask}
                  onChange={(e) => setFreeTextTask(e.target.value)}
                  placeholder="Describe the task you want the assistant to help with..."
                  className="min-h-[80px] bg-background"
                  autoFocus
                />
                <Button onClick={handleTaskFreeText} disabled={!freeTextTask.trim()} size="sm">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        );
      }

      case "painpoints": {
        const painOptions = task !== "custom" ? (painPointsByTask[task] || []) : [];
        return (
          <div className="space-y-3">
            {painOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handlePainPointToggle(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                  painPoints.includes(option.id)
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  painPoints.includes(option.id) ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{option.description}</div>
                </div>
                {painPoints.includes(option.id) && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}

            {/* Free text pain */}
            {!showFreeTextPain ? (
              <button
                onClick={() => setShowFreeTextPain(true)}
                className="w-full text-left p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/50 transition-all duration-200 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent text-muted-foreground">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">Describe your own challenge</div>
                  <div className="text-sm text-muted-foreground mt-0.5">Your problem isn't listed? Describe it in your own words.</div>
                </div>
              </button>
            ) : (
              <div className="p-5 rounded-xl border-2 border-primary/40 bg-primary/5 space-y-3">
                <Textarea
                  value={freeTextPain}
                  onChange={(e) => setFreeTextPain(e.target.value)}
                  placeholder="What exactly makes this task difficult for you?"
                  className="min-h-[80px] bg-background"
                  autoFocus
                />
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={!canProceedPainPoints}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }

      case "concretization": {
        const suggestions = getConcretizationSuggestions(department, task, painPoints);
        const integrationSuggestions = suggestions.filter(s => s.type === "integration");
        const knowledgeSuggestions = suggestions.filter(s => s.type === "knowledge");
        const otherSuggestions = suggestions.filter(s => s.type === "feature");

        return (
          <div className="space-y-6">
            {integrationSuggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Recommended Integrations</p>
                <div className="space-y-3">
                  {integrationSuggestions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleConcretizationToggle(s.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                        concretizations.includes(s.id)
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-accent/50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        concretizations.includes(s.id) ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                      }`}>
                        {s.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{s.label}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">{s.description}</div>
                      </div>
                      {concretizations.includes(s.id) && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {knowledgeSuggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Knowledge Base</p>
                <div className="space-y-3">
                  {knowledgeSuggestions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleConcretizationToggle(s.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                        concretizations.includes(s.id)
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-accent/50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        concretizations.includes(s.id) ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                      }`}>
                        {s.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{s.label}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">{s.description}</div>
                      </div>
                      {concretizations.includes(s.id) && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {otherSuggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleConcretizationToggle(s.id)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                    concretizations.includes(s.id)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-accent/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    concretizations.includes(s.id) ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                  }`}>
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{s.label}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{s.description}</div>
                  </div>
                  {concretizations.includes(s.id) && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleCreate}
                disabled={!canProceedConcretization}
              >
                Create assistant
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }
    }
  };

  const { title, subtitle } = stepTitles[stepId];

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button onClick={handleBack} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {totalSteps}</span>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <Progress value={progress} className="mb-10 h-1" />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
};

export default AssistantCreatorWizard;
