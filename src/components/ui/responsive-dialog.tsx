import * as React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  children,
  title,
  className,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={cn("h-[90vh] max-h-[90vh] flex flex-col", className)}>
          {title && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
              <h2 className="text-base font-semibold">{title}</h2>
              <DrawerClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
                <X className="h-4 w-4" />
              </DrawerClose>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden h-[500px] flex flex-col gap-0",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0">
            <h2 className="text-lg font-semibold">{title}</h2>
            <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}

interface ResponsiveDialogBodyProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function ResponsiveDialogBody({
  children,
  sidebar,
  showSidebar = true,
  className,
}: ResponsiveDialogBodyProps) {
  const isMobile = useIsMobile();

  if (isMobile || !showSidebar || !sidebar) {
    return (
      <div className={cn("flex-1 flex flex-col overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0">
      <div className="w-48 border-r border-border/40 flex flex-col shrink-0 bg-muted/20">
        {sidebar}
      </div>
      <div className={cn("flex-1 flex flex-col overflow-hidden", className)}>
        {children}
      </div>
    </div>
  );
}

interface ResponsiveDialogTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function ResponsiveDialogTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: ResponsiveDialogTabsProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={cn("border-b border-border/40 shrink-0", className)}>
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-2 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors min-h-[44px]",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: Render as sidebar nav
  return (
    <nav className={cn("flex-1 p-2 space-y-0.5", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
            activeTab === tab.id
              ? "bg-background text-foreground font-medium shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export function ResponsiveDialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 p-4 md:p-6 overflow-y-auto", className)}>
      {children}
    </div>
  );
}

export function ResponsiveDialogFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-end gap-2 px-4 md:px-6 py-4 border-t border-border/40 bg-muted/20 shrink-0", className)}>
      {children}
    </div>
  );
}
