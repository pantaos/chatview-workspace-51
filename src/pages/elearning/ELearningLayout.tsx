import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LayoutDashboard, BookOpen, Megaphone, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRole, setRole as persistRole, Role } from "@/data/elearningData";

interface Props {
  children: ReactNode;
}

export default function ELearningLayout({ children }: Props) {
  const [role, setRoleState] = useState<Role>("student");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setRoleState(getRole());
  }, []);

  const handleRoleChange = (r: Role) => {
    persistRole(r);
    setRoleState(r);
    if (r === "student" && location.pathname.startsWith("/elearning/manage")) {
      navigate("/elearning");
    }
  };

  const tabs = [
    { to: "/elearning", label: "Dashboard", icon: LayoutDashboard },
    { to: "/elearning/modules", label: "Modules", icon: BookOpen },
    { to: "/elearning/announcements", label: "Announcements", icon: Megaphone },
    ...(role === "instructor"
      ? [{ to: "/elearning/manage", label: "Manage", icon: Settings2 }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      <header className="border-b bg-white">
        <div className="container max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/elearning" className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span>LearnFlow</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Role</span>
            <Select value={role} onValueChange={(v) => handleRoleChange(v as Role)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <nav className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-1 overflow-x-auto -mb-px">
            {tabs.map((t) => {
              const active =
                t.to === "/elearning"
                  ? location.pathname === "/elearning"
                  : location.pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <main className="container max-w-6xl mx-auto px-4 md:px-6 py-8">{children}</main>
    </div>
  );
}
