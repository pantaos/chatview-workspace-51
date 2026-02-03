import { 
  FileVideo, 
  FileImage, 
  FileText, 
  File, 
  Link as LinkIcon,
  Download,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LibraryItem } from "@/types/library";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface LibraryPreviewDialogProps {
  item: LibraryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (item: LibraryItem) => void;
}

const typeConfig = {
  video: { icon: FileVideo, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  image: { icon: FileImage, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  pdf: { icon: FileText, color: "text-red-500", bgColor: "bg-red-500/10" },
  word: { icon: FileText, color: "text-blue-600", bgColor: "bg-blue-600/10" },
  link: { icon: LinkIcon, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  other: { icon: File, color: "text-muted-foreground", bgColor: "bg-muted" },
};

export function LibraryPreviewDialog({ 
  item, 
  open, 
  onOpenChange, 
  onDownload 
}: LibraryPreviewDialogProps) {
  if (!item) return null;

  const config = typeConfig[item.type];
  const TypeIcon = config.icon;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderPreviewContent = () => {
    if (item.type === "image" && item.thumbnail) {
      return (
        <div className="w-full flex items-center justify-center bg-muted rounded-lg overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.name}
            className="max-w-full max-h-[400px] object-contain"
          />
        </div>
      );
    }

    if (item.type === "video") {
      return (
        <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FileVideo className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Video preview not available</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => onDownload(item)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download to view
            </Button>
          </div>
        </div>
      );
    }

    if (item.type === "link") {
      return (
        <div className="w-full py-8 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <LinkIcon className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">{item.name}</p>
            <p className="text-xs text-muted-foreground mb-4 max-w-xs truncate">{item.url}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in new tab
            </Button>
          </div>
        </div>
      );
    }

    // PDF, Word, Other
    return (
      <div className="w-full py-8 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <TypeIcon className={cn("h-16 w-16 mx-auto mb-3", config.color)} />
          <p className="text-sm text-muted-foreground mb-3">
            Preview not available for this file type
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDownload(item)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download file
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TypeIcon className={cn("h-5 w-5", config.color)} />
            <span className="truncate">{item.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          {renderPreviewContent()}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="secondary">{item.source.name}</Badge>
            <span className="text-muted-foreground">
              {formatDistanceToNow(item.createdAt, { addSuffix: true })}
            </span>
            {item.size && (
              <span className="text-muted-foreground">
                {formatFileSize(item.size)}
              </span>
            )}
          </div>

          {/* Actions */}
          {item.type !== "link" && (
            <div className="flex justify-end">
              <Button onClick={() => onDownload(item)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
