
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import TrendcastLayout from '@/components/trendcast/TrendcastLayout';
import TrendcastButton from '@/components/trendcast/TrendcastButton';

const TrendcastUploadLinks = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [links, setLinks] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number[]>([60]); // seconds

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLink = () => {
    setLinks([...links, '']);
  };

  const removeLink = (index: number) => {
    if (links.length > 1) {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      setLinks(newLinks);
    } else {
      toast.error("You need at least one link");
    }
  };

  const handleGenerateScript = () => {
    const validLinks = links.filter(link => link.trim() !== '');
    
    if (validLinks.length === 0) {
      toast.error("Please enter at least one valid link");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/trendcast/script', { 
        state: { 
          links: validLinks,
          audioDuration: audioDuration[0]
        } 
      });
    }, 1500);
  };

  return (
    <TrendcastLayout title={translate('trendcast.uploadLinks')} currentStep={1}>
      <div className="space-y-8">
        {/* Link inputs */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-grow">
                <label className="text-sm text-gray-500 mb-1 block">
                  {translate('trendcast.link')} #{index + 1}
                </label>
                <Input
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLink(index)}
                className="mt-6"
              >
                <Trash2 className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add more links button */}
        <Button 
          variant="outline" 
          onClick={addLink} 
          className="border-dashed border-gray-300 text-gray-500 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {translate('trendcast.addMoreLinks')}
        </Button>

        {/* Audio length slider */}
        <div className="space-y-2 pt-4">
          <label className="text-base font-medium text-gray-700 block">
            {translate('trendcast.approximateLength')}
          </label>
          <div className="space-y-4">
            <Slider
              value={audioDuration}
              onValueChange={setAudioDuration}
              min={30}
              max={300}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{Math.floor(audioDuration[0] / 60)} {translate('minutes')}</span>
              <span>{audioDuration[0] % 60} {translate('seconds')}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end mt-8 pt-4">
          <TrendcastButton 
            onClick={handleGenerateScript}
            loading={loading}
          >
            {translate('trendcast.generateScript')}
          </TrendcastButton>
        </div>
      </div>
    </TrendcastLayout>
  );
};

export default TrendcastUploadLinks;
