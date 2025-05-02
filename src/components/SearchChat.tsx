
import React, { useState } from "react";
import { Search, FileUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchChatProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (text: string, files: File[]) => void;
  disableNavigation?: boolean;
  title?: string;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchChat = ({
  value,
  onChange,
  onSubmit,
  disableNavigation = false,
  title = "Search or ask a question",
  className,
  placeholder = "Type your question here...",
  autoFocus = false
}: SearchChatProps) => {
  const [files, setFiles] = useState<File[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() || files.length > 0) {
      onSubmit(value, files);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h1 className="text-center text-xl sm:text-2xl mb-4 text-white font-medium">{title}</h1>
      )}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto search-chat-glow">
        <div className="relative flex items-center rounded-full border-0 bg-white shadow-lg">
          <div className="flex-1 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={placeholder}
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
              <div key={index} className="bg-white text-xs py-1 px-3 rounded-full text-gray-700 flex items-center">
                {file.name}
                <button
                  type="button"
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  &times;
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
