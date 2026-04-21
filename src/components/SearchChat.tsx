
import React, { useState, useRef, useEffect } from "react";
import { Search, FileUp, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSlashCommands } from "@/data/skillsData";
import { allSkills } from "@/data/skillsData";

interface SearchChatProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (text: string, files: File[]) => void;
  disableNavigation?: boolean;
  title?: string;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  showSkillAutocomplete?: boolean;
}

const SearchChat = ({
  value,
  onChange,
  onSubmit,
  disableNavigation = false,
  title = "Search or ask a question",
  className,
  placeholder = "Type your question here...",
  autoFocus = false,
  showSkillAutocomplete = false,
}: SearchChatProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<{ command: string; name: string; description: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (showSkillAutocomplete && value.startsWith("/")) {
      const commands = getSlashCommands(allSkills);
      const query = value.toLowerCase();
      const filtered = commands.filter(c => 
        c.command.toLowerCase().startsWith(query) || c.name.toLowerCase().includes(query.slice(1))
      );
      setFilteredCommands(filtered);
      setShowCommands(filtered.length > 0);
    } else {
      setShowCommands(false);
    }
  }, [value, showSkillAutocomplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() || files.length > 0) {
      setShowCommands(false);
      onSubmit(value, files);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCommandSelect = (command: string) => {
    // Simulate onChange with the slash command
    const syntheticEvent = {
      target: { value: command }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setShowCommands(false);
    inputRef.current?.focus();
    // Auto-submit on command select
    setTimeout(() => onSubmit(command, []), 100);
  };
  
  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h1 className="text-center text-xl sm:text-2xl mb-4 text-white font-medium">{title}</h1>
      )}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto search-chat-glow relative">
        {/* Slash command autocomplete */}
        {showCommands && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-background/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-1 duration-150">
            <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Suggested
            </div>
            <ul className="pb-1">
              {filteredCommands.map(cmd => (
                <li key={cmd.command}>
                  <button
                    type="button"
                    onClick={() => handleCommandSelect(cmd.command)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-1.5 text-left hover:bg-muted/60 transition-colors"
                  >
                    <span className="flex items-baseline gap-2 min-w-0">
                      <span className="text-sm font-normal text-foreground truncate">{cmd.name}</span>
                      <span className="text-xs text-muted-foreground truncate">· {cmd.description}</span>
                    </span>
                    <code className="text-[11px] font-mono text-muted-foreground flex-shrink-0">{cmd.command}</code>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="relative flex items-center rounded-full border-0 bg-white shadow-lg">
          <div className="flex-1 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              ref={inputRef}
              type="text"
              placeholder={showSkillAutocomplete ? 'Nachricht eingeben oder "/" für Skills...' : placeholder}
              value={value}
              onChange={onChange}
              className="ai-chat-input py-3 flex-1 bg-transparent outline-none text-sm"
              autoComplete="off"
              autoFocus={autoFocus}
            />
          </div>
          
          <div className="flex items-center">
            <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100">
              <FileUp className="h-5 w-5 text-gray-500" />
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
            </label>
            
            <button 
              type="submit" 
              className="p-2 rounded-full mr-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!value.trim() && files.length === 0}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={index} className="bg-gray-100 text-gray-800 text-sm py-2 px-4 rounded-full flex items-center gap-2">
                {file.name}
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 text-lg leading-none"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchChat;
