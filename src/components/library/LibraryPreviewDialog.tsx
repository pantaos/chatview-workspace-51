import { Download, ExternalLink } from "lucide-react";
import { LibraryItem } from "@/types/library";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface LibraryPreviewDialogProps {
  item: LibraryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (item: LibraryItem) => void;
}

export function LibraryPreviewDialog({ 
  item, 
  open, 
  onOpenChange, 
  onDownload 
}: LibraryPreviewDialogProps) {
  if (!item) return null;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      video: "Video",
      image: "Image",
      pdf: "PDF",
      word: "Document",
      link: "Link",
      other: "File"
    };
    return labels[type] || "File";
  };

  const renderPreviewContent = () => {
    if (item.type === "image" && item.thumbnail) {
      return (
        <div className="w-full flex items-center justify-center bg-muted rounded-lg overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.name}
            className="max-w-full max-h-[300px] object-contain"
          />
        </div>
      );
    }

    if (item.type === "video" && item.thumbnail) {
      return (
        <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    if (item.type === "link") {
      return (
        <div className="py-4">
          <p className="text-sm text-muted-foreground break-all">{item.url}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium truncate pr-8">
            {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          {renderPreviewContent()}

          {/* Meta info */}
          <div className="space-y-3">
            <div className="h-px bg-border/50" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Type</span>
              <span className="text-foreground">{getTypeLabel(item.type)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Source</span>
              <span className="text-foreground">{item.source.name}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Created</span>
              <span className="text-foreground">
                {formatDistanceToNow(item.createdAt, { addSuffix: true })}
              </span>
            </div>
            
            {item.size && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Size</span>
                <span className="text-foreground">{formatFileSize(item.size)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2">
            {item.type === "link" ? (
              <Button 
                className="w-full" 
                onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Link
              </Button>
            ) : (
              <Button className="w-full" onClick={() => onDownload(item)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
