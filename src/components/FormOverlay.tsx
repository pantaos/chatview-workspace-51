import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, CheckCircle } from "lucide-react";
import { ConversationalStep } from "@/types/workflow";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormOverlayProps {
  step: ConversationalStep;
  onSubmit: (data: Record<string, any>) => void;
  onClose: () => void;
  isVisible: boolean;
}

const FormOverlay = ({ step, onSubmit, onClose, isVisible }: FormOverlayProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    const missingFields = step.fields
      .filter(field => field.required && !formData[field.id])
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
    onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  if (!isVisible) return null;

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="space-y-5">
          {step.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.id}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                >
                  <option value="">{field.placeholder || 'Select an option'}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type === 'url' ? 'url' : 'text'}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="flex justify-end gap-3 p-4 border-t bg-background shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Submit
            </div>
          )}
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isVisible} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[95vh] max-h-[95vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
            <div>
              <h2 className="text-base font-semibold">{step.title}</h2>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {formContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col border-2 shadow-2xl animate-scale-in">
        <CardHeader className="border-b shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        {formContent}
      </Card>
    </div>
  );
};

export default FormOverlay;
