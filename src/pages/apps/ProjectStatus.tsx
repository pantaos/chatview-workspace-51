import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Send, Sparkles, Loader2, Copy, ThumbsUp, ThumbsDown, 
  ShieldCheck, Paperclip, Mic, ChevronDown, CheckCircle2,
  Mail, Database, FileText
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

const SUGGESTED = [
  "Status zu Sanierung Rheinstr. 12",
  "Wie läuft das Logistikzentrum Hamm-Süd?",
  "Risiken bei BASF Produktionshalle 3",
];

const ProjectStatus = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hallo 👋 Ich bin dein Projektstatus-Assistent. Ich durchsuche Outlook, proAlpha (ERP), HubSpot (CRM), SharePoint und Teams und fasse die Lage für dich zusammen.\n\nZu welchem Projekt möchtest du einen Status?",
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
    
    const summaryText = `**Executive Summary: Sanierung Verwaltungsgebäude Rheinstr. 12**
Status: **Eskalation empfohlen**

Das Projekt liegt aktuell **11 Werktage hinter Plan**, hauptsächlich durch die verspätete Statikfreigabe (KW 18) und offene Materialfreigaben des Bauherrn für die Fassade. Erhöhtes Kostenrisiko bei den HLS-Gewerken (Mehraufwand ca. **€ 84.000** aus NR-07 und NR-09). Drei Entscheidungen warten seit über einer Woche auf den Bauherrn.

**Key-Metrics:**
• **Fortschritt:** 62 %
• **Verzug:** +11 Tage
• **Budget:** 84 %
• **Nächster Meilenstein:** 22.06.26

**Offene Punkte**
1. Freigabe Fassadenmuster (Bauherr · 9 Tage)
2. Nachtrag NR-09 Lüftung (GU · 5 Tage)
3. Brandschutzkonzept Rev. 3 (3 Tage)

**Nächste Schritte**
1. Termin mit Bauherrn diese Woche fixieren
2. NR-09 an Projektleitung übergeben
3. 5 Tage Puffer mit GU verhandeln`;

    setMessages((m) => [
      ...m.filter((msg) => msg.id !== thinkingId),
      {
        id: crypto.randomUUID(),
        role: "assistant",
        thinking: STEPS,
        summary: true,
        content: summaryText,
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
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-background">
        {/* Header matched to screenshot */}
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-4 w-full flex flex-col shrink-0">
          <h1 className="text-[17px] font-semibold text-foreground">Projektstatus-Assistent</h1>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 cursor-pointer w-fit hover:bg-muted px-2 py-1 rounded-md -ml-2 transition-colors">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span>GPT-4o</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4">
          <div className="max-w-3xl mx-auto py-2 space-y-6">
            {messages.map((m) => (
              <MessageBubble key={m.id} msg={m} onPdf={(yes) => handlePdf(m.id, yes)} />
            ))}
            
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-4 justify-end">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-sm px-4 py-2 rounded-3xl bg-muted hover:bg-muted/80 transition-colors text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="max-w-3xl mx-auto px-4 w-full shrink-0 pt-2 pb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border border-input rounded-[24px] bg-background px-4 py-3 shadow-sm mb-3 focus-within:ring-1 focus-within:ring-ring transition-shadow"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Stellen Sie eine Frage"
              disabled={busy}
              className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-3 text-muted-foreground">
              <ShieldCheck className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
              <Paperclip className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
              <Mic className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
              <button 
                type="submit" 
                disabled={busy || !input.trim()}
                className="h-8 w-8 bg-muted hover:bg-muted/80 text-foreground rounded-full flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-px" />}
              </button>
            </div>
          </form>
          <div className="text-center text-xs text-muted-foreground">
            PANTA OS kann Fehler machen. Bitte überprüfen Sie wichtige Informationen.
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const formatText = (text: string) => {
  return text.split('\n').map((line, i) => (
    <span key={i} className="block min-h-[1.2em]">
      {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
      })}
    </span>
  ));
};

const MessageBubble = ({ msg, onPdf }: { msg: Msg; onPdf: (yes: boolean) => void }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex flex-col w-full ${isUser ? "items-end" : "items-start"}`}>
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? "bg-muted rounded-[24px] px-5 py-3.5" : ""}`}>
        
        {/* Thinking Steps */}
        {msg.thinking && msg.thinking.length > 0 && (
          <div className="bg-muted/40 rounded-2xl p-4 mb-4 border border-border/50 w-full sm:w-[400px]">
            <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {msg.summary ? "Quellen analysiert" : "Analysiere Quellen…"}
            </div>
            <div className="space-y-2.5">
              {msg.thinking.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13px]">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-[1px] shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{s.label}</div>
                    {s.sources.map((src, j) => (
                      <div key={j} className="text-muted-foreground flex items-center gap-1.5 mt-1">
                        <src.icon className="h-3.5 w-3.5" />
                        <span>{src.label}</span>
                        <span className="text-[11px] opacity-60">· {src.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {!msg.summary && (
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground pt-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>…</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {msg.content && (
          <div className={`text-[15px] leading-relaxed ${isUser ? "text-foreground" : "text-foreground"}`}>
            {formatText(msg.content)}
          </div>
        )}

        {/* Assistant Action Buttons */}
        {!isUser && msg.content && (
          <div className="flex items-center gap-3 text-muted-foreground mt-4">
            <button className="hover:text-foreground transition-colors p-1"><Copy className="h-4 w-4" /></button>
            <button className="hover:text-foreground transition-colors p-1"><ThumbsUp className="h-4 w-4" /></button>
            <button className="hover:text-foreground transition-colors p-1"><ThumbsDown className="h-4 w-4" /></button>
          </div>
        )}

        {/* PDF Prompt Buttons */}
        {msg.askPdf && (
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={() => onPdf(true)} className="rounded-full px-4">
              Ja, als PDF exportieren
            </Button>
            <Button size="sm" variant="outline" onClick={() => onPdf(false)} className="rounded-full px-4 bg-transparent border-input">
              Nein, danke
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectStatus;
