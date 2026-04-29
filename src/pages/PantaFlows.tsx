import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MainLayout from "@/components/MainLayout";
import PFDashboard from "@/components/panta-flows/PFDashboard";
import PFTenants from "@/components/panta-flows/PFTenants";
import PFAssistantsWorkflows from "@/components/panta-flows/PFAssistantsWorkflows";
import PFCommunityPosts from "@/components/panta-flows/PFCommunityPosts";
import PFKonfiguration from "@/components/panta-flows/PFKonfiguration";
import PFTemplateStore from "@/components/panta-flows/PFTemplateStore";

const PantaFlows = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", shortLabel: "Dashboard" },
    { id: "tenants", label: "Tenants", shortLabel: "Tenants" },
    { id: "assistants", label: "Assistenten & Workflows", shortLabel: "Apps" },
    { id: "templates", label: "Template Store", shortLabel: "Templates" },
    { id: "config", label: "Konfiguration", shortLabel: "Konfig." },
    { id: "posts", label: "Community Posts", shortLabel: "Posts" },
  ];

  return (
    <MainLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
          <div className="px-4 md:px-8 pt-4 md:pt-6 max-w-6xl">
            <div className="mb-3">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground leading-tight">PANTA Flows</h1>
              <p className="text-muted-foreground mt-0.5 text-xs md:text-sm">Plattform-Management — Tenants, Assistenten & Community</p>
            </div>
            <TabsList className="flex overflow-x-auto scrollbar-hide bg-transparent rounded-none p-0 h-auto w-full justify-start -mb-px">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 md:px-4 pb-2.5 pt-0 text-sm text-muted-foreground data-[state=active]:text-primary whitespace-nowrap min-h-[40px]"
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-6xl">
          <TabsContent value="dashboard" className="mt-0"><PFDashboard /></TabsContent>
          <TabsContent value="tenants" className="mt-0"><PFTenants /></TabsContent>
          <TabsContent value="assistants" className="mt-0"><PFAssistantsWorkflows /></TabsContent>
          <TabsContent value="templates" className="mt-0"><PFTemplateStore /></TabsContent>
          <TabsContent value="config" className="mt-0"><PFKonfiguration /></TabsContent>
          <TabsContent value="posts" className="mt-0"><PFCommunityPosts /></TabsContent>
        </div>
      </Tabs>
    </MainLayout>
  );
};

export default PantaFlows;
