import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { getModules, Module } from "@/data/elearningData";
import { cn } from "@/lib/utils";

// Display percentages aligned with the mocked example
const DISPLAY_PROGRESS: Record<string, number> = {
  m1: 100,
  m2: 60,
  m3: 35,
  m4: 0,
  m5: 0,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusBadge(pct: number) {
  if (pct >= 100)
    return null;
  if (pct > 0)
    return <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-0">In Bearbeitung</Badge>;
  return <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted border-0">Nicht gestartet</Badge>;
}

function ProgressBar({ value }: { value: number }) {
  const color = value >= 100 ? "bg-emerald-500" : "bg-primary";
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

function DonutChart({ value }: { value: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-44 h-44">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="14" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold">{value}%</div>
        <div className="text-xs text-muted-foreground mt-0.5">Gesamtfortschritt</div>
      </div>
    </div>
  );
}

export default function ELearningDashboard() {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    setModules(getModules());
  }, []);

  const overall = useMemo(() => {
    if (modules.length === 0) return 0;
    const sum = modules.reduce((acc, m) => acc + (DISPLAY_PROGRESS[m.id] ?? 0), 0);
    return Math.round(sum / modules.length);
  }, [modules]);

  const upcoming = useMemo(
    () =>
      modules
        .filter((m) => new Date(m.scheduledAt).getTime() >= Date.now())
        .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))[0],
    [modules]
  );

  return (
    <MainLayout mobileTitle="LearnFlow">
      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">E-Learning Plattform</h1>
          <p className="text-muted-foreground mt-1.5">
            Lernen, vertiefen und Fortschritt tracken – alles an einem Ort.
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-transparent p-0 h-auto border-b w-full justify-start rounded-none gap-6">
            <TabsTrigger
              value="dashboard"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent px-0 pb-3 text-base font-medium"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="modules"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent px-0 pb-3 text-base font-medium"
            >
              Meine Module
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* Top 3 cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Nächste Session */}
              <div className="rounded-2xl bg-white border p-6 flex flex-col">
                <h3 className="font-semibold text-base mb-4">Nächste Session</h3>
                {upcoming ? (
                  <>
                    <div className="font-semibold">
                      Modul {upcoming.order}: {upcoming.title}
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(upcoming.scheduledAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        10:00 – 11:30 Uhr (CET)
                      </div>
                    </div>
                    <div className="mt-auto pt-6">
                      <Button asChild className="bg-[#5b5fc7] hover:bg-[#4f53b8] text-white">
                        <a href={upcoming.teamsLink} target="_blank" rel="noreferrer">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                            <path d="M20.5 9h-9A1.5 1.5 0 0 0 10 10.5v6A1.5 1.5 0 0 0 11.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 20.5 9zM7 8a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm1.5 1H3.75A1.75 1.75 0 0 0 2 10.75v5.5A1.75 1.75 0 0 0 3.75 18H8.5z" />
                          </svg>
                          Microsoft Teams öffnen
                        </a>
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Keine bevorstehende Session.</p>
                )}
              </div>

              {/* Overall Progress */}
              <div className="rounded-2xl bg-white border p-6 flex flex-col items-center">
                <h3 className="font-semibold text-base mb-4 self-start">Overall Progress</h3>
                <div className="flex-1 flex items-center justify-center">
                  <DonutChart value={overall} />
                </div>
              </div>

              {/* Modul Progress */}
              <div className="rounded-2xl bg-white border p-6">
                <h3 className="font-semibold text-base mb-4">Modul Progress</h3>
                <div className="space-y-3">
                  {modules.map((m) => {
                    const pct = DISPLAY_PROGRESS[m.id] ?? 0;
                    return (
                      <div key={m.id} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold",
                            pct >= 100
                              ? "bg-emerald-100 text-emerald-700"
                              : pct > 0
                              ? "bg-blue-50 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {m.order}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="text-sm font-medium truncate">
                              Modul {m.order}: {m.title}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ProgressBar value={pct} />
                            <span className="text-xs text-muted-foreground w-10 text-right shrink-0">{pct}%</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {pct >= 100 ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            statusBadge(pct)
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Meine Module table */}
            <ModulesTable modules={modules} onOpen={(id) => navigate(`/elearning/modules/${id}`)} />
          </TabsContent>

          <TabsContent value="modules" className="mt-6">
            <ModulesTable modules={modules} onOpen={(id) => navigate(`/elearning/modules/${id}`)} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function ModulesTable({ modules, onOpen }: { modules: Module[]; onOpen: (id: string) => void }) {
  return (
    <div className="rounded-2xl bg-white border overflow-hidden">
      <div className="p-6 pb-2">
        <h3 className="font-semibold text-base">Meine Module</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-muted-foreground border-b">
              <th className="px-6 py-3">Modul</th>
              <th className="px-4 py-3">Beschreibung</th>
              <th className="px-4 py-3">Nächste Session</th>
              <th className="px-4 py-3 w-[220px]">Fortschritt</th>
              <th className="px-4 py-3 w-[180px]">Aktionen</th>
              <th className="px-4 py-3 w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => {
              const pct = DISPLAY_PROGRESS[m.id] ?? 0;
              return (
                <tr key={m.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-7 w-7 rounded-md flex items-center justify-center text-xs font-semibold",
                          pct >= 100
                            ? "bg-emerald-100 text-emerald-700"
                            : pct > 0
                            ? "bg-blue-50 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {m.order}
                      </div>
                      <span className="font-medium">{m.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground max-w-xs">{m.description}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(m.scheduledAt)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      10:00 – 11:30 Uhr
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium">{pct}%</span>
                      {pct > 0 && pct < 100 && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-0 text-[10px]">
                          In Bearbeitung
                        </Badge>
                      )}
                      {pct === 0 && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted border-0 text-[10px]">
                          Nicht gestartet
                        </Badge>
                      )}
                    </div>
                    <ProgressBar value={pct} />
                  </td>
                  <td className="px-4 py-4">
                    <Button variant="outline" size="sm" onClick={() => onOpen(m.id)}>
                      Module öffnen
                    </Button>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
