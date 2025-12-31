import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import MainLayout from '@/components/MainLayout';

interface TrendcastLayoutProps {
  children: React.ReactNode;
  title: string;
  currentStep: number;
  goBack?: () => void;
  stepLabels?: string[];
}

const TrendcastLayout = ({ 
  children, 
  title, 
  currentStep, 
  goBack,
  stepLabels 
}: TrendcastLayoutProps) => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  
  // Use custom step labels if provided, otherwise use default Trendcast labels
  const defaultStepLabels = [
    translate('trendcast.inputLinks'),
    translate('trendcast.editScript'),
    translate('trendcast.generateAudio'),
    translate('trendcast.createVideo'),
    translate('trendcast.preview')
  ];

  const currentStepLabels = stepLabels || defaultStepLabels;

  // Convert to workflow steps format
  const workflowSteps = currentStepLabels.map((label, index) => ({
    id: `step-${index + 1}`,
    title: label,
    description: "",
    type: "form" as const,
    status: index < currentStep - 1 
      ? "completed" as const 
      : index === currentStep - 1 
        ? "current" as const 
        : "pending" as const,
  }));

  return (
    <MainLayout
      workflowName={title}
      workflowDescription="Complete each step to generate your content."
      workflowSteps={workflowSteps}
      currentWorkflowStep={currentStep - 1}
    >
      <div className="p-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">Step {currentStep} of {currentStepLabels.length}</p>
        </div>

        {/* Main content */}
        <div className="bg-card rounded-xl border border-border p-6 md:p-8">
          {children}
        </div>
      </div>
    </MainLayout>
  );
};

export default TrendcastLayout;
