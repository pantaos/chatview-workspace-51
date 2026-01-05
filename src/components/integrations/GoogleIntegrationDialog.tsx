import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

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
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
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
                  className="text-destructive hover:text-destructive"
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
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Gmail</h2>
              <p className="text-sm text-muted-foreground">Email management</p>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <div>
                <p className="text-sm font-medium">Enable Gmail</p>
                <p className="text-xs text-muted-foreground">Allow AI to access your emails</p>
              </div>
              <Switch
                checked={apps.gmail}
                onCheckedChange={(checked) => onAppsChange({ ...apps, gmail: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
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
              <div key={perm.key} className="flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 transition-colors">
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden h-[500px]">
        {/* Header with X button top right */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0">
          <h2 className="text-lg font-semibold">Google Integration</h2>
          <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          {!isConfigScreen && (
            <div className="w-48 border-r border-border/40 flex flex-col shrink-0 bg-muted/20">
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
