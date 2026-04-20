import { useMemo, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { CommunityApp, DemoAppType } from "@/data/communityApps";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Plus, Search, TrendingUp, TrendingDown, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniAppProps {
  app: CommunityApp;
}

function pickType(app: CommunityApp): DemoAppType {
  if (app.demoType) return app.demoType;
  // hash by id to pick deterministically
  const types: DemoAppType[] = ["dashboard", "tracker", "notes", "calculator"];
  let h = 0;
  for (let i = 0; i < app.id.length; i++) h = (h * 31 + app.id.charCodeAt(i)) >>> 0;
  return types[h % types.length];
}

/* ---------------- DASHBOARD ---------------- */
function DashboardApp({ primary, accent }: { primary: string; accent: string }) {
  const bars = [42, 58, 35, 71, 49, 82, 64];
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const max = Math.max(...bars);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Revenue", value: "€24.8k", trend: 12.4, up: true },
          { label: "Orders", value: "318", trend: 5.1, up: true },
          { label: "Refunds", value: "12", trend: 1.8, up: false },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border/60 bg-card p-3">
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
            <div className="text-lg font-semibold mt-0.5">{s.value}</div>
            <div className={cn("text-[11px] mt-1 inline-flex items-center gap-1", s.up ? "text-emerald-600" : "text-red-600")}>
              {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {s.trend}%
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Weekly revenue</div>
          <div className="text-xs text-muted-foreground">Last 7 days</div>
        </div>
        <div className="flex items-end gap-2 h-32">
          {bars.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-md transition-all"
                style={{ height: `${(v / max) * 100}%`, background: `linear-gradient(to top, ${primary}, ${accent})` }}
              />
              <div className="text-[10px] text-muted-foreground">{days[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="text-sm font-semibold mb-2">Top customers</div>
        <ul className="divide-y divide-border/40">
          {[
            { name: "Acme Corp", value: "€4,820" },
            { name: "Globex", value: "€3,140" },
            { name: "Initech", value: "€2,690" },
          ].map((c) => (
            <li key={c.name} className="flex justify-between py-2 text-sm">
              <span>{c.name}</span>
              <span className="font-medium">{c.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- TRACKER ---------------- */
function TrackerApp({ primary }: { primary: string }) {
  const [habits, setHabits] = useState([
    { id: "1", name: "Drink 2L water", days: [true, true, true, false, true, true, false] },
    { id: "2", name: "Read 20 minutes", days: [true, false, true, true, true, false, false] },
    { id: "3", name: "Workout", days: [false, true, true, false, true, true, false] },
  ]);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const toggle = (hid: string, di: number) =>
    setHabits((p) => p.map((h) => (h.id === hid ? { ...h, days: h.days.map((d, i) => (i === di ? !d : d)) } : h)));

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">This week</div>
          <div className="text-xs text-muted-foreground">{habits.reduce((a, h) => a + h.days.filter(Boolean).length, 0)} done</div>
        </div>
        <ul className="space-y-2">
          {habits.map((h) => (
            <li key={h.id} className="flex items-center gap-3">
              <div className="flex-1 text-sm truncate">{h.name}</div>
              <div className="flex gap-1">
                {h.days.map((on, i) => (
                  <button
                    key={i}
                    onClick={() => toggle(h.id, i)}
                    className={cn(
                      "h-6 w-6 rounded-md text-[10px] font-medium flex items-center justify-center border transition-colors",
                      on ? "border-transparent text-white" : "border-border text-muted-foreground"
                    )}
                    style={on ? { background: primary } : undefined}
                  >
                    {days[i]}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground text-center">
        Tap squares to mark complete. Streaks save automatically.
      </div>
    </div>
  );
}

/* ---------------- NOTES ---------------- */
function NotesApp({ primary }: { primary: string }) {
  const [notes, setNotes] = useState([
    { id: "1", title: "Q4 launch plan", body: "Finalize messaging by Fri. Lock pricing tier names." },
    { id: "2", title: "1:1 with Maya", body: "Career dev path, async preferences, blocker on payments." },
    { id: "3", title: "Reading list", body: "Inspired (Cagan), The Mom Test, Working Backwards." },
  ]);
  const [active, setActive] = useState("1");
  const [q, setQ] = useState("");
  const filtered = notes.filter((n) => n.title.toLowerCase().includes(q.toLowerCase()));
  const current = notes.find((n) => n.id === active) ?? notes[0];

  return (
    <div className="grid grid-cols-5 gap-3 h-[340px]">
      <div className="col-span-2 rounded-xl border border-border/60 bg-card overflow-hidden flex flex-col">
        <div className="p-2 border-b border-border/60">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="pl-7 h-8 text-xs" />
          </div>
        </div>
        <ul className="flex-1 overflow-auto divide-y divide-border/40">
          {filtered.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => setActive(n.id)}
                className={cn("w-full text-left p-3 hover:bg-muted/40", active === n.id && "bg-muted/60")}
                style={active === n.id ? { borderLeft: `3px solid ${primary}` } : undefined}
              >
                <div className="text-sm font-medium truncate">{n.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{n.body}</div>
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            const id = `n-${Date.now()}`;
            setNotes((p) => [{ id, title: "Untitled", body: "" }, ...p]);
            setActive(id);
          }}
          className="p-2 text-xs flex items-center justify-center gap-1 border-t border-border/60 hover:bg-muted/40"
          style={{ color: primary }}
        >
          <Plus className="h-3 w-3" /> New note
        </button>
      </div>
      <div className="col-span-3 rounded-xl border border-border/60 bg-card p-3 flex flex-col">
        <input
          value={current.title}
          onChange={(e) =>
            setNotes((p) => p.map((n) => (n.id === current.id ? { ...n, title: e.target.value } : n)))
          }
          className="text-sm font-semibold bg-transparent outline-none border-b border-border/40 pb-2"
        />
        <textarea
          value={current.body}
          onChange={(e) =>
            setNotes((p) => p.map((n) => (n.id === current.id ? { ...n, body: e.target.value } : n)))
          }
          className="flex-1 mt-2 text-sm bg-transparent outline-none resize-none"
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
}

/* ---------------- CALCULATOR ---------------- */
function CalculatorApp({ primary, accent }: { primary: string; accent: string }) {
  const [bill, setBill] = useState("84.50");
  const [tip, setTip] = useState(15);
  const [people, setPeople] = useState(3);
  const billNum = parseFloat(bill) || 0;
  const tipAmount = (billNum * tip) / 100;
  const total = billNum + tipAmount;
  const perPerson = people > 0 ? total / people : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
        <div>
          <label className="text-xs text-muted-foreground">Bill amount (€)</label>
          <Input value={bill} onChange={(e) => setBill(e.target.value)} type="number" className="mt-1" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Tip</span>
            <span>{tip}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            value={tip}
            onChange={(e) => setTip(parseInt(e.target.value))}
            className="w-full accent-current"
            style={{ color: primary }}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Split between</label>
          <div className="mt-1 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPeople((p) => Math.max(1, p - 1))}>−</Button>
            <div className="flex-1 text-center font-semibold">{people}</div>
            <Button variant="outline" size="sm" onClick={() => setPeople((p) => p + 1)}>+</Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
        <div className="text-xs opacity-80">Per person</div>
        <div className="text-3xl font-bold mt-1">€{perPerson.toFixed(2)}</div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div><div className="opacity-70">Tip</div><div className="font-semibold">€{tipAmount.toFixed(2)}</div></div>
          <div><div className="opacity-70">Total</div><div className="font-semibold">€{total.toFixed(2)}</div></div>
        </div>
      </div>
    </div>
  );
}

export function MiniApp({ app }: MiniAppProps) {
  const { theme } = useTheme();
  const type = useMemo(() => pickType(app), [app]);

  return (
    <div className="bg-muted/20 rounded-2xl p-4">
      {type === "dashboard" && <DashboardApp primary={theme.primaryColor} accent={theme.accentColor} />}
      {type === "tracker" && <TrackerApp primary={theme.primaryColor} />}
      {type === "notes" && <NotesApp primary={theme.primaryColor} />}
      {type === "calculator" && <CalculatorApp primary={theme.primaryColor} accent={theme.accentColor} />}
    </div>
  );
}

/** Tiny static preview rendered inside the My Apps card */
export function MiniAppPreview({ app }: MiniAppProps) {
  const { theme } = useTheme();
  const type = pickType(app);
  const primary = theme.primaryColor;
  const accent = theme.accentColor;

  if (type === "dashboard") {
    const bars = [40, 60, 35, 75, 50, 85, 65];
    return (
      <div className="flex items-end gap-1 h-12">
        {bars.map((v, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: `${v}%`, background: `linear-gradient(to top, ${primary}, ${accent})` }} />
        ))}
      </div>
    );
  }
  if (type === "tracker") {
    return (
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }).map((_, i) => {
          const on = (i * 7) % 3 !== 0;
          return (
            <div key={i} className="aspect-square rounded-sm" style={{ background: on ? primary : `${primary}22` }} />
          );
        })}
      </div>
    );
  }
  if (type === "notes") {
    return (
      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-muted-foreground/25 w-3/4" />
        <div className="h-2 rounded-full bg-muted-foreground/15 w-full" />
        <div className="h-2 rounded-full bg-muted-foreground/15 w-5/6" />
        <div className="h-2 rounded-full bg-muted-foreground/15 w-2/3" />
      </div>
    );
  }
  // calculator
  return (
    <div className="rounded-lg p-2 text-white text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
      <div className="text-[9px] opacity-80">Per person</div>
      <div className="text-base font-bold">€28.18</div>
    </div>
  );
}
