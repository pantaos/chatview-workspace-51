import { useState } from "react";
import { Code2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CPLang } from "@/components/content-planner/i18n";

export type DevDocId =
  | "overview"
  | "calendar"
  | "logic"
  | "suggestions"
  | "briefing"
  | "package"
  | "admin";

interface DevDocBlock {
  heading: string;
  items: string[];
}

interface DevDoc {
  title: string;
  intro: string;
  blocks: DevDocBlock[];
  /** State / data touched – shown as tags */
  touches?: string[];
}

type DevDocSet = Record<DevDocId, DevDoc>;

const DE: DevDocSet = {
  overview: {
    title: "Architektur & Ablauf (Gesamtüberblick)",
    intro:
      "Der Content Planner ist aktuell ein voll geklicktes Frontend-Prototyp ohne echtes Backend. Alle „KI“-Schritte sind mit setTimeout simuliert und greifen auf statische Daten aus i18n.ts zu. Diese Doku beschreibt, was beim Produktiv-Bau wo angedockt werden muss.",
    blocks: [
      {
        heading: "Komponenten-Struktur",
        items: [
          "src/pages/ContentPlanner.tsx – Haupt-Container, hält den gesamten State und rendert Wizard (User) + Admin-Modus.",
          "src/components/content-planner/AdminConfig.tsx – Admin-Konfigurationsmodule (Zielgruppen, Themen, Regeln …).",
          "src/components/content-planner/i18n.ts – komplettes DE/EN-Wörterbuch UND die Demo-/Seed-Daten (suggestions, calEntries, audiences …).",
          "src/components/content-planner/DevDocs.tsx – diese Entwickler-Doku (rein erklärend, kein Produktivcode).",
        ],
      },
      {
        heading: "Datenfluss (Soll-Zustand)",
        items: [
          "User-Auswahl (Schritt 1) → Request an Planungs-Service mit period, fields, channels, targets.",
          "Themenlogik (Schritt 2) → Flags useSeasonal / useTrends / usePriorities steuern Scoring-Gewichte.",
          "Backend kombiniert: Saisonregeln (Admin) + Google-Trends-Signale + HDI-Prioritäten → Scoring → suggestions[].",
          "Schritt 4 ruft pro Thema eine Analyse-/Briefing-Generierung (LLM) auf.",
          "Schritt 5 erzeugt Master-Artikel + Ableitungen (LLM) und legt ein Approval-Objekt für Human-in-the-loop an.",
        ],
      },
      {
        heading: "Was noch fehlt (für Backend-Kollegen)",
        items: [
          "Persistenz: Plan, Vorschläge, Briefings, Pakete und Status müssen in DB-Tabellen.",
          "LLM-Anbindung: aktuell setTimeout – ersetzen durch echte Generierungs-Calls.",
          "Google-Trends-Integration: API-Credentials liegen laut Admin im Systembereich, Abruf fehlt.",
          "Auth & Rollen: Admin-Modus ist nur ein Switch, keine echte Rechteprüfung.",
          "Approval-Workflow: HITL-Status braucht Persistenz + Benachrichtigungen.",
        ],
      },
    ],
    touches: ["lang", "adminMode", "activeStep", "completed"],
  },
  calendar: {
    title: "Schritt 1 – Kalender befüllen",
    intro:
      "Erfasst die Planungs-Parameter und triggert die (simulierte) automatische Befüllung des Kalenders.",
    blocks: [
      {
        heading: "State",
        items: [
          "period: string – ausgewählter Zeitraum (Select).",
          "fields / channels / targets: string[] – Mehrfachauswahl über ChipGroup.",
          "calendarFilled: boolean – steuert Anzeige der CalendarOverview & Aktivierung von „Weiter“.",
          "filling: boolean – Lade-/Spinner-Zustand während fillCalendar().",
        ],
      },
      {
        heading: "Ablauf & TODO",
        items: [
          "fillCalendar() simuliert per setTimeout(1600ms) – hier echten Planungs-Request einsetzen.",
          "Die angezeigten Kalendereinträge kommen statisch aus c.calEntries (i18n.ts), nicht aus der Auswahl.",
          "Produktiv: Auswahl als Payload senden, Antwort in einen Kalender-State schreiben und CalendarOverview daraus rendern.",
        ],
      },
    ],
    touches: ["period", "fields", "channels", "targets", "calendarFilled"],
  },
  logic: {
    title: "Schritt 2 – Themenlogik & Signale",
    intro:
      "Steuert, welche Signalquellen in das Scoring der Vorschläge einfließen.",
    blocks: [
      {
        heading: "State",
        items: [
          "useSeasonal: boolean – Saisonale Regeln (aus Admin-Modul „Saisonale Regeln“).",
          "useTrends: boolean – Google-Trends-Signale als Zusatzimpuls.",
          "usePriorities: boolean – strategische HDI-Prioritäten.",
        ],
      },
      {
        heading: "TODO",
        items: [
          "Diese Flags müssen als Scoring-Gewichte an die Generierung in Schritt 3 übergeben werden.",
          "Aktuell haben sie keinen Effekt auf die Demo-Vorschläge.",
        ],
      },
    ],
    touches: ["useSeasonal", "useTrends", "usePriorities"],
  },
  suggestions: {
    title: "Schritt 3 – Vorschlagskalender",
    intro:
      "Liste konkreter Themenvorschläge mit Datum, Kanal, Relevanz-Score und Freigabe-Status.",
    blocks: [
      {
        heading: "Datenmodell (CPSuggestion)",
        items: [
          "id, date, topic, field, channel, score, reason, status.",
          "status zyklisch: proposal → review → approved (cycleStatus()).",
        ],
      },
      {
        heading: "Ablauf & TODO",
        items: [
          "handleGenerate() lädt nur c.suggestions neu (statisch) – durch echten Scoring-Call ersetzen.",
          "score & reason sollten vom Backend stammen (Erklärbarkeit der KI-Empfehlung).",
          "Statusänderungen müssen persistiert werden (Redaktions-Freigabe).",
        ],
      },
    ],
    touches: ["suggestions", "generating"],
  },
  briefing: {
    title: "Schritt 4 – Themenanalyse & Briefing",
    intro:
      "Generiert pro gewähltem Thema Trends, Nutzerfragen und ein Content-Briefing.",
    blocks: [
      {
        heading: "State",
        items: [
          "selectedTopic: CPSuggestion | null – aktuell gewähltes Thema.",
          "analyzing / briefingReady: boolean – Lade- bzw. Ergebnis-Zustand.",
        ],
      },
      {
        heading: "TODO",
        items: [
          "pickTopic() simuliert Analyse per setTimeout – durch LLM-/Trends-Call ersetzen.",
          "briefingTrends, briefingQuestions sind statisch (i18n.ts) – produktiv themenspezifisch generieren.",
          "Briefing sollte als wiederverwendbares Objekt gespeichert und an Schritt 5 übergeben werden.",
        ],
      },
    ],
    touches: ["selectedTopic", "analyzing", "briefingReady"],
  },
  package: {
    title: "Schritt 5 – Content-Paket erstellen",
    intro:
      "Erstellt aus dem Briefing einen Master-Artikel und leitet kanalspezifische Formate ab. Endet im Human-in-the-loop.",
    blocks: [
      {
        heading: "State",
        items: [
          "building / packageReady: boolean – Generierungs- bzw. Ergebnis-Zustand.",
          "Ableitungen aus c.derivatives (LinkedIn, Instagram, Video, FAQ …).",
        ],
      },
      {
        heading: "TODO",
        items: [
          "buildPackage() simuliert – Master + Ableitungen müssen real per LLM erzeugt werden.",
          "„Zur Freigabe senden“ muss ein Approval-Objekt anlegen (Status, Verantwortliche, Benachrichtigung).",
          "Leitprinzip: keine automatische Veröffentlichung – HITL ist verpflichtend.",
        ],
      },
    ],
    touches: ["building", "packageReady", "selectedTopic"],
  },
  admin: {
    title: "Admin-Modus – Konfiguration",
    intro:
      "Pflegt die „redaktionelle Intelligenz“: Zielgruppen, Themen/Sparten, Saisonregeln, Trend-Signale, Formate und Governance. Diese Daten steuern die Generierung im User-Wizard.",
    blocks: [
      {
        heading: "Module (AdminConfig.tsx)",
        items: [
          "audiences – steuernde Datensätze (beeinflussen Sprache, Kanal, CTA …).",
          "topics – Themen mit Sparte, Saisonfenster, Trend-Keywords, Freigabepflicht.",
          "seasonal – wiederkehrende Anlässe & Zeitfenster.",
          "trends – Google-Trends-Datenquelle & Scoring-Parameter.",
          "formats / governance – verfügbare Formate, Freigabe- & Compliance-Regeln.",
        ],
      },
      {
        heading: "TODO",
        items: [
          "Alle Module rendern Seed-Daten aus i18n.ts – produktiv aus DB laden & speichern.",
          "AdminPublishBar (Simulieren/Entwurf/Veröffentlichen) ist UI-only.",
          "„Vorschau als Nutzer“ rendert denselben Wizard mit dem konfigurierten Stand.",
          "Echte Rollenprüfung statt adminMode-Switch nötig.",
        ],
      },
    ],
    touches: ["adminMode", "adminModule"],
  },
};

