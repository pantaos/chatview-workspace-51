import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface PromptDetailDialogProps {
  open: boolean;
  onClose: () => void;
  prompt: {
    title: string;
    description: string;
    fullText: string;
    category: string;
  } | null;
  onCreateAssistant: (promptText: string) => void;
}

const PromptDetailDialog = ({ open, onClose, prompt, onCreateAssistant }: PromptDetailDialogProps) => {
  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.fullText);
    toast.success("Prompt copied to clipboard");
  };

  const handleCreateAssistant = () => {
    onCreateAssistant(prompt.fullText);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{prompt.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">{prompt.description}</p>

          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <p className="whitespace-pre-wrap text-sm">{prompt.fullText}</p>
          </ScrollArea>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleCreateAssistant}>
              Create New Assistant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDetailDialog;
