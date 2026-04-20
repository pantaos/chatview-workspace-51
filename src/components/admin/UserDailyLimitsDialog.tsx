import { useState } from "react";
import { ResponsiveDialog, ResponsiveDialogContent } from "@/components/ui/responsive-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { UserDailyLimit } from "@/types/admin";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: UserDailyLimit[];
  defaultLimit: number;
}

const UserDailyLimitsDialog = ({ open, onOpenChange, users: initial, defaultLimit }: Props) => {
  const [users, setUsers] = useState(initial);
  const [query, setQuery] = useState("");

  const filtered = users.filter(u =>
    u.userName.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  const updateLimit = (userId: string, limit: number) => {
    setUsers(prev => prev.map(u => u.userId === userId ? { ...u, limit, isOverride: limit !== defaultLimit } : u));
  };

  const resetUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.userId === userId ? { ...u, limit: defaultLimit, isOverride: false } : u));
    toast.success("Reset to default");
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} title="User Daily Limit Overrides">
      <ResponsiveDialogContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="space-y-1">
          {filtered.map(u => (
            <div key={u.userId} className="flex items-center justify-between gap-3 py-2.5 border-b border-border/40">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{u.userName}</div>
                <div className="text-xs text-muted-foreground truncate">{u.email}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Input
                  type="number"
                  value={u.limit}
                  onChange={e => updateLimit(u.userId, Number(e.target.value))}
                  className="w-32 h-8 text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => resetUser(u.userId)}
                  disabled={!u.isOverride}
                  title="Reset to default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">No users found</div>
          )}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default UserDailyLimitsDialog;
