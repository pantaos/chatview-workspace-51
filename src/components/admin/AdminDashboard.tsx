
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Zap, Workflow, Bot, TrendingUp, ArrowUpRight } from "lucide-react";
import { AdminStats } from "@/types/admin";

interface AdminDashboardProps {
  onNavigateToUsers: () => void;
}

const AdminDashboard = ({ onNavigateToUsers }: AdminDashboardProps) => {
  // Mock data - in real app this would come from API
  const stats: AdminStats = {
    totalUsers: 147,
    totalTokensUsed: 45230,
    totalWorkflows: 23,
    totalAssistants: 8,
    activeUsers: 89,
    newUsersThisMonth: 12
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      description: `${stats.activeUsers} active users`,
      icon: Users,
      clickable: true,
      onClick: onNavigateToUsers,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Tokens Used",
      value: stats.totalTokensUsed.toLocaleString(),
      description: "Across all users",
      icon: Zap,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Workflows",
      value: stats.totalWorkflows.toString(),
      description: "Active workflows",
      icon: Workflow,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Assistants",
      value: stats.totalAssistants.toString(),
      description: "AI assistants",
      icon: Bot,
      gradient: "from-purple-500 to-violet-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor your platform's performance and usage</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                stat.clickable ? 'cursor-pointer hover:scale-105' : ''
              }`}
              onClick={stat.onClick}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full bg-gradient-to-br ${stat.gradient}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  {stat.clickable && (
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-sm">New users this month</span>
                <span className="font-semibold text-green-600">+{stats.newUsersThisMonth}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-sm">Active workflows</span>
                <span className="font-semibold">{stats.totalWorkflows}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Total assistants</span>
                <span className="font-semibold">{stats.totalAssistants}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button 
                onClick={onNavigateToUsers}
                className="w-full p-3 text-left bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
              >
                <div className="font-medium">Manage Users</div>
                <div className="text-sm text-muted-foreground">Add, edit, or remove users</div>
              </button>
              <button className="w-full p-3 text-left bg-accent/50 hover:bg-accent/70 rounded-lg transition-colors">
                <div className="font-medium">System Settings</div>
                <div className="text-sm text-muted-foreground">Configure application settings</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