const EN: DevDocSet = {
  overview: {
    title: "Architecture & flow (overview)",
    intro:
      "The Content Planner is currently a fully click-through frontend prototype with no real backend. All “AI” steps are simulated with setTimeout and read static data from i18n.ts. This doc describes where to plug things in for the production build.",
    blocks: [
      {
        heading: "Component structure",
        items: [
          "src/pages/ContentPlanner.tsx – main container, holds all state, renders wizard (user) + admin mode.",
          "src/components/content-planner/AdminConfig.tsx – admin config modules (audiences, topics, rules …).",
          "src/components/content-planner/i18n.ts – full DE/EN dictionary AND the demo/seed data (suggestions, calEntries, audiences …).",
          "src/components/content-planner/DevDocs.tsx – this developer doc (explanatory only, no production code).",
        ],
      },
      {
        heading: "Data flow (target state)",
        items: [
          "User selection (step 1) → request to planning service with period, fields, channels, targets.",
          "Topic logic (step 2) → flags useSeasonal / useTrends / usePriorities drive scoring weights.",
          "Backend combines seasonal rules (admin) + Google Trends signals + HDI priorities → scoring → suggestions[].",
          "Step 4 calls per-topic analysis/briefing generation (LLM).",
          "Step 5 generates master article + derivatives (LLM) and creates an approval object for human-in-the-loop.",
        ],
      },
      {
        heading: "Still missing (for backend colleagues)",
        items: [
          "Persistence: plan, suggestions, briefings, packages and status need DB tables.",
          "LLM wiring: currently setTimeout – replace with real generation calls.",
          "Google Trends integration: admin says credentials live in the system area, the fetch is missing.",
          "Auth & roles: admin mode is just a switch, no real permission check.",
          "Approval workflow: HITL status needs persistence + notifications.",
        ],
      },
    ],
    touches: ["lang", "adminMode", "activeStep", "completed"],
  },
  calendar: {
    title: "Step 1 – Fill calendar",
    intro:
      "Captures the planning parameters and triggers the (simulated) automatic calendar fill.",
    blocks: [
      {
        heading: "State",
        items: [
          "period: string – selected timeframe (Select).",
          "fields / channels / targets: string[] – multi-select via ChipGroup.",
          "calendarFilled: boolean – controls CalendarOverview display & enables “Next”.",
          "filling: boolean – loading/spinner state during fillCalendar().",
        ],
      },
      {
        heading: "Flow & TODO",
        items: [
          "fillCalendar() simulates via setTimeout(1600ms) – plug the real planning request here.",
          "Displayed calendar entries come statically from c.calEntries (i18n.ts), not from the selection.",
          "Production: send the selection as payload, write the response into a calendar state and render CalendarOverview from it.",
        ],
      },
    ],
    touches: ["period", "fields", "channels", "targets", "calendarFilled"],
  },
  logic: {
    title: "Step 2 – Topic logic & signals",
    intro: "Controls which signal sources feed into the suggestion scoring.",
    blocks: [
      {
        heading: "State",
        items: [
          "useSeasonal: boolean – seasonal rules (from admin module “Seasonal rules”).",
          "useTrends: boolean – Google Trends signals as an extra impulse.",
          "usePriorities: boolean – strategic HDI priorities.",
        ],
      },
      {
        heading: "TODO",
        items: [
          "These flags must be passed as scoring weights to the generation in step 3.",
          "Currently they have no effect on the demo suggestions.",
        ],
      },
    ],
    touches: ["useSeasonal", "useTrends", "usePriorities"],
  },
  suggestions: {
    title: "Step 3 – Suggestion calendar",
    intro:
      "List of concrete topic suggestions with date, channel, relevance score and approval status.",
    blocks: [
      {
        heading: "Data model (CPSuggestion)",
        items: [
          "id, date, topic, field, channel, score, reason, status.",
          "status cycles: proposal → review → approved (cycleStatus()).",
        ],
      },
      {
        heading: "Flow & TODO",
        items: [
          "handleGenerate() just reloads c.suggestions (static) – replace with a real scoring call.",
          "score & reason should come from the backend (explainability of the AI recommendation).",
          "Status changes need to be persisted (editorial approval).",
        ],
      },
    ],
    touches: ["suggestions", "generating"],
  },
  briefing: {
    title: "Step 4 – Topic analysis & briefing",
    intro:
      "Generates trends, user questions and a content briefing per selected topic.",
    blocks: [
      {
        heading: "State",
        items: [
          "selectedTopic: CPSuggestion | null – currently selected topic.",
          "analyzing / briefingReady: boolean – loading and result state.",
        ],
      },
      {
        heading: "TODO",
        items: [
          "pickTopic() simulates analysis via setTimeout – replace with an LLM/trends call.",
          "briefingTrends, briefingQuestions are static (i18n.ts) – generate per topic in production.",
          "The briefing should be stored as a reusable object and handed to step 5.",
        ],
      },
    ],
    touches: ["selectedTopic", "analyzing", "briefingReady"],
  },
  package: {
    title: "Step 5 – Build content package",
    intro:
      "Builds a master article from the briefing and derives channel-specific formats. Ends in human-in-the-loop.",
    blocks: [
      {
        heading: "State",
        items: [
          "building / packageReady: boolean – generation and result state.",
          "Derivatives from c.derivatives (LinkedIn, Instagram, video, FAQ …).",
        ],
      },
      {
        heading: "TODO",
        items: [
          "buildPackage() is simulated – master + derivatives must be generated for real via LLM.",
          "“Send for approval” must create an approval object (status, owners, notification).",
          "Guiding principle: no automatic publishing – HITL is mandatory.",
        ],
      },
    ],
    touches: ["building", "packageReady", "selectedTopic"],
  },
  admin: {
    title: "Admin mode – configuration",
    intro:
      "Maintains the “editorial intelligence”: audiences, topics/lines, seasonal rules, trend signals, formats and governance. This data drives the generation in the user wizard.",
    blocks: [
      {
        heading: "Modules (AdminConfig.tsx)",
        items: [
          "audiences – steering datasets (affect language, channel, CTA …).",
          "topics – topics with line, seasonal window, trend keywords, approval requirement.",
          "seasonal – recurring occasions & time windows.",
          "trends – Google Trends data source & scoring parameters.",
          "formats / governance – available formats, approval & compliance rules.",
        ],
      },
      {
        heading: "TODO",
        items: [
          "All modules render seed data from i18n.ts – load & save from DB in production.",
          "AdminPublishBar (simulate/draft/publish) is UI-only.",
          "“Preview as user” renders the same wizard with the configured state.",
          "Real role check needed instead of the adminMode switch.",
        ],
      },
    ],
    touches: ["adminMode", "adminModule"],
  },
};

