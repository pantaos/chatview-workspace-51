import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search, Database, Users, FileText, Mail, Sparkles, ArrowRight,
  Building2, Phone, MapPin, Euro, Calendar, Paperclip
} from "lucide-react";

const suggestions = [
  "Was war der letzte Stand bei Meyer Anlagenbau?",
  "Zeig mir alle offenen Angebote über € 500k",
  "Welche Projekte hatten wir mit BIM-Anforderungen?",
];

const UnifiedSearch = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const run = (q?: string) => {
    if (q) setQuery(q);
    setLoading(true);
    setSearched(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <MainLayout mobileTitle="Unternehmenssuche">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Database className="h-4 w-4" />
            <span>PANTA Assistent</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">ERP + CRM + Dokumente — eine Suche</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Stell eine Frage. PANTA antwortet quer über Kundendaten, Projekte, E-Mails und Dokumente — kein Springen zwischen Systemen.
          </p>
        </div>

        <Card className="p-3 mb-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground ml-2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="Frage stellen, z. B. „Was war der letzte Stand bei Meyer Anlagenbau?"
              className="border-0 shadow-none focus-visible:ring-0 text-base"
            />
            <Button onClick={() => run()}>
              <Sparkles className="mr-1 h-4 w-4" /> Fragen
            </Button>
          </div>
        </Card>

        {!searched && (
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Vorschläge</div>
            <div className="flex flex-wrap gap-2 mb-8">
              {suggestions.map((s) => (
                <Button key={s} variant="outline" size="sm" onClick={() => run(s)}>
                  {s}
                </Button>
              ))}
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              {[
                { icon: Database, label: "ERP (proAlpha)", count: "1.247 Aufträge" },
                { icon: Users, label: "CRM (HubSpot)", count: "3.812 Kontakte" },
                { icon: FileText, label: "SharePoint", count: "48.290 Dokumente" },
                { icon: Mail, label: "Outlook", count: "Alle Postfächer" },
              ].map((s, i) => (
                <Card key={i} className="p-4">
                  <s.icon className="h-5 w-5 text-muted-foreground mb-2" />
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.count}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searched && loading && (
          <Card className="p-8 text-center">
            <Sparkles className="h-7 w-7 mx-auto text-primary animate-pulse mb-3" />
            <p className="text-sm text-muted-foreground">Durchsuche ERP, CRM, SharePoint & Outlook…</p>
          </Card>
        )}

        {searched && !loading && (
          <div className="space-y-5">
            <Card className="p-6 border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Antwort</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Mit <strong>Meyer Anlagenbau GmbH</strong> arbeitest du seit 2019 zusammen. Letzter aktiver Auftrag ist
                <strong> AUF-2024-1187</strong> („Erweiterung Produktionslinie 4") über <strong>€ 612.400</strong> —
                aktuell zu 78 % abgerechnet. Die letzte Korrespondenz ist eine E-Mail von
                <strong> Frau S. Hartmann (Einkauf Meyer)</strong> vom <strong>19.05.2026</strong> mit der Bitte um ein
                Angebot über eine Folgemaßnahme (Steuerungsumbau, geschätzt € 180k). Auf diese E-Mail wurde noch nicht geantwortet.
                Hauptansprechpartner intern: <strong>Thomas Klein (Vertrieb)</strong>.
              </p>
              <div className="flex gap-2 mt-4">
                <Button size="sm">Antwortentwurf erstellen</Button>
                <Button size="sm" variant="outline">Folgeangebot starten</Button>
              </div>
            </Card>

            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Quellen aus allen Systemen</div>
              <div className="space-y-2">
                <SourceRow
                  icon={Users} system="CRM · HubSpot" color="text-orange-600 bg-orange-50"
                  title="Meyer Anlagenbau GmbH" sub="Kunde seit 2019 · Branche: Maschinenbau · Status: Aktiv"
                  meta={[
                    { icon: MapPin, text: "44137 Dortmund" },
                    { icon: Phone, text: "+49 231 47220-0" },
                  ]}
                />
                <SourceRow
                  icon={Database} system="ERP · proAlpha" color="text-blue-600 bg-blue-50"
                  title="Auftrag AUF-2024-1187 — Erweiterung Produktionslinie 4"
                  sub="Auftragswert € 612.400 · Abgerechnet 78 % · Restlaufzeit bis 31.08.2026"
                  meta={[
                    { icon: Euro, text: "€ 612.400" },
                    { icon: Calendar, text: "bis 31.08.2026" },
                  ]}
                />
                <SourceRow
                  icon={Mail} system="Outlook · t.klein@" color="text-purple-600 bg-purple-50"
                  title="AW: Folgemaßnahme Steuerungsumbau"
                  sub="Von: S. Hartmann <s.hartmann@meyer-anlagenbau.de> · 19.05.2026 14:22"
                  meta={[{ icon: Paperclip, text: "1 Anhang: LV_Steuerung.pdf" }]}
                />
                <SourceRow
                  icon={FileText} system="SharePoint · /Kunden/Meyer/" color="text-emerald-600 bg-emerald-50"
                  title="Abnahmeprotokoll_Linie4_2025-11.pdf"
                  sub="Erstellt 14.11.2025 von M. Reuter · zuletzt geöffnet vor 2 Wochen"
                  meta={[]}
                />
                <SourceRow
                  icon={Building2} system="ERP · proAlpha" color="text-blue-600 bg-blue-50"
                  title="Historie: 7 abgeschlossene Aufträge seit 2019 (Gesamt € 3,4 Mio.)"
                  sub="Letzter abgeschlossener Auftrag: AUF-2023-0942 — Wartungsvertrag verlängert"
                  meta={[]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

const SourceRow = ({ icon: Icon, system, color, title, sub, meta }: any) => (
  <Card className="p-4 hover:shadow-sm transition cursor-pointer">
    <div className="flex items-start gap-3">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{system}</div>
        <div className="font-medium text-sm mt-0.5">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
        {meta?.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {meta.map((m: any, i: number) => (
              <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                <m.icon className="h-3 w-3" />{m.text}
              </div>
            ))}
          </div>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
    </div>
  </Card>
);

export default UnifiedSearch;
