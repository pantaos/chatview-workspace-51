
import { useState } from "react";
import { cn } from "@/lib/utils";
import WorkflowMenu from "./WorkflowMenu";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { WorkflowTag } from "@/types/workflow";
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
  GraduationCap 
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
}

const WorkflowCard = ({ 
  title, 
  description, 
  icon,
  tags = [],
  className,
  onClick,
  translationKey
}: WorkflowCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const { translate } = useLanguage();
  
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

  const displayTitle = translationKey ? translate(`workflow.${translationKey}`) : title;
  const displayDescription = translationKey ? translate(`workflow.${translationKey}Desc`) : description;
  
  const IconComponent = iconMap[icon as keyof typeof iconMap] || MessageSquare;

  return (
    <div 
      className={cn(
        "workflow-card group transition-all duration-200 relative p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:border-gray-300", 
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={cn(
        "absolute top-2 right-2 transition-opacity", 
        isHovering ? "opacity-100" : "opacity-0"
      )}
        onClick={(e) => e.stopPropagation()}
      >
        <WorkflowMenu
          onEdit={handleEdit}
          onSettings={handleSettings}
          onDelete={handleDelete}
        />
      </div>
      
      <div className="workflow-icon bg-gray-200 p-4 rounded-full mb-3 group-hover:bg-black group-hover:text-white transition-colors duration-200">
        <IconComponent className="h-6 w-6 text-gray-600 group-hover:text-white" />
      </div>
      
      <h3 className="font-medium text-sm text-center group-hover:text-black mb-1">{displayTitle}</h3>
      <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2 group-hover:text-gray-700 mb-3">{displayDescription}</p>
      
      {tags.length > 0 && (
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
