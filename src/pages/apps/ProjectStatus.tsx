import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Clock, AlertTriangle, CheckCircle2, Mail, FileText, Calendar,
  TrendingUp, Users, Sparkles, ArrowRight, Search, Zap, MessageSquare
} from "lucide-react";

const projects = [
  { id: "p1", name: "Sanierung Verwaltungsgebäude Rheinstr. 12", status: "kritisch", health: 45 },
  { id: "p2", name: "Neubau Logistikzentrum Hamm-Süd", status: "on-track", health: 82 },
  { id: "p3", name: "Umbau Produktionshalle 3 — BASF", status: "achtung", health: 68 },
];

const ProjectStatus = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const open = (id: string) => {
    setSelected(id);
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  const project = projects.find((p) => p.id === selected);

  return (
    <MainLayout mobileTitle="Projektstatus">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Zap className="h-4 w-4" />
            <span>PANTA Assistent</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Projektstatus in 30 Sekunden</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            PANTA analysiert E-Mails, Besprechungsnotizen und Projektdokumente und liefert die gesamte Lage auf einer Seite.
          </p>
        </div>

        {!selected && (
          <>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Projekt suchen…" />
            </div>
            <div className="space-y-3">
              {projects.map((p) => (
                <Card key={p.id} className="p-5 hover:shadow-md transition cursor-pointer" onClick={() => open(p.id)}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{p.name}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge
                          className={
                            p.status === "kritisch"
                              ? "bg-red-100 text-red-700 hover:bg-red-100"
                              : p.status === "achtung"
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                              : "bg-green-100 text-green-700 hover:bg-green-100"
                          }
                        >
                          {p.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Health Score {p.health}/100</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Status erzeugen <Sparkles className="ml-1.5 h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {selected && loading && (
          <Card className="p-10 text-center">
            <Sparkles className="h-8 w-8 mx-auto text-primary animate-pulse mb-3" />
            <h3 className="font-semibold">Projektlage wird zusammengestellt…</h3>
            <p className="text-sm text-muted-foreground mt-1">
              23 E-Mails · 4 Besprechungsnotizen · 11 Dokumente werden analysiert
            </p>
          </Card>
        )}

        {selected && !loading && project && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => setSelected(null)}>
                    ← Alle Projekte
                  </Button>
                  <h2 className="text-2xl font-semibold">{project.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Letztes Update: heute, 11:24 · Quellen: 23 E-Mails, 4 Notizen, 11 Dokumente
                  </p>
                </div>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-sm">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Eskalation empfohlen
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <Stat icon={TrendingUp} label="Fortschritt" value="62 %" />
                <Stat icon={Calendar} label="Verzug" value="+11 Tage" valueClass="text-red-600" />
                <Stat icon={Users} label="Team" value="9 Personen" />
                <Stat icon={Clock} label="Nächster Meilenstein" value="22.06.2026" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Executive Summary</h3>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                Das Projekt liegt aktuell <strong>11 Werktage hinter Plan</strong>, hauptsächlich verursacht durch die
                verspätete Statikfreigabe (KW 18) sowie offene Materialfreigaben des Bauherrn für die Fassade.
                Die Zusammenarbeit mit dem Generalunternehmer ist stabil, jedoch besteht erhöhtes Kostenrisiko bei den
                HLS-Gewerken (Mehraufwand ca. <strong>€ 84.000</strong> aus Nachträgen NR-07 und NR-09).
                Drei Entscheidungen warten seit über einer Woche auf den Bauherrn — eine Eskalation an die Projektleitung
                wird empfohlen.
              </p>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" /> Offene Punkte & Risiken
                </h3>
                <div className="space-y-3">
                  {[
                    { t: "Freigabe Fassadenmuster", who: "Bauherr", since: "9 Tage offen", crit: true },
                    { t: "Klärung Nachtrag NR-09 (Mehraufwand Lüftung)", who: "GU", since: "5 Tage offen", crit: true },
                    { t: "Brandschutzkonzept Revision 3", who: "Sachverständiger", since: "3 Tage offen", crit: false },
                    { t: "Bemusterung Bodenbeläge", who: "Architekt", since: "2 Tage offen", crit: false },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className={`h-2 w-2 rounded-full mt-2 ${r.crit ? "bg-red-500" : "bg-amber-500"}`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{r.t}</div>
                        <div className="text-xs text-muted-foreground">{r.who} · {r.since}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> Nächste Schritte
                </h3>
                <div className="space-y-3">
                  {[
                    "Termin mit Bauherrn zur Fassadenfreigabe diese Woche fixieren",
                    "Nachtrag NR-09 mit Kalkulation an Projektleitung übergeben",
                    "Sicherheitspuffer von 5 Werktagen mit GU verhandeln",
                    "Wöchentlicher Status-Call ab KW 22 etablieren",
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Auf welche Quellen basiert das?</h3>
              <div className="space-y-2">
                {[
                  { icon: Mail, text: "23 E-Mails (zuletzt: heute 09:47, K. Bauer)", sub: "Outlook" },
                  { icon: MessageSquare, text: "4 Besprechungsnotizen aus Teams-Meetings KW 19–21", sub: "MS Teams" },
                  { icon: FileText, text: "11 Dokumente aus SharePoint /Projekte/Rheinstr12", sub: "SharePoint" },
                ].map((q, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                      <q.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{q.text}</div>
                      <div className="text-xs text-muted-foreground">{q.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

const Stat = ({ icon: Icon, label, value, valueClass = "" }: any) => (
  <div>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="h-3 w-3" />{label}</div>
    <div className={`font-semibold mt-1 ${valueClass}`}>{value}</div>
  </div>
);

export default ProjectStatus;
