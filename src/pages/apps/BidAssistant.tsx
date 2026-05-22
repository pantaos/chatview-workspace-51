import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText, Upload, CheckCircle2, AlertCircle, Clock, FolderOpen,
  Sparkles, MessageSquareWarning, FileCheck2, Calendar, Euro, Building2, ArrowRight
} from "lucide-react";

type Phase = "upload" | "analyzing" | "result";

const BidAssistant = () => {
  const [phase, setPhase] = useState<Phase>("upload");
  const [progress, setProgress] = useState(0);

  const startAnalysis = () => {
    setPhase("analyzing");
    setProgress(0);
    const steps = [15, 35, 55, 75, 92, 100];
    let i = 0;
    const interval = setInterval(() => {
      setProgress(steps[i]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("result"), 400);
      }
    }, 600);
  };

  const analysisSteps = [
    "Dokument wird gelesen (47 Seiten)",
    "Anforderungen & Leistungspositionen extrahiert",
    "Fristen, Nachweise & Eignungskriterien erkannt",
    "Ähnliche Projekte im Archiv durchsucht",
    "Angebotsbausteine aus 12 Vorgängerprojekten zusammengestellt",
    "Angebotsentwurf vorbereitet",
  ];

  return (
    <MainLayout mobileTitle="Ausschreibungs-Assistent">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Sparkles className="h-4 w-4" />
            <span>PANTA Assistent</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Ausschreibungs- & Angebotsassistent</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Ausschreibung hochladen — Anforderungen, Fristen und Nachweise werden automatisch extrahiert. Ähnliche Projekte und Angebotsbausteine liegen sofort bereit.
          </p>
        </div>

        {phase === "upload" && (
          <Card className="p-10">
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Ausschreibung hochladen</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">PDF, DOCX oder ZIP — bis 200 MB</p>
              <Button onClick={startAnalysis} size="lg">
                <FileText className="mr-2 h-4 w-4" /> Demo-Ausschreibung analysieren
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Beispiel: „Neubau Verwaltungsgebäude Stadtwerke Münster — Los 3 HLS"
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Clock, title: "5 Min statt 1 Tag", desc: "Strukturierte Auswertung statt Dokumentenwühlen" },
                { icon: FolderOpen, title: "Wissen wiederverwenden", desc: "Ähnliche Projekte automatisch vorgeschlagen" },
                { icon: FileCheck2, title: "Direkt loslegen", desc: "Angebotsentwurf & Rückfragen vorbereitet" },
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/30">
                  <f.icon className="h-5 w-5 text-primary mb-2" />
                  <div className="font-medium text-sm">{f.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{f.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {phase === "analyzing" && (
          <Card className="p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold">Ausschreibung_Stadtwerke_Muenster_Los3.pdf wird analysiert…</h3>
                <p className="text-sm text-muted-foreground">Bitte einen Moment Geduld</p>
              </div>
            </div>
            <Progress value={progress} className="mb-6" />
            <div className="space-y-2">
              {analysisSteps.map((s, i) => {
                const done = progress >= (i + 1) * (100 / analysisSteps.length);
                return (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className={done ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {phase === "result" && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Analyse abgeschlossen
                    </Badge>
                    <span className="text-xs text-muted-foreground">in 4,2 Sek.</span>
                  </div>
                  <h2 className="text-xl font-semibold">Neubau Verwaltungsgebäude Stadtwerke Münster</h2>
                  <p className="text-sm text-muted-foreground">Los 3 — Heizung, Lüftung, Sanitär · Auftraggeber: Stadtwerke Münster GmbH</p>
                </div>
                <Button variant="outline" onClick={() => setPhase("upload")}>Neue Ausschreibung</Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                {[
                  { icon: Calendar, label: "Abgabefrist", value: "14. Juni 2026" },
                  { icon: Euro, label: "Volumen geschätzt", value: "€ 1,8 Mio." },
                  { icon: Building2, label: "Leistungspositionen", value: "147" },
                  { icon: FileCheck2, label: "Nachweise erforderlich", value: "8" },
                ].map((k, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><k.icon className="h-3 w-3" />{k.label}</div>
                    <div className="font-semibold mt-1">{k.value}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Tabs defaultValue="requirements">
              <TabsList>
                <TabsTrigger value="requirements">Anforderungen</TabsTrigger>
                <TabsTrigger value="similar">Ähnliche Projekte</TabsTrigger>
                <TabsTrigger value="draft">Angebotsentwurf</TabsTrigger>
                <TabsTrigger value="questions">Rückfragen</TabsTrigger>
              </TabsList>

              <TabsContent value="requirements" className="space-y-3 mt-4">
                {[
                  { type: "Eignung", text: "Referenz mind. 3 vergleichbare HLS-Projekte > €1 Mio. in den letzten 5 Jahren", critical: true },
                  { type: "Nachweis", text: "Präqualifikation nach PQ-VOB oder Einzelnachweise", critical: false },
                  { type: "Technisch", text: "BIM-Modell IFC 4 verpflichtend, LOD 350" },
                  { type: "Technisch", text: "Wärmeerzeugung über Sole-Wasser-Wärmepumpe gem. GEG §71" },
                  { type: "Frist", text: "Bietergespräch am 18.06.2026, verbindlich", critical: true },
                  { type: "Vertrag", text: "Vertragsstrafe 0,3 %/Werktag, max. 5 % der Auftragssumme" },
                ].map((r, i) => (
                  <Card key={i} className="p-4 flex items-start gap-3">
                    {r.critical ? <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />}
                    <div className="flex-1">
                      <Badge variant="outline" className="text-xs mb-1">{r.type}</Badge>
                      <p className="text-sm">{r.text}</p>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="similar" className="space-y-3 mt-4">
                {[
                  { name: "Neubau Rathaus Osnabrück, Los HLS", year: "2024", match: 94, volume: "€ 2,1 Mio.", lead: "M. Reuter" },
                  { name: "Stadtwerke Bielefeld — Verwaltungsbau", year: "2023", match: 87, volume: "€ 1,6 Mio.", lead: "S. Klein" },
                  { name: "Sparkasse Dortmund Neubau Hauptstelle", year: "2022", match: 78, volume: "€ 2,4 Mio.", lead: "M. Reuter" },
                ].map((p, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.year} · {p.volume} · Projektleitung: {p.lead}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{p.match}% Match</Badge>
                        <Button variant="outline" size="sm">Bausteine übernehmen <ArrowRight className="ml-1 h-3 w-3" /></Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="draft" className="mt-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Angebotsentwurf — automatisch erstellt</h3>
                    <Badge variant="secondary">Entwurf v1</Badge>
                  </div>
                  <Textarea
                    className="min-h-[320px] font-mono text-sm"
                    defaultValue={`Sehr geehrte Damen und Herren,

vielen Dank für die Möglichkeit, Ihnen ein Angebot für das Los 3 (HLS) des Neubaus Ihres Verwaltungsgebäudes unterbreiten zu dürfen.

1. ANGEBOTSGEGENSTAND
Lieferung und Montage der gesamten heizungs-, lüftungs- und sanitärtechnischen Anlagen gemäß Leistungsverzeichnis (147 Positionen).

2. EIGNUNG & REFERENZEN
- Rathaus Osnabrück (2024, € 2,1 Mio., HLS in vergleichbarer Größenordnung)
- Stadtwerke Bielefeld Verwaltungsbau (2023, € 1,6 Mio.)
- Sparkasse Dortmund Hauptstelle (2022, € 2,4 Mio.)
Alle Projekte BIM-basiert in IFC 4 abgewickelt.

3. TECHNISCHES KONZEPT
Wärmeerzeugung gem. GEG §71 über Sole-Wasser-Wärmepumpe (Vitocal 300-G Pro), 
Lüftung mit Wärmerückgewinnung > 80 %, Sanitärtrennsystem konform DIN 1988-200.

4. PREIS & TERMINE
Angebotssumme netto: € 1.742.500
Ausführungsbeginn: KW 38/2026
Fertigstellung: KW 22/2027

Mit freundlichen Grüßen`}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button>In Word exportieren</Button>
                    <Button variant="outline">An Projektleitung senden</Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="space-y-3 mt-4">
                {[
                  "Ist für die Wärmepumpe ein konkretes Fabrikat vorgegeben oder sind gleichwertige Produkte zulässig?",
                  "Sind die Schlitz- und Durchbruchsarbeiten Leistung des AN HLS oder werden sie bauseits gestellt?",
                  "Welche IFC-Coordination-View-Variante (CV 2.0 / Reference View) ist für die BIM-Lieferung verbindlich?",
                  "Wie wird mit Mehrkosten aus möglichen GEG-Novellen während der Bauzeit umgegangen?",
                ].map((q, i) => (
                  <Card key={i} className="p-4 flex items-start gap-3">
                    <MessageSquareWarning className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">{q}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">Übernehmen</Button>
                        <Button size="sm" variant="ghost">Verwerfen</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BidAssistant;
