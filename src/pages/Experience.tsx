import React, { useState, useRef } from "react";
import { ArrowRight, ArrowLeft, MessageSquare, Bot, Workflow, CheckCircle, Sparkles, FileText, Eye, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hdiWorkflowSteps } from "@/data/hdiWorkflowDemo";
import { cn } from "@/lib/utils";

const stepTypeConfig = {
  input: { icon: FileText, label: "Eingabe", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  "ai-processing": { icon: Sparkles, label: "KI-Verarbeitung", color: "bg-violet-500/10 text-violet-600 border-violet-200" },
  preview: { icon: Eye, label: "Vorschau", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  approval: { icon: CheckCircle, label: "Freigabe", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
};

const pillars = [
  {
    icon: MessageSquare,
    title: "Chat",
    subtitle: "Flexible, sichere KI für den Arbeitsalltag",
    bullets: ["Multi-Model & Websuche", "Datei-Upload & Analyse", "DSGVO-konform"],
  },
  {
    icon: Bot,
    title: "Assistenten",
    subtitle: "Rollen- & aufgabenspezifische KI",
    bullets: ["Wissensdatenbank", "Team-Sharing", "Custom Prompts"],
  },
  {
    icon: Workflow,
    title: "Apps",
    subtitle: "End-to-End Business Process Engines",
    bullets: ["Review-Schritte & Übergaben", "Approval Gates", "Automatisierte Workflows"],
  },
];

const integrations = [
  "Microsoft 365", "Google Workspace", "Notion", "Slack",
  "OpenAI", "Anthropic", "HeyGen", "ElevenLabs",
];

const Experience = () => {
  const [activeStep, setActiveStep] = useState(0);
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentStep = hdiWorkflowSteps[activeStep];
  const StepIcon = stepTypeConfig[currentStep.type].icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent/60" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-36 text-center">
          <img src="/panta-logo.png" alt="PANTA" className="h-10 mx-auto mb-8 brightness-0 invert" />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Die Enterprise-KI-Plattform
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Strukturiert. Skalierbar. DSGVO-konform.
          </p>
          <Button
            size="lg"
            onClick={scrollToDemo}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-base rounded-full shadow-lg"
          >
            Workflow-Demo starten
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Pillars */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          Eine Plattform. Drei Bausteine.
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Alles was Ihr Unternehmen für den KI-Einsatz braucht — in einer einzigen Plattform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{p.subtitle}</p>
              <ul className="space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* HDI Workflow Demo */}
      <section ref={demoRef} className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-xs font-medium">
            Live Demo
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            HDI Content-Workflow
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Erleben Sie einen echten 7-Schritte-Workflow: Von der Themenauswahl bis zum fertigen Artikel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {/* Step list */}
          <div className="hidden md:flex flex-col gap-1">
            {hdiWorkflowSteps.map((step, i) => {
              const config = stepTypeConfig[step.type];
              const Icon = config.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(i)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                    activeStep === i
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors",
                    activeStep === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {step.id}
                  </div>
                  <span className={cn(
                    "text-sm font-medium truncate",
                    activeStep === i ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile step dots */}
          <div className="flex md:hidden justify-center gap-2 mb-4">
            {hdiWorkflowSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={cn(
                  "w-8 h-8 rounded-full text-xs font-bold transition-all",
                  activeStep === i
                    ? "bg-primary text-primary-foreground scale-110"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 min-h-[400px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <StepIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Schritt {currentStep.id}: {currentStep.title}
                </h3>
                <p className="text-xs text-muted-foreground">{currentStep.description}</p>
              </div>
              <Badge variant="outline" className={cn("text-[10px] shrink-0", stepTypeConfig[currentStep.type].color)}>
                {stepTypeConfig[currentStep.type].label}
              </Badge>
            </div>

            <div className="flex-1 space-y-4">
              {currentStep.content.map((text, i) => (
                <p key={i} className={cn(
                  "text-sm leading-relaxed",
                  i === 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                )}>
                  {text}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => s - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Zurück
              </Button>
              <span className="text-xs text-muted-foreground">
                {activeStep + 1} / {hdiWorkflowSteps.length}
              </span>
              <Button
                size="sm"
                disabled={activeStep === hdiWorkflowSteps.length - 1}
                onClick={() => setActiveStep((s) => s + 1)}
              >
                Weiter
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {integrations.map((name) => (
              <Badge key={name} variant="secondary" className="text-xs font-normal">
                {name}
              </Badge>
            ))}
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              hello@pantaos.com · <a href="https://www.pantaos.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">www.pantaos.com</a>
            </p>
            <a href="/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              Zurück zur App <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Experience;
