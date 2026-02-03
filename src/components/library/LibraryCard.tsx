import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Play, 
  Eye, 
  Download, 
  ExternalLink, 
  FileVideo, 
  FileImage, 
  FileText, 
  File, 
  Link as LinkIcon,
  MoreHorizontal,
  MessageSquare,
  FolderPlus,
  Trash2
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockProjects } from "@/data/libraryData";
import { toast } from "@/hooks/use-toast";

interface LibraryCardProps {
  item: LibraryItem;
  onPreview: (item: LibraryItem) => void;
  onDownload: (item: LibraryItem) => void;
  onDelete: (item: LibraryItem) => void;
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

export function LibraryCard({ item, onPreview, onDownload, onDelete }: LibraryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const config = typeConfig[item.type];
  const TypeIcon = config.icon;

  const handleOpenLink = () => {
    if (item.type === "link") {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleChat = () => {
    navigate("/", { 
      state: { 
        attachedFile: {
          name: item.name,
          url: item.url,
          type: item.mimeType || item.type
        }
      }
    });
  };

  const handleAddToProject = (projectId: string, projectName: string) => {
    toast({
      title: "Added to project",
      description: `${item.name} has been added to ${projectName}.`,
    });
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
      {/* 3-dot Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className={cn(
              "absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-opacity",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add to Project
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {mockProjects.map((project) => (
                <DropdownMenuItem 
                  key={project.id}
                  onClick={() => handleAddToProject(project.id, project.name)}
                >
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuItem onClick={handleChat}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </DropdownMenuItem>
          
          {item.type !== "link" ? (
            <DropdownMenuItem onClick={() => onDownload(item)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleOpenLink}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Link
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => onDelete(item)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Thumbnail Area */}
      <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden cursor-pointer" onClick={() => onPreview(item)}>
        {renderThumbnail()}
        
        {/* Hover Overlay with Preview */}
        <div className={cn(
          "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(item);
                }}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
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
