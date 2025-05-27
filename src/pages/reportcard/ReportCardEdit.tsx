
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import TrendcastLayout from '@/components/trendcast/TrendcastLayout';
import TrendcastButton from '@/components/trendcast/TrendcastButton';

const ReportCardEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    // Get student data from location state or redirect back
    const studentData = location.state;
    if (!studentData || !studentData.studentName || !studentData.behaviorDescription) {
      navigate('/reportcard');
      return;
    }
    
    // Simulate report text generation
    const timer = setTimeout(() => {
      const generatedText = `ACADEMIC PERFORMANCE REPORT

Student Name: ${studentData.studentName}

OVERALL ASSESSMENT:
${studentData.studentName} has demonstrated considerable growth and development throughout this academic period. Based on classroom observations and behavioral assessments, the following report provides a comprehensive overview of the student's performance.

BEHAVIORAL OBSERVATIONS:
${studentData.behaviorDescription}

ACADEMIC STRENGTHS:
${studentData.studentName} shows strong engagement in classroom activities and demonstrates good comprehension of course materials. The student actively participates in discussions and shows initiative in completing assignments.

AREAS FOR CONTINUED DEVELOPMENT:
While ${studentData.studentName} has made significant progress, continued focus on consistent study habits and time management will further enhance academic performance.

RECOMMENDATIONS:
We recommend that ${studentData.studentName} continues to build upon current strengths while working on developing more consistent organizational skills. Regular communication between home and school will support continued academic success.

TEACHER COMMENTS:
${studentData.studentName} is a pleasure to have in class and consistently demonstrates respect for both peers and educators. With continued effort and support, we anticipate continued academic growth and success.`;
      
      setReportText(generatedText);
      setWordCount(generatedText.split(/\s+/).length);
      setGenerating(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setReportText(newText);
    setWordCount(newText.split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleGenerateReportCard = () => {
    if (!reportText.trim()) {
      toast.error("Report text cannot be empty");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/reportcard/download', { 
        state: { 
          reportText,
          studentName: location.state?.studentName
        } 
      });
    }, 1500);
  };

  return (
    <TrendcastLayout 
      title="Report Card Generator" 
      currentStep={2}
      goBack={() => navigate('/reportcard')}
    >
      {generating ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Generating report text...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Edit Report Text
            </h2>
            <p className="text-gray-600">
              Review and modify the generated report text as needed
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">Word Count</div>
              <div className="text-xl font-semibold">{wordCount}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Student</div>
              <div className="text-xl font-semibold">{location.state?.studentName}</div>
            </div>
          </div>
          
          <Textarea
            value={reportText}
            onChange={handleTextChange}
            className="min-h-[500px] font-mono text-sm resize-none"
            placeholder="Your report text will appear here..."
          />
          
          <div className="flex justify-end pt-4">
            <TrendcastButton 
              onClick={handleGenerateReportCard}
              loading={loading}
            >
              Generate Report Card
            </TrendcastButton>
          </div>
        </div>
      )}
    </TrendcastLayout>
  );
};

export default ReportCardEdit;
