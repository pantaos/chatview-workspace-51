import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Play,
  Clock,
  Zap,
  MessageCircle,
  ChevronDown,
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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";

// Mock data
const teams = ["All Teams", "Engineering", "Sales", "HR", "Finance", "Marketing"];

const recommendedUseCases = [
  {
    id: "1",
    name: "Weekly Summary",
    icon: BarChart3,
    saves: "1 hr/week",
    status: "ready" as const,
    integrations: ["GitHub", "Slack"],
  },
  {
    id: "2",
    name: "PR Review Alert",
    icon: Bell,
    saves: "30 min/day",
    status: "ready" as const,
    integrations: ["GitHub", "Jira"],
  },
  {
    id: "3",
    name: "Standup Bot",
    icon: Users,
    saves: "15 min/day",
    status: "ready" as const,
    integrations: ["Slack"],
  },
];

const setupUseCases = [
  {
    id: "4",
    name: "Lead Enrichment",
    icon: TrendingUp,
    saves: "2 hr/day",
    needs: "Salesforce",
  },
  {
    id: "5",
    name: "Meeting Prep",
    icon: Calendar,
    saves: "30 min/mtg",
    needs: "Calendar",
  },
];

const teamBrowse = [
  { name: "Engineering", count: 12, icon: FileText },
  { name: "Sales", count: 8, icon: Briefcase },
  { name: "HR", count: 6, icon: Users },
  { name: "Finance", count: 5, icon: DollarSign },
  { name: "Marketing", count: 7, icon: Megaphone },
];

const taskTypes = [
  { name: "Reporting", icon: BarChart3 },
  { name: "Data Sync", icon: RefreshCw },
  { name: "Notifications", icon: Bell },
  { name: "Access Mgmt", icon: ShieldCheck },
  { name: "Research", icon: BookOpen },
];

const UseCases = () => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All Teams");

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
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 space-y-8 pb-12">
          {/* Recommended Section */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Recommended for you
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Based on your connected integrations: GitHub, Slack, Jira
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendedUseCases.map((uc) => (
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
                          <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {i}
                          </Badge>
                        ))}
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
                    <Button size="sm" className="flex-1 h-8 text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Run Now
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Browse by Team */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Browse by Team
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {teamBrowse.map((team) => (
                <button
                  key={team.name}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border/60 rounded-xl bg-card hover:bg-muted/50 transition-colors"
                >
                  <team.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{team.name}</span>
                  <span className="text-xs text-muted-foreground">{team.count} uses</span>
                </button>
              ))}
            </div>
          </section>

          {/* Browse by Task Type */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Browse by Task Type
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {taskTypes.map((task) => (
                <button
                  key={task.name}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border/60 rounded-xl bg-card hover:bg-muted/50 transition-colors"
                >
                  <task.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{task.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Requires Setup */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Requires Setup
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Connect these to unlock more automations
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {setupUseCases.map((uc) => (
                <div
                  key={uc.id}
                  className="border border-border/60 rounded-xl p-4 bg-card border-dashed"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <uc.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{uc.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Saves: {uc.saves}
                    </span>
                    <span className="flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      Needs: {uc.needs}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                    <Link2 className="h-3 w-3 mr-1" />
                    Connect {uc.needs}
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Or Just Ask */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Or Just Ask
              </h2>
            </div>
            <div className="border border-border/60 rounded-xl p-5 bg-card">
              <div className="bg-muted/50 rounded-lg px-4 py-3 mb-3">
                <p className="text-sm text-muted-foreground italic">
                  "What else can you help me with?"
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                The marketplace shows common tasks, but PANTA can handle any request.
              </p>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default UseCases;
