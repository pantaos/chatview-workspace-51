import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

type ScreenType = "general" | "outlook" | "calendar" | "sharepoint" | "outlook-config" | "calendar-config" | "sharepoint-config";

interface MicrosoftIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apps: { outlook: boolean; calendar: boolean; sharepoint: boolean };
  onAppsChange: (apps: { outlook: boolean; calendar: boolean; sharepoint: boolean }) => void;
  permissions: {
    outlook: { readEmails: boolean; draftEmails: boolean; sendEmails: boolean; searchEmails: boolean; manageLabels: boolean };
    calendar: { readEvents: boolean; createEvents: boolean; updateEvents: boolean; deleteEvents: boolean; findAvailability: boolean };
    sharepoint: { listDocuments: boolean; uploadDocuments: boolean; downloadDocuments: boolean; searchDocuments: boolean; shareDocuments: boolean };
  };
  onPermissionsChange: (permissions: MicrosoftIntegrationDialogProps["permissions"]) => void;
  isConnected: boolean;
  onDisconnect: () => void;
}

const tabs = [
  { id: "general" as const, label: "General" },
  { id: "outlook" as const, label: "Outlook" },
  { id: "calendar" as const, label: "Calendar" },
  { id: "sharepoint" as const, label: "SharePoint" },
];

