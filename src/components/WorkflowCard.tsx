
import { useState } from "react";
import { cn } from "@/lib/utils";
import WorkflowMenu from "./WorkflowMenu";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { WorkflowTag } from "@/types/workflow";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  MessageSquare, 
  Code, 
  Image, 
  FileText, 
  Video, 
  Music, 
  Bot, 
  Rss, 
  Crop, 
  GraduationCap,
  Heart
} from "lucide-react";

const iconMap = {
  MessageSquare,
  Code,
  Image,
  FileText,
  Video,
  Music,
  Bot,
  Rss,
  Crop,
  GraduationCap
};

interface WorkflowCardProps {
  title: string;
  description: string;
  icon: string;
  tags?: WorkflowTag[];
  className?: string;
  onClick?: () => void;
  translationKey?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const WorkflowCard = ({ 
  title, 
  description, 
  icon,
  tags = [],
  className,
  onClick,
  translationKey,
  isFavorite = false,
  onFavoriteToggle
}: WorkflowCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const { translate } = useLanguage();
  const isMobile = useIsMobile();
  
  const handleEdit = () => {
    toast.info(`${translate('menu.editWorkflow')}: ${title}`);
  };
  
  const handleSettings = () => {
    toast.info(`${translate('menu.workflowSettings')}: ${title}`);
  };
  
  const handleDelete = () => {
    toast.error(`${translate('menu.deleteWorkflow')}: ${title}`, {
      description: translate('menu.deleteConfirm'),
      action: {
        label: translate('menu.undoDelete'),
        onClick: () => toast.success(translate('menu.deleteCancelled'))
      }
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.();
  };

  const displayTitle = translationKey ? translate(`workflow.${translationKey}`) : title;
  const displayDescription = translationKey ? translate(`workflow.${translationKey}Desc`) : description;
  
  const IconComponent = iconMap[icon as keyof typeof iconMap] || MessageSquare;

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "workflow-card group transition-all duration-200 relative rounded-lg bg-white shadow-sm border border-gray-100 hover:border-gray-300 cursor-pointer",
          isMobile ? "p-3" : "p-4",
          className
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {!isMobile && (
          <div className={cn(
            "absolute top-2 right-2 transition-opacity flex gap-1", 
            isHovering ? "opacity-100" : "opacity-0"
          )}
            onClick={(e) => e.stopPropagation()}
          >
            {onFavoriteToggle && (
              <button
                onClick={handleFavoriteClick}
                className={cn(
                  "p-1 rounded-full transition-colors",
                  isFavorite 
                    ? "text-red-500 hover:text-red-600" 
                    : "text-gray-400 hover:text-red-500"
                )}
              >
                <Heart 
                  className="h-4 w-4" 
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
            )}
            <WorkflowMenu
              onEdit={handleEdit}
              onSettings={handleSettings}
              onDelete={handleDelete}
            />
          </div>
        )}

        {isMobile && onFavoriteToggle && (
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-2 right-2 p-1 rounded-full transition-colors",
              isFavorite 
                ? "text-red-500" 
                : "text-gray-400"
            )}
          >
            <Heart 
              className="h-3 w-3" 
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        )}
        
        <div className={cn(
          "workflow-icon bg-gray-200 rounded-full group-hover:bg-black group-hover:text-white transition-colors duration-200 flex items-center justify-center",
          isMobile ? "p-2 mb-2 w-8 h-8" : "p-4 mb-3"
        )}>
          <IconComponent className={cn(
            "text-gray-600 group-hover:text-white",
            isMobile ? "h-4 w-4" : "h-6 w-6"
          )} />
        </div>
        
        <h3 className={cn(
          "font-medium text-center group-hover:text-black mb-1",
          isMobile ? "text-xs leading-tight" : "text-sm"
        )}>
          {displayTitle}
        </h3>
        
        {!isMobile && displayDescription.length > 50 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <p className={cn(
                "text-gray-500 text-center mt-1 line-clamp-2 group-hover:text-gray-700 cursor-help",
                "text-xs mb-3"
              )}>
                {displayDescription}
              </p>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="max-w-xs text-left p-2 bg-gray-900 text-white border-0"
              sideOffset={10}
            >
              <p className="text-sm text-left">{displayDescription}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <p className={cn(
            "text-gray-500 text-center mt-1 line-clamp-2 group-hover:text-gray-700",
            isMobile ? "text-xs mb-2" : "text-xs mb-3"
          )}>
            {isMobile ? displayTitle : displayDescription}
          </p>
        )}
        
        {tags.length > 0 && !isMobile && (
          <div className="flex flex-wrap gap-1 justify-center">
            {tags.map((tag) => (
              <Badge 
                key={tag.id} 
                variant="secondary" 
                className="text-xs px-2 py-0.5"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default WorkflowCard;
