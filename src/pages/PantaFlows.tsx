import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MainLayout from "@/components/MainLayout";
import PFDashboard from "@/components/panta-flows/PFDashboard";
import PFTenants from "@/components/panta-flows/PFTenants";
import PFAssistantsWorkflows from "@/components/panta-flows/PFAssistantsWorkflows";
import PFCommunityPosts from "@/components/panta-flows/PFCommunityPosts";
import PFKonfiguration from "@/components/panta-flows/PFKonfiguration";

const PantaFlows = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", shortLabel: "Dashboard" },
    { id: "tenants", label: "Tenants", shortLabel: "Tenants" },
    { id: "assistants", label: "Assistenten & Workflows", shortLabel: "Apps" },
    { id: "config", label: "Konfiguration", shortLabel: "Konfig." },
    { id: "posts", label: "Community Posts", shortLabel: "Posts" },
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-6xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">PANTA Flows</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Plattform-Management — Tenants, Assistenten & Community</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex overflow-x-auto scrollbar-hide bg-transparent border-b border-border rounded-none p-0 h-auto mb-6 md:mb-8 w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 md:px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary whitespace-nowrap min-h-[44px]"
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard" className="mt-0"><PFDashboard /></TabsContent>
          <TabsContent value="tenants" className="mt-0"><PFTenants /></TabsContent>
          <TabsContent value="assistants" className="mt-0"><PFAssistantsWorkflows /></TabsContent>
          <TabsContent value="config" className="mt-0"><PFKonfiguration /></TabsContent>
          <TabsContent value="posts" className="mt-0"><PFCommunityPosts /></TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PantaFlows;
