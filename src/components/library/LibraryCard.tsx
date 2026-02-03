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
    color: "text-purple-500", 
    bgColor: "bg-purple-500/10",
    label: "Video" 
  },
  image: { 
    icon: FileImage, 
    color: "text-blue-500", 
    bgColor: "bg-blue-500/10",
    label: "Image" 
  },
  pdf: { 
    icon: FileText, 
    color: "text-red-500", 
    bgColor: "bg-red-500/10",
    label: "PDF" 
  },
  word: { 
    icon: FileText, 
    color: "text-blue-600", 
    bgColor: "bg-blue-600/10",
    label: "Word" 
  },
  link: { 
    icon: LinkIcon, 
    color: "text-emerald-500", 
    bgColor: "bg-emerald-500/10",
    label: "Link" 
  },
  other: { 
    icon: File, 
    color: "text-muted-foreground", 
    bgColor: "bg-muted",
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
      <div className={cn(
        "w-full h-full flex items-center justify-center",
        config.bgColor
      )}>
        <TypeIcon className={cn("h-12 w-12", config.color)} />
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
      <div className="p-3 space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="text-sm font-medium text-foreground truncate cursor-default">
              {item.name}
            </h3>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            {item.name}
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center justify-between gap-2">
          <Badge 
            variant="secondary" 
            className="text-[10px] px-1.5 py-0 h-5 font-normal"
          >
            {item.source.name}
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}
