
import { useState, useRef, useEffect } from "react";
import { Search, Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchChatProps {
  onFocus?: () => void;
  autoFocus?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (text: string, files: File[]) => void;
  disableNavigation?: boolean;
  title?: string;
}

const SearchChat = ({ 
  onFocus, 
  autoFocus = false, 
  value, 
  onChange,
  onSubmit,
  disableNavigation = false,
  title
}: SearchChatProps) => {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { translate } = useLanguage();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!query.trim() && !value?.trim()) && files.length === 0) return;
    
    const currentText = value || query;
    
    if (onSubmit) {
      onSubmit(currentText, files);
    } else {
      console.log("Search or chat:", currentText, "Files:", files);
    }
    
    if (!value) {
      setQuery("");
    }
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFocus = () => {
    if (onFocus && !disableNavigation) onFocus();
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    } else {
      setQuery(e.target.value);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {title && (
        <h2 className="text-center text-2xl font-semibold mb-5 text-white panta-gradient-text">
          {title}
        </h2>
      )}
      <form 
        onSubmit={handleSubmit}
        className="relative search-chat-glow"
      >
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 text-sm">
                <span className="truncate max-w-[150px]">{file.name}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-1 hover:bg-black hover:text-white" 
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="relative shadow-lg transition-all rounded-2xl hover:shadow-xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-5">
            <Search className="h-5 w-5 text-panta-blue" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Start a conversation..."
            value={value !== undefined ? value : query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            className="ai-chat-input pl-12 pr-24 py-4 backdrop-blur-sm bg-white/90 border-2 border-panta-blue/20 focus:border-panta-blue transition-all duration-300 shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-panta-blue hover:text-white transition-all duration-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </Button>
            <Button 
              type="submit" 
              size="icon"
              className="h-8 w-8 bg-panta-blue rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-md"
              disabled={!(value || query).trim() && files.length === 0}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchChat;
