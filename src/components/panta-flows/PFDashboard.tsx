import { Card } from "@/components/ui/card";
import { Building2, Users, Coins, CalendarPlus } from "lucide-react";
import { mockTenants } from "@/data/pantaFlowsData";

const PFDashboard = () => {
  const totalTenants = mockTenants.length;
  const activeTenants = mockTenants.filter(t => t.status === "active").length;
  const totalActiveUsers = mockTenants.reduce((sum, t) => sum + t.activeUsers, 0);
  const totalTokens = mockTenants.reduce((sum, t) => sum + t.tokensUsed, 0);
  const newThisMonth = mockTenants.filter(t => {
    const created = new Date(t.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { title: "Tenants", value: totalTenants.toString(), description: `${activeTenants} aktiv`, icon: Building2 },
    { title: "Aktive User", value: totalActiveUsers.toString(), description: "Über alle Tenants", icon: Users },
    { title: "Token-Nutzung", value: totalTokens.toLocaleString(), description: "Gesamt verbraucht", icon: Coins },
    { title: "Neue Tenants", value: newThisMonth.toString(), description: "Diesen Monat", icon: CalendarPlus },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.description}</div>
            </Card>
          );
        })}
      </div>

      {/* Top Tenants by usage */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Tenants nach Token-Nutzung</h3>
        <div className="space-y-3">
          {[...mockTenants]
            .sort((a, b) => b.tokensUsed - a.tokensUsed)
            .slice(0, 5)
            .map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-sm text-muted-foreground">{tenant.activeUsers} aktive User</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{tenant.tokensUsed.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">von {tenant.tokensLimit.toLocaleString()}</div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default PFDashboard;
