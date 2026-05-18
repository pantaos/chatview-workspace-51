import { useEffect, useState } from "react";
import ELearningLayout from "./ELearningLayout";
import { Megaphone } from "lucide-react";
import { getAnnouncements, Announcement } from "@/data/elearningData";

export default function ELearningAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  useEffect(() => { setItems(getAnnouncements()); }, []);

  return (
    <ELearningLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground mt-1.5">News and updates from your instructor.</p>
      </div>
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="rounded-2xl bg-white border p-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Megaphone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{a.title}</h3>
                <div className="text-xs text-muted-foreground mb-2">
                  {new Date(a.createdAt).toLocaleString()} · {a.author}
                </div>
                <p className="text-sm">{a.body}</p>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        )}
      </div>
    </ELearningLayout>
  );
}
