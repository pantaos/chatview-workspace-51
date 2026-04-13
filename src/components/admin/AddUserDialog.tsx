import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from "lucide-react";
import { User } from "@/types/admin";
import { toast } from "sonner";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: User) => void;
}

type AddMode = "choose" | "manual" | "bulk";

interface BulkUser {
  fullName: string;
  email: string;
  role: "User" | "Admin";
  valid: boolean;
  error?: string;
}

const AddUserDialog = ({ open, onOpenChange, onUserAdded }: AddUserDialogProps) => {
  const [mode, setMode] = useState<AddMode>("choose");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"User" | "Admin">("User");
  const [bulkUsers, setBulkUsers] = useState<BulkUser[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setMode("choose");
    setFullName("");
    setEmail("");
    setRole("User");
    setBulkUsers([]);
    setFileName("");
  };

  const handleClose = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      firstName,
      lastName,
      email: email.trim(),
      accountType: role,
      teams: [],
      tokensUsed: 0,
      workflowsCreated: 0,
      assistantsCreated: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onUserAdded(newUser);
    toast.success("User added successfully");
    handleClose(false);
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) {
      toast.error("File must contain a header row and at least one data row");
      return;
    }

    const header = lines[0].toLowerCase();
    const hasHeader = header.includes("name") || header.includes("email") || header.includes("role");
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const parsed: BulkUser[] = dataLines.map(line => {
      const cols = line.split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ""));

      if (cols.length < 3) {
        return { fullName: cols[0] || "", email: cols[1] || "", role: "User" as const, valid: false, error: "Missing columns (need: name, email, role)" };
      }

      const name = cols[0];
      const mail = cols[1];
      const rawRole = cols[2].toLowerCase();
      const parsedRole: "User" | "Admin" = rawRole === "admin" ? "Admin" : "User";
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

      return {
        fullName: name,
        email: mail,
        role: parsedRole,
        valid: !!name && emailValid,
        error: !name ? "Missing name" : !emailValid ? "Invalid email" : undefined,
      };
    });

    setBulkUsers(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv" || ext === "txt") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        parseCSV(ev.target?.result as string);
      };
      reader.readAsText(file);
    } else if (ext === "xlsx" || ext === "xls") {
      toast.error("Excel files are not supported in the browser. Please export as CSV first.");
    } else {
      toast.error("Please upload a CSV file");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBulkSubmit = () => {
    const validUsers = bulkUsers.filter(u => u.valid);
    if (validUsers.length === 0) {
      toast.error("No valid users to import");
      return;
    }

    validUsers.forEach(u => {
      const nameParts = u.fullName.trim().split(/\s+/);
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || "",
        email: u.email,
        accountType: u.role,
        teams: [],
        tokensUsed: 0,
        workflowsCreated: 0,
        assistantsCreated: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      onUserAdded(newUser);
    });

    toast.success(`${validUsers.length} user(s) imported successfully`);
    handleClose(false);
  };

  const removeFromBulk = (index: number) => {
    setBulkUsers(prev => prev.filter((_, i) => i !== index));
  };

  const validCount = bulkUsers.filter(u => u.valid).length;
  const invalidCount = bulkUsers.filter(u => !u.valid).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "choose" && "Add new user"}
            {mode === "manual" && "Add new user"}
            {mode === "bulk" && "Bulk upload users"}
          </DialogTitle>
        </DialogHeader>

        {/* Mode Chooser */}
        {mode === "choose" && (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">How would you like to add users?</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode("manual")}
                className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <UserPlus className="w-8 h-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Manual</div>
                  <div className="text-xs text-muted-foreground mt-1">Add a single user</div>
                </div>
              </button>
              <button
                onClick={() => setMode("bulk")}
                className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <FileSpreadsheet className="w-8 h-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Bulk Upload</div>
                  <div className="text-xs text-muted-foreground mt-1">Import from CSV</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Manual Add */}
        {mode === "manual" && (
          <form onSubmit={handleManualSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-semibold">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Role</Label>
              <Select value={role} onValueChange={(v: "User" | "Admin") => setRole(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="submit" className="bg-primary">Add User</Button>
              <Button type="button" variant="outline" onClick={() => setMode("choose")}>Cancel</Button>
            </div>
          </form>
        )}

        {/* Bulk Upload */}
        {mode === "bulk" && (
          <div className="space-y-5 pt-2">
            {bulkUsers.length === 0 ? (
              <>
                <div className="text-sm text-muted-foreground">
                  Upload a CSV file with columns: <strong>Full Name</strong>, <strong>Email</strong>, <strong>Role</strong> (User or Admin)
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium">Click to upload CSV</p>
                  <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs font-medium mb-2">Example CSV format:</p>
                  <pre className="text-xs text-muted-foreground font-mono">
{`Full Name,Email,Role
John Doe,john@company.com,User
Jane Smith,jane@company.com,Admin`}
                  </pre>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setMode("choose")}>Back</Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{fileName}</span>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {validCount} valid
                    </span>
                    {invalidCount > 0 && (
                      <span className="flex items-center gap-1 text-destructive">
                        <AlertCircle className="w-3.5 h-3.5" /> {invalidCount} invalid
                      </span>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg max-h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulkUsers.map((u, i) => (
                        <TableRow key={i} className={!u.valid ? "bg-destructive/5" : ""}>
                          <TableCell className="font-medium">{u.fullName || "—"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {u.email || "—"}
                              {u.error && (
                                <span className="text-xs text-destructive ml-1">({u.error})</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.role === "Admin" ? "default" : "secondary"}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <button onClick={() => removeFromBulk(i)} className="text-muted-foreground hover:text-destructive">
                              <X className="w-4 h-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end gap-3">
                  <Button onClick={handleBulkSubmit} disabled={validCount === 0} className="bg-primary">
                    Import {validCount} User{validCount !== 1 ? "s" : ""}
                  </Button>
                  <Button variant="outline" onClick={() => { setBulkUsers([]); setFileName(""); }}>
                    Upload Different File
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
