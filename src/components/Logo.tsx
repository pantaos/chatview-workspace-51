
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  onClick?: () => void;
  small?: boolean;
}

const Logo = ({ className, variant = "default", onClick, small = false }: LogoProps) => {
  return (
    <Link to="/dashboard" className="no-underline">
      <div 
        onClick={onClick} 
        className={cn("font-bold flex items-center cursor-pointer", 
          small ? "text-base" : "text-xl",
          className
        )}
      >
        <img 
          src="/lovable-uploads/7a507605-9b7e-466b-8f20-bb8c9e8d9c68.png" 
          alt="Panta Logo" 
          className={cn(small ? "h-7 mr-1" : "h-10 mr-2")} 
        />
        {!small && (
          <>
            <span className={cn(
              "mr-1 tracking-wider", 
              variant === "white" ? "text-white" : "text-black"
            )}>PANTA</span>
            <span className={cn(
              "font-light tracking-wider", 
              variant === "white" ? "text-white" : "text-black"
            )}>Flows</span>
          </>
        )}
      </div>
    </Link>
  );
};

export default Logo;
