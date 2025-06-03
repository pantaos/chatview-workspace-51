
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import TrendcastLayout from '@/components/trendcast/TrendcastLayout';
import TrendcastButton from '@/components/trendcast/TrendcastButton';

const ReportCardInput = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [studentName, setStudentName] = useState('');
  const [behaviorDescription, setBehaviorDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateText = () => {
    if (!studentName.trim()) {
      toast.error("Please enter the student's name");
      return;
    }
    
    if (!behaviorDescription.trim()) {
      toast.error("Please enter a description of behavior");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/reportcard/edit', { 
        state: { 
          studentName: studentName.trim(),
          behaviorDescription: behaviorDescription.trim()
        } 
      });
    }, 1500);
  };

  const reportCardStepLabels = ['Information', 'Textfreigabe', 'Report Download'];

  return (
    <TrendcastLayout 
      title="Report erstellen" 
      currentStep={1}
      stepLabels={reportCardStepLabels}
    >
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Student Information
          </h2>
          <p className="text-gray-600">
            Enter the student details to generate a personalized report card
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentName" className="text-base font-medium">
              Name of Student
            </Label>
            <Input
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter student's full name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="behaviorDescription" className="text-base font-medium">
              Description of Behavior
            </Label>
            <Textarea
              id="behaviorDescription"
              value={behaviorDescription}
              onChange={(e) => setBehaviorDescription(e.target.value)}
              placeholder="Describe the student's behavior, performance, and notable achievements or areas for improvement..."
              className="min-h-[150px] w-full"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-4">
          <TrendcastButton 
            onClick={handleGenerateText}
            loading={loading}
          >
            Generate Report Text
          </TrendcastButton>
        </div>
      </div>
    </TrendcastLayout>
  );
};

export default ReportCardInput;
