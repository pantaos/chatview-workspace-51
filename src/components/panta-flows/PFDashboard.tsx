import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Coins, CalendarPlus, TrendingUp, TrendingDown, Minus, Download } from "lucide-react";
import { mockTenants } from "@/data/pantaFlowsData";
import { toast } from "sonner";

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
    { title: "Tenants", value: totalTenants.toString(), description: `${activeTenants} aktiv`, icon: Building2, trend: 8.3 },
    { title: "Aktive User", value: totalActiveUsers.toString(), description: "Über alle Tenants", icon: Users, trend: 12.5 },
    { title: "Token-Nutzung", value: totalTokens.toLocaleString(), description: "Gesamt verbraucht", icon: Coins, trend: -3.2 },
    { title: "Neue Tenants", value: newThisMonth.toString(), description: "Diesen Monat", icon: CalendarPlus, trend: 0 },
  ];

  const handleDownloadCSV = () => {
    const headers = ["Tenant", "Status", "Total Users", "Active Users", "Tokens Used", "Tokens Limit", "Created At"];
    const rows = mockTenants.map(t => [
      t.name, t.status, t.totalUsers, t.activeUsers, t.tokensUsed, t.tokensLimit, t.createdAt
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `panta-flows-metrics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV heruntergeladen");
  };

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
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">{stat.description}</span>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : stat.trend < 0 ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground'}`}>
                  {stat.trend > 0 ? <TrendingUp className="h-3 w-3" /> : stat.trend < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                  {stat.trend > 0 ? '+' : ''}{stat.trend}%
                </span>
              </div>
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
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={handleDownloadCSV}>
          <Download className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">CSV Export</span>
        </Button>
      </div>
    </div>
  );
};

export default PFDashboard;
