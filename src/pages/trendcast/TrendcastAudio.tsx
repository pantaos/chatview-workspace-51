
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Pause, Download, Volume2, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import TrendcastLayout from '@/components/trendcast/TrendcastLayout';
import TrendcastButton from '@/components/trendcast/TrendcastButton';

const TrendcastAudio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [generating, setGenerating] = useState(true);
  const [volume, setVolume] = useState(80);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Check if we have a script from the previous step
    const script = location.state?.script;
    if (!script) {
      navigate('/trendcast/script');
      return;
    }

    // Simulate audio generation with a timer
    const timer = setTimeout(() => {
      // This would be a real audio URL in a real application
      setAudioUrl('https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg');
      setGenerating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      const audio = audioRef.current;

      const updateTime = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleDurationChange = () => {
        setDuration(audio.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        audio.currentTime = 0;
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      const volumeValue = value[0] / 100;
      audioRef.current.volume = volumeValue;
      setVolume(value[0]);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(0, currentTime - 10);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(duration, currentTime + 10);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'trendcast_audio.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleContinueToVideo = () => {
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      navigate('/trendcast/video', { 
        state: { 
          ...location.state,
          audioUrl 
        } 
      });
    }, 1000);
  };

  return (
    <TrendcastLayout 
      title={translate('trendcast.audioFile')} 
      currentStep={3}
      goBack={() => navigate('/trendcast/script', { state: location.state })}
    >
      {generating ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">{translate('generatingAudio')}...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {audioUrl && (
            <audio ref={audioRef} src={audioUrl} preload="metadata" />
          )}
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg shadow-inner flex flex-col items-center">
            <div className="w-full max-w-xl">
              {/* Audio visualization */}
              <div className="relative">
                <div className="w-full h-24 mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg overflow-hidden">
                  {/* Visualization bars - just visual representation */}
                  <div className="flex items-end justify-between h-full px-2">
                    {Array.from({ length: 40 }, (_, i) => (
                      <div 
                        key={i} 
                        className="bg-blue-500 opacity-80 w-1.5 rounded-t-sm" 
                        style={{ 
                          height: `${20 + Math.sin(i * 0.5) * 60}%`,
                          opacity: isPlaying ? 0.8 : 0.4,
                          transition: 'all 0.2s'
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Playhead position */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-blue-600" 
                    style={{ 
                      left: `${(currentTime / duration) * 100}%`,
                      display: duration > 0 ? 'block' : 'none'
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Player controls */}
              <div className="w-full space-y-6">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleTimeChange}
                  className="w-full"
                />
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || 0)}</span>
                </div>
                
                {/* Transport controls */}
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 text-blue-600"
                    onClick={skipBackward}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-14 w-14 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 text-blue-600"
                    onClick={skipForward}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Volume control */}
                <div className="flex items-center gap-3 mt-4">
                  <Volume2 className="h-4 w-4 text-blue-600" />
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-32"
                  />
                </div>
                
                {/* Download button */}
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-blue-600 border-blue-600"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                    {translate('trendcast.download')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <TrendcastButton 
              onClick={handleContinueToVideo}
              loading={loading}
            >
              {translate('next')}
            </TrendcastButton>
          </div>
        </div>
      )}
    </TrendcastLayout>
  );
};

export default TrendcastAudio;
