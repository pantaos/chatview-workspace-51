import { useState } from "react";
import { 
  Play, 
  Eye, 
  Download, 
  ExternalLink, 
  FileVideo, 
  FileImage, 
  FileText, 
  File, 
  Link as LinkIcon 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { LibraryItem } from "@/types/library";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LibraryCardProps {
  item: LibraryItem;
  onPreview: (item: LibraryItem) => void;
  onDownload: (item: LibraryItem) => void;
}

const typeConfig = {
  video: { 
    icon: FileVideo, 
    label: "Video" 
  },
  image: { 
    icon: FileImage, 
    label: "Image" 
  },
  pdf: { 
    icon: FileText, 
    label: "PDF" 
  },
  word: { 
    icon: FileText, 
    label: "Word" 
  },
  link: { 
    icon: LinkIcon, 
    label: "Link" 
  },
  other: { 
    icon: File, 
    label: "File" 
  },
};

export function LibraryCard({ item, onPreview, onDownload }: LibraryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = typeConfig[item.type];
  const TypeIcon = config.icon;

  const handleOpenLink = () => {
    if (item.type === "link") {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  const renderThumbnail = () => {
    if (item.type === "image" && item.thumbnail) {
      return (
        <img
          src={item.thumbnail}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      );
    }

    if (item.type === "video" && item.thumbnail) {
      return (
        <div className="relative w-full h-full">
          <img
            src={item.thumbnail}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
              <Play className="h-5 w-5 text-white ml-0.5" />
            </div>
          </div>
        </div>
      );
    }

    // Default: show icon
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <TypeIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  };

  return (
    <div
      className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-border/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Area */}
      <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden">
        {renderThumbnail()}
        
        {/* Hover Overlay with Actions */}
        <div className={cn(
          "absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onPreview(item)}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>

          {item.type !== "link" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onDownload(item)}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          )}

          {item.type === "link" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleOpenLink}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Open Link</TooltipContent>
            </Tooltip>
          )}
        </div>
      </AspectRatio>

      {/* Content Info */}
      <div className="p-2 space-y-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="text-xs font-medium text-foreground truncate cursor-default">
              {item.name}
            </h3>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            {item.name}
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center justify-between gap-1">
          <Badge 
            variant="secondary" 
            className="text-[9px] px-1 py-0 h-4 font-normal"
          >
            {item.source.name}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}
