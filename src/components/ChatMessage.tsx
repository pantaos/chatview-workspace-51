
import { Bot, User, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ChatMessageProps {
  message: {
    id: string;
    sender: "user" | "bot";
    content: string;
    timestamp: Date;
    type?: "system" | "completion" | "download" | "form";
    files?: File[] | string[];
  };
  children?: React.ReactNode;
}

const ChatMessage = ({ message, children }: ChatMessageProps) => {
  return (
    <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`max-w-[80%] ${message.sender === "user" ? "ml-auto" : "mr-auto"}`}>
        <div className="flex items-start gap-3">
          {message.sender === "bot" && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-4 w-4 text-white" />
            </div>
          )}
          
          <div className={`rounded-2xl p-4 ${
            message.sender === "user"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              : message.type === "system"
              ? "bg-blue-50 text-blue-900 border border-blue-200"
              : message.type === "completion"
              ? "bg-green-50 text-green-900 border border-green-200"
              : message.type === "form"
              ? "bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200"
              : "bg-gray-50 text-gray-800 border"
          }`}>
            <p className="text-base leading-relaxed mb-2">{message.content}</p>
            
            {message.files && message.files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.files.map((file, index) => {
                  const fileName = typeof file === 'string' ? file : file.name;
                  return (
                    <div 
                      key={index} 
                      className="bg-gray-100 text-gray-800 text-sm py-2 px-4 rounded-full flex items-center"
                    >
                      {fileName}
                    </div>
                  );
                })}
              </div>
            )}
            
            {children}
          </div>
          
          {message.sender === "user" && (
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0 mt-1">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
