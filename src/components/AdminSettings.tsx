
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Settings, Users, Database } from "lucide-react";

interface AdminSettingsProps {
  userType: string;
}

const AdminSettings = ({ userType }: AdminSettingsProps) => {
  // Only show admin settings for admin users
  if (userType !== "Admin" && userType !== "Super Admin") {
    return null;
  }

  return (
    <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <Shield className="w-5 h-5" />
          </div>
          Admin Settings
          <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20">
            {userType}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5">
            <Users className="w-6 h-6 text-primary" />
            <span className="font-medium">User Management</span>
            <span className="text-xs text-muted-foreground">Manage users and permissions</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5">
            <Settings className="w-6 h-6 text-primary" />
            <span className="font-medium">System Settings</span>
            <span className="text-xs text-muted-foreground">Configure application settings</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5">
            <Database className="w-6 h-6 text-primary" />
            <span className="font-medium">Data Management</span>
            <span className="text-xs text-muted-foreground">Manage data and backups</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
