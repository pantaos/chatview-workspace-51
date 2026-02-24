import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Play,
  Clock,
  Zap,
  MessageCircle,
  BarChart3,
  RefreshCw,
  Bell,
  ShieldCheck,
  BookOpen,
  Link2,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  Briefcase,
  Megaphone,
  DollarSign,
  Rocket,
  Mail,
  Target,
  Lightbulb,
  UserCheck,
  ClipboardList,
  PieChart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import ScheduleDialog from "@/components/ScheduleDialog";

const teams = ["All Teams", "Engineering", "Sales", "HR", "Finance", "Marketing"];

interface UseCase {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  saves: string;
  status: "ready";
  integrations: string[];
  team: string;
  taskType: string;
}

const allUseCases: UseCase[] = [
  // Engineering
  { id: "1", name: "Weekly Summary", icon: BarChart3, saves: "1 hr/week", status: "ready", integrations: ["GitHub", "Slack"], team: "Engineering", taskType: "Reporting" },
  { id: "2", name: "PR Review Alert", icon: Bell, saves: "30 min/day", status: "ready", integrations: ["GitHub", "Jira"], team: "Engineering", taskType: "Notifications" },
  { id: "3", name: "Standup Bot", icon: Users, saves: "15 min/day", status: "ready", integrations: ["Slack"], team: "Engineering", taskType: "Reporting" },
  // Sales
  { id: "10", name: "Deal Pipeline Report", icon: PieChart, saves: "2 hr/week", status: "ready", integrations: ["Salesforce", "Slack"], team: "Sales", taskType: "Reporting" },
  { id: "11", name: "Lead Score Digest", icon: Target, saves: "45 min/day", status: "ready", integrations: ["HubSpot", "Slack"], team: "Sales", taskType: "Notifications" },
  { id: "12", name: "Meeting Prep Brief", icon: Briefcase, saves: "20 min/mtg", status: "ready", integrations: ["Salesforce", "Calendar"], team: "Sales", taskType: "Research" },
  { id: "13", name: "CRM Data Sync", icon: RefreshCw, saves: "1 hr/day", status: "ready", integrations: ["Salesforce", "HubSpot"], team: "Sales", taskType: "Data Sync" },
  // HR
  { id: "20", name: "Onboarding Checklist", icon: ClipboardList, saves: "3 hr/hire", status: "ready", integrations: ["Slack", "Notion"], team: "HR", taskType: "Access Mgmt" },
  { id: "21", name: "PTO Balance Alert", icon: Calendar, saves: "30 min/week", status: "ready", integrations: ["BambooHR", "Slack"], team: "HR", taskType: "Notifications" },
  { id: "22", name: "Engagement Survey", icon: UserCheck, saves: "2 hr/month", status: "ready", integrations: ["Slack", "Google Forms"], team: "HR", taskType: "Research" },
  // Marketing
  { id: "30", name: "Campaign Performance", icon: TrendingUp, saves: "1.5 hr/week", status: "ready", integrations: ["Google Ads", "Slack"], team: "Marketing", taskType: "Reporting" },
  { id: "31", name: "Social Media Digest", icon: Megaphone, saves: "45 min/day", status: "ready", integrations: ["Buffer", "Slack"], team: "Marketing", taskType: "Notifications" },
  { id: "32", name: "Content Ideas Generator", icon: Lightbulb, saves: "1 hr/week", status: "ready", integrations: ["Google Trends", "Notion"], team: "Marketing", taskType: "Research" },
  { id: "33", name: "Email Drip Sync", icon: Mail, saves: "30 min/day", status: "ready", integrations: ["Mailchimp", "HubSpot"], team: "Marketing", taskType: "Data Sync" },
  // Finance
  { id: "40", name: "Expense Report Summary", icon: DollarSign, saves: "2 hr/week", status: "ready", integrations: ["QuickBooks", "Slack"], team: "Finance", taskType: "Reporting" },
  { id: "41", name: "Invoice Reminder", icon: Bell, saves: "1 hr/week", status: "ready", integrations: ["QuickBooks", "Email"], team: "Finance", taskType: "Notifications" },
];

const setupUseCases = [
  { id: "4", name: "Lead Enrichment", icon: TrendingUp, saves: "2 hr/day", needs: "Salesforce" },
  { id: "5", name: "Meeting Prep", icon: Calendar, saves: "30 min/mtg", needs: "Calendar" },
];

const teamBrowse = [
  { name: "Engineering", count: 3, icon: FileText },
  { name: "Sales", count: 4, icon: Briefcase },
  { name: "HR", count: 3, icon: Users },
  { name: "Finance", count: 2, icon: DollarSign },
  { name: "Marketing", count: 4, icon: Megaphone },
];

const taskTypes = [
  { name: "Reporting", icon: BarChart3 },
  { name: "Data Sync", icon: RefreshCw },
  { name: "Notifications", icon: Bell },
  { name: "Access Mgmt", icon: ShieldCheck },
  { name: "Research", icon: BookOpen },
];

