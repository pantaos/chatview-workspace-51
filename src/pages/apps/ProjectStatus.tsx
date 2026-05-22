import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot, User, Mail, FileText, Database, Send, Sparkles, Loader2,
  CheckCircle2, Download, Zap, MessageSquare,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Source = { icon: any; label: string; sub: string };
type Step = { label: string; sources: Source[] };

type Msg = {
  id: string;
  role: "user" | "assistant";
  content?: string;
  thinking?: Step[];
  summary?: boolean;
  askPdf?: boolean;
  pdfDone?: boolean;
};

const SUGGESTED = [
  "Status zu Sanierung Rheinstr. 12",
  "Wie läuft das Logistikzentrum Hamm-Süd?",
  "Risiken bei BASF Produktionshalle 3",
];

const STEPS: Step[] = [
  {
    label: "Outlook durchsucht",
    sources: [
      { icon: Mail, label: "23 E-Mails (zuletzt heute 09:47, K. Bauer)", sub: "Outlook" },
    ],
  },
  {
    label: "proAlpha ERP abgefragt",
    sources: [
      { icon: Database, label: "Nachträge NR-07, NR-09 · Budgetstand 62 %", sub: "proAlpha" },
    ],
  },
  {
    label: "HubSpot CRM gelesen",
    sources: [
      { icon: Database, label: "Bauherr-Kontakte · 3 offene Aktivitäten", sub: "HubSpot" },
    ],
  },
  {
    label: "SharePoint & Teams analysiert",
    sources: [
      { icon: FileText, label: "11 Dokumente · 4 Meeting-Notizen KW 19–21", sub: "SharePoint / Teams" },
    ],
  },
];

const ProjectStatus = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hallo 👋 Ich bin dein Projekt-Assistent. Ich durchsuche Outlook, proAlpha (ERP), HubSpot (CRM), SharePoint und Teams und fasse die Lage in 30 Sekunden zusammen.\n\nZu welchem Projekt möchtest du einen Status?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setInput("");
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setBusy(true);

    // Thinking message with progressively revealed steps
    const thinkingId = crypto.randomUUID();
    setMessages((m) => [...m, { id: thinkingId, role: "assistant", thinking: [] }]);

    for (let i = 0; i < STEPS.length; i++) {
      await sleep(700);
      setMessages((m) =>
        m.map((msg) =>
          msg.id === thinkingId ? { ...msg, thinking: STEPS.slice(0, i + 1) } : msg
        )
      );
    }

    await sleep(500);
    // Replace thinking with summary
    setMessages((m) => [
      ...m.filter((msg) => msg.id !== thinkingId),
      {
        id: crypto.randomUUID(),
        role: "assistant",
        thinking: STEPS,
        summary: true,
      },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Möchtest du diese Zusammenfassung als PDF exportieren?",
        askPdf: true,
      },
    ]);
    setBusy(false);
  };

  const handlePdf = (msgId: string, yes: boolean) => {
    if (yes) {
      toast({ title: "PDF wird erstellt…", description: "Executive Summary · projektstatus.pdf" });
      setTimeout(() => {
        toast({ title: "PDF bereit", description: "projektstatus.pdf wurde heruntergeladen." });
      }, 1200);
    }
    setMessages((m) =>
      m.map((msg) =>
        msg.id === msgId
          ? {
              ...msg,
              askPdf: false,
              pdfDone: true,
              content: yes
                ? "✅ Alles klar – PDF wurde erstellt und heruntergeladen."
                : "Okay, kein PDF. Soll ich noch zu einem anderen Projekt etwas rausziehen?",
            }
          : msg
      )
    );
  };

  return (
    <MainLayout mobileTitle="Projektstatus">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col h-[calc(100vh-4rem)]">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Zap className="h-4 w-4" />
            <span>PANTA Assistent</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projektstatus in 30 Sekunden</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Frag den Assistenten – er zieht Daten aus ERP, CRM, Outlook & SharePoint und liefert die Lage als Executive Summary.
          </p>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} onPdf={(yes) => handlePdf(m.id, yes)} />
          ))}
        </div>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full border bg-background hover:bg-muted transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border rounded-2xl bg-background px-3 py-2 shadow-sm"
        >
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Welches Projekt soll ich analysieren?"
            disabled={busy}
            className="flex-1 bg-transparent outline-none text-sm py-1"
          />
          <Button type="submit" size="sm" disabled={busy || !input.trim()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MessageBubble = ({ msg, onPdf }: { msg: Msg; onPdf: (yes: boolean) => void }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className={`max-w-[85%] space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {msg.content && (
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
              isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {msg.content}
          </div>
        )}

        {msg.thinking && msg.thinking.length > 0 && (
          <Card className="p-3 w-full">
            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              {msg.summary ? "Quellen analysiert" : "Analysiere Quellen…"}
            </div>
            <div className="space-y-1.5">
              {msg.thinking.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{s.label}</div>
                    {s.sources.map((src, j) => (
                      <div key={j} className="text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <src.icon className="h-3 w-3" />
                        <span>{src.label}</span>
                        <span className="text-[10px] opacity-60">· {src.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {!msg.summary && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>…</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {msg.summary && <SummaryCard />}

        {msg.askPdf && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={() => onPdf(true)}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Ja, als PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => onPdf(false)}>
              Nein, danke
            </Button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

const SummaryCard = () => (
  <Card className="p-5 w-full">
    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
      <div>
        <div className="text-xs text-muted-foreground">Executive Summary</div>
        <h3 className="font-semibold">Sanierung Verwaltungsgebäude Rheinstr. 12</h3>
      </div>
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Eskalation empfohlen</Badge>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pb-4 border-b">
      <Stat label="Fortschritt" value="62 %" />
      <Stat label="Verzug" value="+11 Tage" cls="text-red-600" />
      <Stat label="Budget" value="84 %" />
      <Stat label="Nächster MS" value="22.06.26" />
    </div>

    <p className="text-sm leading-relaxed mb-4">
      Das Projekt liegt aktuell <strong>11 Werktage hinter Plan</strong>, hauptsächlich durch die verspätete
      Statikfreigabe (KW 18) und offene Materialfreigaben des Bauherrn für die Fassade. Erhöhtes Kostenrisiko bei
      den HLS-Gewerken (Mehraufwand ca. <strong>€ 84.000</strong> aus NR-07 und NR-09). Drei Entscheidungen warten
      seit über einer Woche auf den Bauherrn.
    </p>

    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <div className="text-xs font-semibold mb-2 text-orange-700">Offene Punkte</div>
        <ul className="text-xs space-y-1.5 text-muted-foreground">
          <li>• Freigabe Fassadenmuster (Bauherr · 9 Tage)</li>
          <li>• Nachtrag NR-09 Lüftung (GU · 5 Tage)</li>
          <li>• Brandschutzkonzept Rev. 3 (3 Tage)</li>
        </ul>
      </div>
      <div>
        <div className="text-xs font-semibold mb-2 text-green-700">Nächste Schritte</div>
        <ul className="text-xs space-y-1.5 text-muted-foreground">
          <li>• Termin mit Bauherrn diese Woche fixieren</li>
          <li>• NR-09 an Projektleitung übergeben</li>
          <li>• 5 Tage Puffer mit GU verhandeln</li>
        </ul>
      </div>
    </div>
  </Card>
);

const Stat = ({ label, value, cls = "" }: { label: string; value: string; cls?: string }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className={`font-semibold text-sm mt-0.5 ${cls}`}>{value}</div>
  </div>
);

export default ProjectStatus;
