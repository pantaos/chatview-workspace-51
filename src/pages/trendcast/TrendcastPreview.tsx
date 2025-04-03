
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import TrendcastLayout from '@/components/trendcast/TrendcastLayout';
import TrendcastButton from '@/components/trendcast/TrendcastButton';

const TrendcastPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if we have required data from previous steps
    const images = location.state?.images;
    const audioUrl = location.state?.audioUrl;
    
    if (!images || !audioUrl) {
      navigate('/trendcast');
      return;
    }

    // Simulate video generation
    const timer = setTimeout(() => {
      // For demo, we'll use a placeholder video
      setVideoUrl('https://ia800300.us.archive.org/17/items/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4');
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleDownload = () => {
    if (videoUrl) {
      toast.success("Video download started");
      setDownloadStarted(true);
      
      // In a real app, this would trigger a download
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'trendcast_video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleCreateNew = () => {
    navigate('/trendcast');
  };

  return (
    <TrendcastLayout 
      title={translate('trendcast.preview')} 
      currentStep={5}
      goBack={() => navigate('/trendcast/video', { state: location.state })}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">{translate('generatingVideo')}...</p>
          <p className="text-sm text-gray-500 mt-2">{translate('thisCanTakeAMinute')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {videoUrl && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef}
                src={videoUrl} 
                controls 
                className="w-full h-full"
                poster="https://via.placeholder.com/640x360?text=Your+Video"
              />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-blue-600 border-blue-600 w-full sm:w-auto"
              onClick={handleDownload}
            >
              {downloadStarted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {translate('downloaded')}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {translate('trendcast.download')}
                </>
              )}
            </Button>
            
            <TrendcastButton 
              onClick={handleCreateNew}
            >
              {translate('createNewTrendcast')}
            </TrendcastButton>
          </div>
        </div>
      )}
    </TrendcastLayout>
  );
};

export default TrendcastPreview;
