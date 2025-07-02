
import { CheckCircle, Circle, Clock } from "lucide-react";
import { ConversationalStep } from "@/types/workflow";

interface ProgressIndicatorProps {
  steps: ConversationalStep[];
  currentStepIndex: number;
  completedSteps: Set<string>;
}

const ProgressIndicator = ({ steps, currentStepIndex, completedSteps }: ProgressIndicatorProps) => {
  return (
    <div className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-center max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : isCurrent 
                    ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span className="whitespace-nowrap">{step.title}</span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                    isCompleted ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