const DOCS: Record<CPLang, DevDocSet> = { de: DE, en: EN };

const UI = {
  de: { button: "For Devs", badge: "Entwickler-Doku", state: "Betroffener State / Daten" },
  en: { button: "For Devs", badge: "Developer docs", state: "Touched state / data" },
};

interface DevDocButtonProps {
  docId: DevDocId;
  lang: CPLang;
  className?: string;
}

const DevDocButton = ({ docId, lang, className }: DevDocButtonProps) => {
  const [open, setOpen] = useState(false);
  const doc = DOCS[lang][docId];
  const ui = UI[lang];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
          title={ui.badge}
        >
          <Code2 className="h-4 w-4" /> {ui.button}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-[10px] uppercase tracking-wide">
              <Code2 className="h-3 w-3" /> {ui.badge}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{doc.title}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">{doc.intro}</p>

        <div className="space-y-5 mt-2">
          {doc.blocks.map((block) => (
            <div key={block.heading}>
              <p className="text-sm font-semibold text-foreground mb-2">{block.heading}</p>
              <ul className="space-y-1.5">
                {block.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1 leading-none">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {doc.touches && doc.touches.length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {ui.state}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {doc.touches.map((t) => (
                  <code
                    key={t}
                    className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded text-foreground"
                  >
                    {t}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DevDocButton;