const UseCases = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [activeTeamFilter, setActiveTeamFilter] = useState<string | null>(null);
  const [activeTaskFilter, setActiveTaskFilter] = useState<string | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<UseCase | null>(null);

  const filteredUseCases = useMemo(() => {
    let results = allUseCases;

    // Team dropdown
    if (selectedTeam !== "All Teams") {
      results = results.filter((uc) => uc.team === selectedTeam);
    }

    // Team chip filter
    if (activeTeamFilter) {
      results = results.filter((uc) => uc.team === activeTeamFilter);
    }

    // Task type chip filter
    if (activeTaskFilter) {
      results = results.filter((uc) => uc.taskType === activeTaskFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (uc) =>
          uc.name.toLowerCase().includes(q) ||
          uc.team.toLowerCase().includes(q) ||
          uc.taskType.toLowerCase().includes(q) ||
          uc.integrations.some((i) => i.toLowerCase().includes(q))
      );
    }

    return results;
  }, [selectedTeam, activeTeamFilter, activeTaskFilter, searchQuery]);

  const hasActiveFilter = activeTeamFilter || activeTaskFilter;

  const handleTeamChip = (name: string) => {
    setActiveTaskFilter(null);
    setActiveTeamFilter((prev) => (prev === name ? null : name));
  };

  const handleTaskChip = (name: string) => {
    setActiveTeamFilter(null);
    setActiveTaskFilter((prev) => (prev === name ? null : name));
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 md:px-8 pt-8 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Use Case Marketplace</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Discover and deploy pre-built automations for your team
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search use cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48 md:w-64 h-9"
                />
              </div>
              <Select value={selectedTeam} onValueChange={(v) => { setSelectedTeam(v); setActiveTeamFilter(null); setActiveTaskFilter(null); }}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 space-y-8 pb-12">
          {/* Recommended / Filtered Section */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {hasActiveFilter
                  ? `${activeTeamFilter || activeTaskFilter} Use Cases`
                  : "Recommended for you"}
              </h2>
              {hasActiveFilter && (
                <button
                  onClick={() => { setActiveTeamFilter(null); setActiveTaskFilter(null); }}
                  className="text-xs text-primary hover:underline ml-2"
                >
                  Clear filter
                </button>
              )}
            </div>
            {!hasActiveFilter && (
              <p className="text-xs text-muted-foreground mb-4">
                Based on your connected integrations
              </p>
            )}
            {hasActiveFilter && <div className="mb-4" />}

            {filteredUseCases.length === 0 ? (
              <div className="border border-border/60 rounded-xl p-8 bg-card text-center">
                <p className="text-sm text-muted-foreground">No use cases found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredUseCases.map((uc) => (
                  <div
                    key={uc.id}
                    className="border border-border/60 rounded-xl p-4 bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <uc.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{uc.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {uc.integrations.map((i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">{i}</Badge>
                          ))}
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">{uc.team}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Saves: {uc.saves}
                      </span>
                      <Badge variant="outline" className="text-[10px] border-primary/20 bg-primary/5 text-primary">
                        ✓ Ready to run
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => navigate(`/use-cases/run/${uc.id}`)}>
                        <Play className="h-3 w-3 mr-1" />
                        Run Now
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => setScheduleTarget(uc)}>
                        <Clock className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Browse by Team */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Browse by Team</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {teamBrowse.map((team) => (
                <button
                  key={team.name}
                  onClick={() => handleTeamChip(team.name)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors",
                    activeTeamFilter === team.name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-card hover:bg-muted/50"
                  )}
                >
                  <team.icon className={cn("h-4 w-4", activeTeamFilter === team.name ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm font-medium">{team.name}</span>
                  <span className={cn("text-xs", activeTeamFilter === team.name ? "text-primary/70" : "text-muted-foreground")}>{team.count}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Browse by Task Type */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Browse by Task Type</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {taskTypes.map((task) => (
                <button
                  key={task.name}
                  onClick={() => handleTaskChip(task.name)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors",
                    activeTaskFilter === task.name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-card hover:bg-muted/50"
                  )}
                >
                  <task.icon className={cn("h-3.5 w-3.5", activeTaskFilter === task.name ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm">{task.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Requires Setup */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Requires Setup</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Connect these to unlock more automations</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {setupUseCases.map((uc) => (
                <div key={uc.id} className="border border-border/60 rounded-xl p-4 bg-card border-dashed">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <uc.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{uc.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Saves: {uc.saves}</span>
                    <span className="flex items-center gap-1"><Link2 className="h-3 w-3" />Needs: {uc.needs}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                    <Link2 className="h-3 w-3 mr-1" />Connect {uc.needs}
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Or Just Ask */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Or Just Ask</h2>
            </div>
            <div className="border border-border/60 rounded-xl p-5 bg-card">
              <div className="bg-muted/50 rounded-lg px-4 py-3 mb-3">
                <p className="text-sm text-muted-foreground italic">"What else can you help me with?"</p>
              </div>
              <p className="text-xs text-muted-foreground">
                The marketplace shows common tasks, but PANTA can handle any request.
              </p>
            </div>
          </section>
        </div>
      </div>
      <ScheduleDialog
        open={!!scheduleTarget}
        onOpenChange={(open) => !open && setScheduleTarget(null)}
        useCaseName={scheduleTarget?.name || ""}
      />
    </MainLayout>
  );
};

export default UseCases;
