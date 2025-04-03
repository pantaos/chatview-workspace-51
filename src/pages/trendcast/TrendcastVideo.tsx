
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ImagePlus, Trash2, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import TrendcastLayout from '@/components/trendcast/TrendcastLayout';
import TrendcastButton from '@/components/trendcast/TrendcastButton';

interface ImageItem {
  id: string;
  url: string;
  caption: string;
}

const TrendcastVideo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [useCaption, setUseCaption] = useState(true);
  const [useSubtitles, setUseSubtitles] = useState(true);
  const [images, setImages] = useState<ImageItem[]>([{
    id: '1',
    url: 'https://via.placeholder.com/400x300?text=Upload+Image',
    caption: ''
  }]);

  // Demo images for when adding images
  const demoImages = [
    'https://via.placeholder.com/400x300?text=Store+A',
    'https://via.placeholder.com/400x300?text=Store+B',
    'https://via.placeholder.com/400x300?text=Store+C',
    'https://via.placeholder.com/400x300?text=Store+D',
  ];

  useEffect(() => {
    // Check if we have audio from the previous step
    const audioUrl = location.state?.audioUrl;
    if (!audioUrl) {
      navigate('/trendcast/audio');
    }
  }, [location.state, navigate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, imageId: string) => {
    if (event.target.files && event.target.files[0]) {
      // In a real app, we'd upload this file to a server and get back a URL
      const newUrl = demoImages[Math.floor(Math.random() * demoImages.length)];
      
      setImages(images.map(img => 
        img.id === imageId ? { ...img, url: newUrl } : img
      ));
    }
  };

  const handleCaptionChange = (imageId: string, caption: string) => {
    setImages(images.map(img => 
      img.id === imageId ? { ...img, caption } : img
    ));
  };

  const addImage = () => {
    if (images.length >= 8) {
      toast.warning("Maximum 8 images allowed");
      return;
    }
    
    const newId = String(Date.now());
    setImages([...images, {
      id: newId,
      url: 'https://via.placeholder.com/400x300?text=Upload+Image',
      caption: ''
    }]);
  };

  const removeImage = (imageId: string) => {
    if (images.length <= 1) {
      toast.error("You need at least one image");
      return;
    }
    setImages(images.filter(img => img.id !== imageId));
  };

  const moveImage = (imageId: string, direction: 'up' | 'down') => {
    const index = images.findIndex(img => img.id === imageId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  const handleGenerateVideo = () => {
    const emptyCaption = useCaption && images.some(img => !img.caption);
    
    if (emptyCaption) {
      toast.error("Please add captions to all images");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/trendcast/preview', { 
        state: { 
          ...location.state,
          images,
          useCaption,
          useSubtitles
        } 
      });
    }, 2000);
  };

  return (
    <TrendcastLayout 
      title={translate('trendcast.createVideo')} 
      currentStep={4}
      goBack={() => navigate('/trendcast/audio', { state: location.state })}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-8">
          {images.map((image, index) => (
            <div key={image.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Article {index + 1}</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveImage(image.id, 'up')}
                    disabled={index === 0}
                    className="h-7 w-7"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveImage(image.id, 'down')}
                    disabled={index === images.length - 1}
                    className="h-7 w-7"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImage(image.id)}
                    className="h-7 w-7 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="border border-dashed border-gray-200 rounded-lg overflow-hidden aspect-video flex items-center justify-center bg-gray-50">
                    <img 
                      src={image.url} 
                      alt={`Preview ${index + 1}`} 
                      className="max-h-full max-w-full object-contain" 
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileUpload(e, image.id)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute bottom-2 right-2 bg-white/80 hover:bg-white flex items-center gap-1"
                  >
                    <ImagePlus className="h-4 w-4" /> Change
                  </Button>
                </div>
                
                {useCaption && (
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      {translate('trendcast.caption')}
                    </label>
                    <Input
                      value={image.caption}
                      onChange={(e) => handleCaptionChange(image.id, e.target.value)}
                      placeholder="Enter caption for this image"
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          onClick={addImage} 
          className="w-full border-dashed border-gray-300 text-gray-500"
        >
          <ImagePlus className="mr-2 h-4 w-4" /> Add Image
        </Button>
        
        <div className="bg-gray-50 p-4 rounded-md space-y-3">
          <h3 className="font-medium">{translate('trendcast.options')}</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="useCaption" 
              checked={useCaption} 
              onCheckedChange={(checked) => setUseCaption(checked as boolean)} 
            />
            <Label htmlFor="useCaption">{translate('trendcast.useCaption')}</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="useSubtitles" 
              checked={useSubtitles} 
              onCheckedChange={(checked) => setUseSubtitles(checked as boolean)} 
            />
            <Label htmlFor="useSubtitles">{translate('trendcast.useSubtitles')}</Label>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <TrendcastButton 
            onClick={handleGenerateVideo}
            loading={loading}
          >
            {translate('trendcast.generateVideo')}
          </TrendcastButton>
        </div>
      </div>
    </TrendcastLayout>
  );
};

export default TrendcastVideo;
