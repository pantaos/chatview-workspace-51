
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Image, Mic, Video, Zap, TrendingUp, Calendar } from "lucide-react";
import { AIModel, CreditUsage } from "@/types/admin";

const AdminCreditUsage = () => {
  // Mock data - in real app this would come from API
  const creditUsage: CreditUsage = {
    totalCreditsAvailable: 10000,
    totalCreditsUsed: 6742,
    creditsRemaining: 3258,
    usageByModel: [
      {
        id: "1",
        name: "GPT-4",
        description: "Advanced language model for complex tasks",
        creditsPerRequest: 20,
        totalRequests: 234,
        totalCreditsUsed: 4680,
        icon: "bot",
        category: "Text"
      },
      {
        id: "2",
        name: "Claude-3",
        description: "Anthropic's powerful AI assistant",
        creditsPerRequest: 15,
        totalRequests: 89,
        totalCreditsUsed: 1335,
        icon: "bot",
        category: "Text"
      },
      {
        id: "3",
        name: "DALL-E 3",
        description: "Advanced image generation model",
        creditsPerRequest: 25,
        totalRequests: 18,
        totalCreditsUsed: 450,
        icon: "image",
        category: "Image"
      },
      {
        id: "4",
        name: "Whisper",
        description: "Speech-to-text transcription",
        creditsPerRequest: 5,
        totalRequests: 34,
        totalCreditsUsed: 170,
        icon: "mic",
        category: "Audio"
      },
      {
        id: "5",
        name: "Video AI",
        description: "Video processing and analysis",
        creditsPerRequest: 50,
        totalRequests: 2,
        totalCreditsUsed: 100,
        icon: "video",
        category: "Video"
      }
    ],
    usageByPeriod: [
      { period: "This Week", credits: 890 },
      { period: "Last Week", credits: 1240 },
      { period: "This Month", credits: 4320 },
      { period: "Last Month", credits: 2422 }
    ]
  };

  const getModelIcon = (iconType: string) => {
    const iconMap = {
      bot: Bot,
      image: Image,
      mic: Mic,
      video: Video
    };
    return iconMap[iconType as keyof typeof iconMap] || Bot;
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      Text: "from-blue-500 to-blue-600",
      Image: "from-green-500 to-green-600",
      Audio: "from-purple-500 to-purple-600",
      Video: "from-orange-500 to-orange-600"
    };
    return colorMap[category as keyof typeof colorMap] || "from-gray-500 to-gray-600";
  };

  const usagePercentage = (creditUsage.totalCreditsUsed / creditUsage.totalCreditsAvailable) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Credit Usage Dashboard</h2>
        <p className="text-muted-foreground">Monitor AI model usage and credit consumption</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditUsage.totalCreditsAvailable.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={usagePercentage} className="flex-1" />
              <span className="text-sm text-muted-foreground">{usagePercentage.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Credits Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{creditUsage.totalCreditsUsed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Credits Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{creditUsage.creditsRemaining.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for use</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage by Period */}
      <Card>
        <CardHeader>
          <CardTitle>Usage by Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {creditUsage.usageByPeriod.map((period) => (
              <div key={period.period} className="text-center p-4 border rounded-lg">
                <div className="text-lg font-semibold">{period.credits.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{period.period}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Models Usage */}
      <div>
        <h3 className="text-lg font-semibold mb-4">AI Models Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creditUsage.usageByModel.map((model) => {
            const Icon = getModelIcon(model.icon);
            const usagePercentage = (model.totalCreditsUsed / creditUsage.totalCreditsUsed) * 100;
            
            return (
              <Card key={model.id} className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(model.category)} opacity-5`} />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-gradient-to-br ${getCategoryColor(model.category)}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {model.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Credits per request:</span>
                      <span className="font-medium">{model.creditsPerRequest}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Total requests:</span>
                      <span className="font-medium">{model.totalRequests.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Credits used:</span>
                      <span className="font-bold text-primary">{model.totalCreditsUsed.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Progress value={usagePercentage} className="flex-1" />
                      <span className="text-xs text-muted-foreground">{usagePercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminCreditUsage;
