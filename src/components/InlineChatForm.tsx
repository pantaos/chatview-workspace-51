
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronUp } from "lucide-react";
import { ConversationalStep } from "@/types/workflow";

interface InlineChatFormProps {
  step: ConversationalStep;
  onSubmit: (data: Record<string, any>) => void;
  onExpand?: () => void;
}

const InlineChatForm = ({ step, onSubmit, onExpand }: InlineChatFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    await new Promise(resolve => setTimeout(resolve, 300));
    onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  // Show compact inline form for simple forms (2 fields or less)
  const isCompactForm = step.fields.length <= 2;

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl border-2 border-purple-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-purple-900">{step.title}</h4>
          {!isCompactForm && onExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="text-purple-600 hover:text-purple-800"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              Expand
            </Button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {step.fields.slice(0, isCompactForm ? step.fields.length : 2).map((field) => (
            <div key={field.id} className="space-y-1">
              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="min-h-[60px] resize-none text-sm"
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.id}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="text-sm"
                />
              )}
            </div>
          ))}
          
          {!isCompactForm && step.fields.length > 2 && (
            <p className="text-xs text-gray-500 italic">
              {step.fields.length - 2} more fields available in expanded view
            </p>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Submit
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InlineChatForm;
