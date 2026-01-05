
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Team, NewTeamData } from "@/types/admin";
import { X, Users } from "lucide-react";

interface AddTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamAdded: (team: Team) => void;
}

const AddTeamDialog = ({ open, onOpenChange, onTeamAdded }: AddTeamDialogProps) => {
  const [formData, setFormData] = useState<NewTeamData>({
    name: "",
    color: "blue",
    description: ""
  });

  const colors = [
    { name: "Blue", value: "blue" },
    { name: "Green", value: "green" },
    { name: "Purple", value: "purple" },
    { name: "Orange", value: "orange" },
    { name: "Red", value: "red" }
  ];

  const getColorPreview = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      red: "bg-red-500"
    };
    return colorMap[color] || "bg-gray-500";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const newTeam: Team = {
      id: Date.now().toString(),
      name: formData.name,
      color: formData.color,
      description: formData.description,
      members: [],
      createdAt: new Date().toISOString()
    };

    onTeamAdded(newTeam);
    setFormData({ name: "", color: "blue", description: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-medium text-foreground">Add New Team</h3>
              <p className="text-xs text-muted-foreground">Create a team to organize members</p>
            </div>
          </div>
          <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-4 space-y-4">
            {/* Team Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Team Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter team name"
                className="h-10"
                required
              />
            </div>

            {/* Team Color */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">Team Color</p>
                <p className="text-xs text-muted-foreground">Choose a color to identify this team</p>
              </div>
              <div className="flex gap-1.5">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-7 h-7 rounded-full ${getColorPreview(color.value)} transition-all ${
                      formData.color === color.value 
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                        : "hover:scale-105"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional team description"
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-border/40 bg-muted/20">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8">
              Create Team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamDialog;
