import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import { UploadStep } from "@/components/app-builder/UploadStep";
import { DetailsStep } from "@/components/app-builder/DetailsStep";
import { ReviewStep } from "@/components/app-builder/ReviewStep";
import { PreviewStep } from "@/components/app-builder/PreviewStep";
import { templateTags } from "@/data/templates";
import { DEMO_TEMPLATES, DemoAppType } from "@/data/communityApps";
import { toast } from "sonner";

const STEPS = ["Upload", "Details", "AI Review", "Preview"] as const;

export default function AppBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [file, setFile] = useState<File | null>(null);
  const [demoActive, setDemoActive] = useState(false);
  const [demoType, setDemoType] = useState<DemoAppType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [icon, setIcon] = useState("Sparkles");
  const [reviewDone, setReviewDone] = useState(false);

  const useDemo = () => {
    const sample = DEMO_TEMPLATES[Math.floor(Math.random() * DEMO_TEMPLATES.length)];
    setDemoActive(true);
    setDemoType(sample.type);
    setTitle(sample.title);
    setDescription(sample.description);
    setIcon(sample.icon);
    setSelectedTagIds([sample.tagId]);
    toast.success("Demo data loaded", { description: `Sample app "${sample.title}" prefilled.` });
  };

  const canNext =
    (step === 0 && (!!file || demoActive)) ||
    (step === 1 && title.trim().length > 1 && description.trim().length > 1) ||
    (step === 2 && reviewDone) ||
    step === 3;

  const handleSubmit = () => {
    const tags = templateTags.filter((t) => selectedTagIds.includes(t.id));
    const submission = {
      id: `ca-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      icon,
      tags,
      submittedBy: "You",
      submittedAt: new Date().toISOString(),
      status: "pending" as const,
      fileName: file?.name ?? (demoActive ? "demo-app.zip" : "app.zip"),
      reviewSummary: {
        framework: "React + Vite",
        hasBackend: true,
        detectedColors: ["#5673eb"],
        standardized: true,
      },
      ...(demoType ? { demoType } : {}),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("communityApps") || "[]");
      localStorage.setItem("communityApps", JSON.stringify([submission, ...existing]));
    } catch {
      localStorage.setItem("communityApps", JSON.stringify([submission]));
    }
    toast.success("Submitted for approval", {
      description: "A Super Admin will review your app shortly.",
    });
    navigate("/my-apps");
  };

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto py-8 px-4 md:px-6 pb-32 md:pb-12">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary mb-3">
              <Sparkles className="h-3 w-3" />
              Build an App
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ship your vibe-coded app</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Upload a ZIP, let AI standardize it, and submit it to the platform App Store.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>
                Step {step + 1} of {STEPS.length} · {STEPS[step]}
              </span>
              <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
            </div>
            <Progress value={((step + 1) / STEPS.length) * 100} className="h-1.5" />
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-6">
            {step === 0 && <UploadStep file={file} onFileChange={setFile} onUseDemo={useDemo} demoActive={demoActive} />}
            {step === 1 && (
              <DetailsStep
                title={title}
                description={description}
                selectedTagIds={selectedTagIds}
                icon={icon}
                onChange={(patch) => {
                  if (patch.title !== undefined) setTitle(patch.title);
                  if (patch.description !== undefined) setDescription(patch.description);
                  if (patch.selectedTagIds !== undefined) setSelectedTagIds(patch.selectedTagIds);
                  if (patch.icon !== undefined) setIcon(patch.icon);
                }}
              />
            )}
            {step === 2 && <ReviewStep onComplete={() => setReviewDone(true)} />}
            {step === 3 && <PreviewStep title={title} description={description} icon={icon} />}
          </div>

          <div className="fixed bottom-0 left-0 right-0 md:static md:mt-6 bg-background/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t md:border-0 border-border/60 px-4 py-3 md:p-0 flex gap-2 justify-between">
            <Button
              variant="outline"
              onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))}
              className="min-h-11"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="min-h-11">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="min-h-11">
                <Check className="h-4 w-4 mr-1" />
                Submit for approval
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
