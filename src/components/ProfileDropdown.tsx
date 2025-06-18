
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, LayoutDashboard, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileDropdownProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

const ProfileDropdown = ({ name, email, avatarUrl }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Mock user type - in real app this would come from auth context
  const userType = "Admin"; // This should come from user context

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="cursor-pointer border-2 border-transparent hover:border-primary transition-all h-9 w-9">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-1">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-black hover:text-white transition-colors"
          onClick={() => {
            console.log("Dashboard clicked");
            navigate('/dashboard');
          }}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-black hover:text-white transition-colors"
          onClick={() => navigate('/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-black hover:text-white transition-colors"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {(userType === "Admin" || userType === "Super Admin") && (
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-black hover:text-white transition-colors"
            onClick={() => navigate('/admin-settings')}
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Settings</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-white hover:bg-black hover:text-white transition-colors">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
