
import { useState } from "react";
import { cn } from "@/lib/utils";
import WorkflowMenu from "./WorkflowMenu";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { WorkflowTag } from "@/types/workflow";
import { useIsMobile } from "@/hooks/use-mobile";
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
    <div 
      className={cn(
        "workflow-card group transition-all duration-200 relative rounded-xl bg-white shadow-sm hover:shadow-md cursor-pointer border-0 h-48",
        isMobile ? "p-4" : "p-5",
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
        "workflow-icon rounded-full flex items-center justify-center mx-auto mb-3",
        isMobile ? "w-8 h-8" : "w-10 h-10"
      )}>
        <IconComponent className={cn(
          "text-blue-600",
          isMobile ? "h-4 w-4" : "h-5 w-5"
        )} />
      </div>
      
      <h3 className={cn(
        "font-semibold text-center text-gray-900 mb-2 line-clamp-1",
        isMobile ? "text-sm" : "text-base"
      )}>
        {displayTitle}
      </h3>
      
      <p className={cn(
        "text-gray-600 text-center line-clamp-2 text-xs leading-tight",
        isMobile ? "px-1" : "px-2"
      )}>
        {displayDescription}
      </p>
      
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
  );
};

export default WorkflowCard;
