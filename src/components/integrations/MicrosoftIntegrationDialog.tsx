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
  const isMobile = useIsMobile();

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
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
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
                  className="text-destructive hover:text-destructive min-h-[44px]"
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
                className="min-h-[44px]"
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
                className="min-h-[44px]"
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
                className="min-h-[44px]"
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
              <div key={perm.key} className="flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 transition-colors min-h-[56px]">
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
              <div key={perm.key} className="flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 transition-colors min-h-[56px]">
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
              <div key={perm.key} className="flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 transition-colors min-h-[56px]">
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
    <ResponsiveDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title="Microsoft 365 Integration"
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