export function MicrosoftIntegrationDialog({
  open,
  onOpenChange,
  apps,
  onAppsChange,
  permissions,
  onPermissionsChange,
  isConnected,
  onDisconnect,
}: MicrosoftIntegrationDialogProps) {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("general");
  const [tempPermissions, setTempPermissions] = useState(permissions);

  const isConfigScreen = activeScreen.endsWith("-config");

  const handleBack = () => {
    if (activeScreen === "outlook-config") setActiveScreen("outlook");
    else if (activeScreen === "calendar-config") setActiveScreen("calendar");
    else if (activeScreen === "sharepoint-config") setActiveScreen("sharepoint");
  };

  const getScreenTitle = () => {
    switch (activeScreen) {
      case "outlook-config": return "Outlook Permissions";
      case "calendar-config": return "Calendar Permissions";
      case "sharepoint-config": return "SharePoint Permissions";
      default: return "";
    }
  };

  const handleSavePermissions = () => {
    onPermissionsChange(tempPermissions);
    if (activeScreen === "outlook-config") {
      toast.success("Outlook permissions updated");
      setActiveScreen("outlook");
    } else if (activeScreen === "calendar-config") {
      toast.success("Calendar permissions updated");
      setActiveScreen("calendar");
    } else if (activeScreen === "sharepoint-config") {
      toast.success("SharePoint permissions updated");
      setActiveScreen("sharepoint");
    }
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Microsoft 365</h2>
                  <p className="text-sm text-muted-foreground">
                    {isConnected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Connect your Microsoft account to enable AI-powered workflows with your emails, calendar, and files.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Use Cases</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Draft and send emails automatically</li>
                <li>• Schedule meetings based on availability</li>
                <li>• Search and organize documents</li>
                <li>• Reply to emails with AI assistance</li>
              </ul>
            </div>

            {isConnected && (
              <div className="pt-4 border-t border-border/40">
                <Button 
                  variant="outline" 
                  className="text-destructive hover:text-destructive"
                  onClick={onDisconnect}
                >
                  Disconnect Microsoft
                </Button>
              </div>
            )}
          </div>
        );

      case "outlook":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Outlook</h2>
              <p className="text-sm text-muted-foreground">Email management</p>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <div>
                <p className="text-sm font-medium">Enable Outlook</p>
                <p className="text-xs text-muted-foreground">Allow AI to access your emails</p>
              </div>
              <Switch
                checked={apps.outlook}
                onCheckedChange={(checked) => onAppsChange({ ...apps, outlook: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Permissions</p>
                <p className="text-xs text-muted-foreground">
                  {Object.values(permissions.outlook).filter(Boolean).length} of {Object.keys(permissions.outlook).length} enabled
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!apps.outlook}
                onClick={() => {
                  setTempPermissions(permissions);
                  setActiveScreen("outlook-config");
                }}
              >
                Configure
              </Button>
            </div>
          </div>
        );

      case "calendar":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Calendar</h2>
              <p className="text-sm text-muted-foreground">Events & scheduling</p>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <div>
                <p className="text-sm font-medium">Enable Calendar</p>
                <p className="text-xs text-muted-foreground">Allow AI to access your calendar</p>
              </div>
              <Switch
                checked={apps.calendar}
                onCheckedChange={(checked) => onAppsChange({ ...apps, calendar: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Permissions</p>
                <p className="text-xs text-muted-foreground">
                  {Object.values(permissions.calendar).filter(Boolean).length} of {Object.keys(permissions.calendar).length} enabled
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!apps.calendar}
                onClick={() => {
                  setTempPermissions(permissions);
                  setActiveScreen("calendar-config");
                }}
              >
                Configure
              </Button>
            </div>
          </div>
        );

      case "sharepoint":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">SharePoint</h2>
              <p className="text-sm text-muted-foreground">Documents & files</p>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <div>
                <p className="text-sm font-medium">Enable SharePoint</p>
                <p className="text-xs text-muted-foreground">Allow AI to access your documents</p>
              </div>
              <Switch
                checked={apps.sharepoint}
                onCheckedChange={(checked) => onAppsChange({ ...apps, sharepoint: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Permissions</p>
                <p className="text-xs text-muted-foreground">
                  {Object.values(permissions.sharepoint).filter(Boolean).length} of {Object.keys(permissions.sharepoint).length} enabled
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!apps.sharepoint}
                onClick={() => {
                  setTempPermissions(permissions);
                  setActiveScreen("sharepoint-config");
                }}
              >
                Configure
              </Button>
            </div>
          </div>
        );

      case "outlook-config":
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
                  checked={tempPermissions.outlook[perm.key as keyof typeof tempPermissions.outlook]}
                  onCheckedChange={(checked) =>
                    setTempPermissions({
                      ...tempPermissions,
                      outlook: { ...tempPermissions.outlook, [perm.key]: checked },
                    })
                  }
                />
              </div>
            ))}
          </div>
        );

      case "calendar-config":
        return (
          <div className="space-y-2">
            {[
              { key: "readEvents", label: "Read events", desc: "View calendar" },
              { key: "createEvents", label: "Create events", desc: "Add new events" },
              { key: "updateEvents", label: "Update events", desc: "Modify events" },
              { key: "deleteEvents", label: "Delete events", desc: "Remove events" },
              { key: "findAvailability", label: "Find availability", desc: "Check free slots" },
            ].map((perm) => (
              <div key={perm.key} className="flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 transition-colors">
                <div>
                  <p className="text-sm font-medium">{perm.label}</p>
                  <p className="text-xs text-muted-foreground">{perm.desc}</p>
                </div>
                <Switch
                  checked={tempPermissions.calendar[perm.key as keyof typeof tempPermissions.calendar]}
                  onCheckedChange={(checked) =>
                    setTempPermissions({
                      ...tempPermissions,
                      calendar: { ...tempPermissions.calendar, [perm.key]: checked },
                    })
                  }
                />
              </div>
            ))}
          </div>
        );

      case "sharepoint-config":
        return (
          <div className="space-y-2">
            {[
              { key: "listDocuments", label: "List documents", desc: "View files" },
              { key: "uploadDocuments", label: "Upload documents", desc: "Add new files" },
              { key: "downloadDocuments", label: "Download documents", desc: "Download files" },
              { key: "searchDocuments", label: "Search documents", desc: "Search files" },
              { key: "shareDocuments", label: "Share documents", desc: "Share with others" },
            ].map((perm) => (
              <div key={perm.key} className="flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 transition-colors">
                <div>
                  <p className="text-sm font-medium">{perm.label}</p>
                  <p className="text-xs text-muted-foreground">{perm.desc}</p>
                </div>
                <Switch
                  checked={tempPermissions.sharepoint[perm.key as keyof typeof tempPermissions.sharepoint]}
                  onCheckedChange={(checked) =>
                    setTempPermissions({
                      ...tempPermissions,
                      sharepoint: { ...tempPermissions.sharepoint, [perm.key]: checked },
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
          <h2 className="text-lg font-semibold">Microsoft 365 Integration</h2>
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
