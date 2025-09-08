
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Coins, Workflow, Bot, TrendingUp, ArrowUpRight, Calendar, Activity, Crown, BarChart3, MessageSquare, Clock } from "lucide-react";
import { AdminStats } from "@/types/admin";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
    newUsersThisMonth: 12,
    totalQueriesSent: 12847,
    hoursSaved: 3294
  };

  // Mock data for charts
  const tokenUsageByUser = [
    { name: 'John Smith', tokens: 4500, percentage: 20 },
    { name: 'Sarah Johnson', tokens: 3800, percentage: 17 },
    { name: 'Mike Chen', tokens: 3200, percentage: 14 },
    { name: 'Emma Wilson', tokens: 2900, percentage: 13 },
    { name: 'David Brown', tokens: 2400, percentage: 11 },
    { name: 'Lisa Garcia', tokens: 2100, percentage: 9 },
    { name: 'Others', tokens: 3630, percentage: 16 }
  ];

  const tokenUsageByOrg = [
    { name: 'Engineering', tokens: 15600, trend: '+12%' },
    { name: 'Marketing', tokens: 12400, trend: '+8%' },
    { name: 'Sales', tokens: 8900, trend: '+15%' },
    { name: 'Support', tokens: 5200, trend: '+5%' },
    { name: 'HR', tokens: 3130, trend: '+3%' }
  ];

  const topAssistants = [
    { name: 'Content Writer', usage: 8900, requests: 456, color: 'hsl(var(--primary))' },
    { name: 'Code Helper', usage: 7200, requests: 382, color: 'hsl(var(--primary))' },
    { name: 'Data Analyst', usage: 6400, requests: 298, color: 'hsl(280, 65%, 55%)' }
  ];

  const dailyLogins = [
    { date: '2024-01-01', logins: 42 },
    { date: '2024-01-02', logins: 38 },
    { date: '2024-01-03', logins: 45 },
    { date: '2024-01-04', logins: 52 },
    { date: '2024-01-05', logins: 48 },
    { date: '2024-01-06', logins: 35 },
    { date: '2024-01-07', logins: 29 },
    { date: '2024-01-08', logins: 56 },
    { date: '2024-01-09', logins: 62 },
    { date: '2024-01-10', logins: 58 },
    { date: '2024-01-11', logins: 65 },
    { date: '2024-01-12', logins: 71 },
    { date: '2024-01-13', logins: 68 },
    { date: '2024-01-14', logins: 45 }
  ];

  const chartConfig = {
    tokens: {
      label: "Tokens",
      color: "hsl(var(--primary))",
    },
    usage: {
      label: "Usage",
      color: "hsl(var(--chart-1))",
    },
    logins: {
      label: "Daily Logins",
      color: "hsl(var(--primary))",
    },
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
      value: null,
      description: "Limit: 60,000",
      icon: Coins,
      gradient: "from-yellow-500 to-orange-500",
      customContent: (
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary opacity-100"></div>
          <div className="w-3 h-3 rounded-full bg-primary opacity-75 -ml-1"></div>
          <div className="w-3 h-3 rounded-full bg-primary opacity-50 -ml-1"></div>
          <div className="w-3 h-3 rounded-full bg-primary opacity-25 -ml-1"></div>
        </div>
      )
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
    },
    {
      title: "Total Queries",
      value: stats.totalQueriesSent.toLocaleString(),
      description: "Queries sent",
      icon: MessageSquare,
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Usage insights from your workspace</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 text-sm border rounded-lg bg-background">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <div className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg bg-background">
            <Calendar className="w-4 h-4" />
            <span>Dec 10 - Jan 08</span>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={stat.onClick}
            >
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  {stat.customContent ? (
                    <div className="mb-2">{stat.customContent}</div>
                  ) : (
                    <div className="text-3xl font-bold">{stat.value}</div>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">{stat.description}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Token Usage by User */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Token Usage by User</h3>
            <p className="text-sm text-muted-foreground">Compare token consumption across different users</p>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tokenUsageByUser} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [`${value.toLocaleString()} tokens`, 'Usage']}
              />
              <Bar 
                dataKey="tokens" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      {/* Token Usage by Team */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Token Usage by Team</h3>
            <p className="text-sm text-muted-foreground">Team usage with growth trends</p>
          </div>
        </div>
        <div className="space-y-4">
          {tokenUsageByOrg.map((org, index) => (
            <div key={org.name} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
              <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: `hsl(${220 + index * 40}, 65%, 55%)` }} />
              <div>
                <div className="font-medium">{org.name}</div>
                <div className="text-sm text-muted-foreground">{org.tokens.toLocaleString()} tokens used</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Logins */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Daily Logins</h3>
            <p className="text-sm text-muted-foreground">User engagement trends over the past 2 weeks</p>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyLogins} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="loginGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
                formatter={(value) => [`${value} logins`, 'Daily Logins']}
              />
              <Area
                type="monotone"
                dataKey="logins"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#loginGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      {/* Top Assistants by Usage */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Top Assistants by Usage</h3>
            <p className="text-sm text-muted-foreground">Most popular AI assistants ranked by token consumption</p>
          </div>
        </div>
        <div className="space-y-4">
          {topAssistants.map((assistant, index) => (
            <div key={assistant.name} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-medium">{assistant.name}</div>
                  <div className="text-sm text-muted-foreground">{assistant.requests} requests</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{assistant.usage.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">tokens</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
          <p className="text-sm text-muted-foreground">Common administrative tasks</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={onNavigateToUsers}
              className="p-4 text-left bg-primary/5 hover:bg-primary/10 rounded-lg transition-all duration-200 border border-primary/20 hover:border-primary/30 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <div className="font-medium">Manage Users</div>
              </div>
              <div className="text-sm text-muted-foreground">Add, edit, or remove users</div>
            </button>

            <button className="p-4 text-left bg-muted/20 hover:bg-muted/30 rounded-lg transition-all duration-200 border border-border hover:border-border/60 group">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-foreground" />
                <div className="font-medium">Analytics Export</div>
              </div>
              <div className="text-sm text-muted-foreground">Download usage reports</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
