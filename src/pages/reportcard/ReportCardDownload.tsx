
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import TrendcastLayout from '@/components/trendcast/TrendcastLayout';
import TrendcastButton from '@/components/trendcast/TrendcastButton';

const ReportCardDownload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  useEffect(() => {
    // Check if we have the required data
    const reportData = location.state;
    if (!reportData || !reportData.reportText || !reportData.studentName) {
      navigate('/reportcard');
      return;
    }

    // Simulate report card generation
    const timer = setTimeout(() => {
      setReportGenerated(true);
      toast.success("Report card has been generated successfully!");
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleDownload = () => {
    if (!location.state?.reportText) return;

    setLoading(true);

    // Create a downloadable PDF-like content (as text file for demo)
    const reportContent = `
ACADEMIC REPORT CARD
====================

${location.state.reportText}

Generated on: ${new Date().toLocaleDateString()}
Report Card System - VERSA Studio
    `;

    // Create and trigger download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${location.state.studentName}_Report_Card.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setLoading(false);
    toast.success("Report card downloaded successfully!");
  };

  const handleCreateAnother = () => {
    navigate('/reportcard');
  };

  const reportCardStepLabels = ['Information', 'Textfreigabe', 'Report Download'];

  return (
    <TrendcastLayout 
      title="Report erstellen" 
      currentStep={3}
      stepLabels={reportCardStepLabels}
      goBack={() => navigate('/reportcard/edit')}
    >
      <div className="space-y-8 text-center">
        {!reportGenerated ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Generating your report card...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Report Card Ready!
              </h2>
              <p className="text-gray-600">
                Your report card for {location.state?.studentName} has been generated and is ready for download.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Download className="h-12 w-12 text-blue-600" />
              </div>
              
              <div className="space-y-4">
                <TrendcastButton 
                  onClick={handleDownload}
                  loading={loading}
                >
                  Download Report Card
                </TrendcastButton>
                
                <TrendcastButton 
                  onClick={handleCreateAnother}
                  variant="secondary"
                >
                  Create Another Report
                </TrendcastButton>
              </div>
            </div>
          </>
        )}
      </div>
    </TrendcastLayout>
  );
};

export default ReportCardDownload;
