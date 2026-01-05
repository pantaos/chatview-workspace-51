import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

type ScreenType = "general" | "notion" | "notion-config";

interface NotionIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apps: { notion: boolean };
  onAppsChange: (apps: { notion: boolean }) => void;
  permissions: {
    notion: { searchPages: boolean; createPages: boolean; updatePages: boolean; queryDatabase: boolean; createEntries: boolean };
  };
  onPermissionsChange: (permissions: NotionIntegrationDialogProps["permissions"]) => void;
  isConnected: boolean;
  onDisconnect: () => void;
}

const tabs = [
  { id: "general" as const, label: "General" },
  { id: "notion" as const, label: "Notion" },
];

export function NotionIntegrationDialog({
  open,
  onOpenChange,
  apps,
  onAppsChange,
  permissions,
  onPermissionsChange,
  isConnected,
  onDisconnect,
}: NotionIntegrationDialogProps) {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("general");
  const [tempPermissions, setTempPermissions] = useState(permissions);

  const isConfigScreen = activeScreen.endsWith("-config");

  const handleBack = () => {
    if (activeScreen === "notion-config") setActiveScreen("notion");
  };

  const getScreenTitle = () => {
    switch (activeScreen) {
      case "notion-config": return "Notion Permissions";
      default: return "";
    }
  };

  const handleSavePermissions = () => {
    onPermissionsChange(tempPermissions);
    toast.success("Notion permissions updated");
    setActiveScreen("notion");
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Notion</h2>
                  <p className="text-sm text-muted-foreground">
                    {isConnected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Connect your Notion workspace to enable AI-powered workflows with your pages and databases.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Use Cases</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Search and find pages quickly</li>
                <li>• Create new pages automatically</li>
                <li>• Query databases for information</li>
                <li>• Add entries to databases</li>
              </ul>
            </div>

            {isConnected && (
              <div className="pt-4 border-t border-border/40">
                <Button 
                  variant="outline" 
                  className="text-destructive hover:text-destructive"
                  onClick={onDisconnect}
                >
                  Disconnect Notion
                </Button>
              </div>
            )}
          </div>
        );

      case "notion":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Notion</h2>
              <p className="text-sm text-muted-foreground">Pages & databases</p>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <div>
                <p className="text-sm font-medium">Enable Notion</p>
                <p className="text-xs text-muted-foreground">Allow AI to access your workspace</p>
              </div>
              <Switch
                checked={apps.notion}
                onCheckedChange={(checked) => onAppsChange({ ...apps, notion: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Permissions</p>
                <p className="text-xs text-muted-foreground">
                  {Object.values(permissions.notion).filter(Boolean).length} of {Object.keys(permissions.notion).length} enabled
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!apps.notion}
                onClick={() => {
                  setTempPermissions(permissions);
                  setActiveScreen("notion-config");
                }}
              >
                Configure
              </Button>
            </div>
          </div>
        );

      case "notion-config":
        return (
          <div className="space-y-2">
            {[
              { key: "searchPages", label: "Search pages", desc: "Find pages" },
              { key: "createPages", label: "Create pages", desc: "Add new pages" },
              { key: "updatePages", label: "Update pages", desc: "Modify pages" },
              { key: "queryDatabase", label: "Query database", desc: "Access data" },
              { key: "createEntries", label: "Create entries", desc: "Add to databases" },
            ].map((perm) => (
              <div key={perm.key} className="flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 transition-colors">
                <div>
                  <p className="text-sm font-medium">{perm.label}</p>
                  <p className="text-xs text-muted-foreground">{perm.desc}</p>
                </div>
                <Switch
                  checked={tempPermissions.notion[perm.key as keyof typeof tempPermissions.notion]}
                  onCheckedChange={(checked) =>
                    setTempPermissions({
                      ...tempPermissions,
                      notion: { ...tempPermissions.notion, [perm.key]: checked },
                    })
                  }
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden h-[500px]">
        <div className="flex h-full">
          {/* Sidebar */}
          {!isConfigScreen && (
            <div className="w-48 border-r border-border/40 flex flex-col shrink-0 bg-muted/20">
              <div className="p-3 border-b border-border/40">
                <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                  <X className="h-4 w-4" />
                </DialogClose>
              </div>
              <nav className="flex-1 p-2 space-y-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveScreen(tab.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeScreen === tab.id
                        ? "bg-background text-foreground font-medium shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {isConfigScreen && (
              <div className="flex items-center gap-3 p-4 border-b border-border/40">
                <button
                  onClick={handleBack}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-base font-medium">{getScreenTitle()}</h2>
              </div>
            )}
            <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
            {isConfigScreen && (
              <div className="flex justify-end gap-2 px-6 py-4 border-t border-border/40 bg-muted/20">
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSavePermissions}>
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
