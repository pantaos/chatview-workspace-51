import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, X } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.fullText);
    toast.success("Prompt copied to clipboard");
  };

  const handleCreateAssistant = () => {
    onCreateAssistant(prompt.fullText);
    onClose();
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-4 md:p-6 flex-1">
        <p className="text-muted-foreground">{prompt.description}</p>

        <ScrollArea className="h-[250px] md:h-[300px] w-full rounded-md border p-4">
          <p className="whitespace-pre-wrap text-sm">{prompt.fullText}</p>
        </ScrollArea>
      </div>

      <div className="flex gap-2 justify-end p-4 md:p-6 border-t bg-background sticky bottom-0">
        <Button variant="outline" onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button onClick={handleCreateAssistant}>
          Create New Assistant
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="h-[90vh] max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
            <h2 className="text-base font-semibold truncate pr-4">{prompt.title}</h2>
            <button 
              onClick={onClose}
              className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{prompt.title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default PromptDetailDialog;
