import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogTabs,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
} from "@/components/ui/responsive-dialog";

type ScreenType = "general" | "gmail" | "gmail-config";

interface GoogleIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apps: { gmail: boolean };
  onAppsChange: (apps: { gmail: boolean }) => void;
  permissions: {
    gmail: { readEmails: boolean; draftEmails: boolean; sendEmails: boolean; searchEmails: boolean; manageLabels: boolean };
  };
  onPermissionsChange: (permissions: GoogleIntegrationDialogProps["permissions"]) => void;
  isConnected: boolean;
  onDisconnect: () => void;
}

const tabs = [
  { id: "general" as const, label: "General" },
  { id: "gmail" as const, label: "Gmail" },
];

export function GoogleIntegrationDialog({
  open,
  onOpenChange,
  apps,
  onAppsChange,
  permissions,
  onPermissionsChange,
  isConnected,
  onDisconnect,
}: GoogleIntegrationDialogProps) {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("general");
  const [tempPermissions, setTempPermissions] = useState(permissions);
  const isMobile = useIsMobile();

  const isConfigScreen = activeScreen.endsWith("-config");

  const handleBack = () => {
    if (activeScreen === "gmail-config") setActiveScreen("gmail");
  };

  const getScreenTitle = () => {
    switch (activeScreen) {
      case "gmail-config": return "Gmail Permissions";
      default: return "";
    }
  };

  const handleSavePermissions = () => {
    onPermissionsChange(tempPermissions);
    toast.success("Gmail permissions updated");
    setActiveScreen("gmail");
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Google</h2>
                  <p className="text-sm text-muted-foreground">
                    {isConnected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Connect your Google account to enable AI-powered email workflows with Gmail.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Use Cases</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Draft and send emails automatically</li>
                <li>• Search through your inbox</li>
                <li>• Reply to emails with AI assistance</li>
                <li>• Organize emails with labels</li>
              </ul>
            </div>

            {isConnected && (
              <div className="pt-4 border-t border-border/40">
                <Button 
                  variant="outline" 
                  className="text-destructive hover:text-destructive min-h-[44px]"
                  onClick={onDisconnect}
                >
                  Disconnect Google
                </Button>
              </div>
            )}
          </div>
        );

      case "gmail":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Enable Gmail</p>
                <p className="text-xs text-muted-foreground">Allow AI to access your emails</p>
              </div>
              <Switch
                checked={apps.gmail}
                onCheckedChange={(checked) => onAppsChange({ ...apps, gmail: checked })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Permissions</p>
                <p className="text-xs text-muted-foreground">
                  {Object.values(permissions.gmail).filter(Boolean).length} of {Object.keys(permissions.gmail).length} enabled
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!apps.gmail}
                className="min-h-[44px]"
                onClick={() => {
                  setTempPermissions(permissions);
                  setActiveScreen("gmail-config");
                }}
              >
                Configure
              </Button>
            </div>
          </div>
        );

      case "gmail-config":
        return (
          <div className="space-y-2">
            {[
              { key: "readEmails", label: "Read emails", desc: "View messages" },
              { key: "draftEmails", label: "Draft emails", desc: "Create drafts" },
              { key: "sendEmails", label: "Send emails", desc: "Send on your behalf" },
              { key: "searchEmails", label: "Search emails", desc: "Search mailbox" },
              { key: "manageLabels", label: "Manage labels", desc: "Add/remove labels" },
            ].map((perm) => (
              <div key={perm.key} className="flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 transition-colors min-h-[56px]">
                <div>
                  <p className="text-sm font-medium">{perm.label}</p>
                  <p className="text-xs text-muted-foreground">{perm.desc}</p>
                </div>
                <Switch
                  checked={tempPermissions.gmail[perm.key as keyof typeof tempPermissions.gmail]}
                  onCheckedChange={(checked) =>
                    setTempPermissions({
                      ...tempPermissions,
                      gmail: { ...tempPermissions.gmail, [perm.key]: checked },
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
    <ResponsiveDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title="Google Integration"
    >
      <ResponsiveDialogBody
        showSidebar={!isConfigScreen}
        sidebar={
          <ResponsiveDialogTabs
            tabs={tabs}
            activeTab={activeScreen}
            onTabChange={(id) => setActiveScreen(id as ScreenType)}
          />
        }
      >
        {/* Mobile tabs when not in config screen */}
        {isMobile && !isConfigScreen && (
          <ResponsiveDialogTabs
            tabs={tabs}
            activeTab={activeScreen}
            onTabChange={(id) => setActiveScreen(id as ScreenType)}
          />
        )}

        {/* Config screen header */}
        {isConfigScreen && (
          <div className="flex items-center gap-3 p-4 border-b border-border/40 shrink-0">
            <button
              onClick={handleBack}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-base font-medium">{getScreenTitle()}</h2>
          </div>
        )}

        <ResponsiveDialogContent>
          {renderContent()}
        </ResponsiveDialogContent>

        {isConfigScreen && (
          <ResponsiveDialogFooter>
            <Button variant="ghost" size="sm" onClick={handleBack} className="min-h-[44px]">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSavePermissions} className="min-h-[44px]">
              Save
            </Button>
          </ResponsiveDialogFooter>
        )}
      </ResponsiveDialogBody>
    </ResponsiveDialog>
  );
}
