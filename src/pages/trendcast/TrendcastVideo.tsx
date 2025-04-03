
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ImagePlus, Trash2, ArrowUp, ArrowDown, Download, UploadIcon } from 'lucide-react';
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
  const [articles, setArticles] = useState([
    { 
      id: '1',
      title: 'Article 1',
      images: [
        {
          id: '1',
          url: 'https://via.placeholder.com/400x300?text=Upload+Image',
          caption: ''
        }
      ]
    }
  ]);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, articleId: string, imageId: string) => {
    if (event.target.files && event.target.files[0]) {
      // In a real app, we'd upload this file to a server and get back a URL
      const newUrl = demoImages[Math.floor(Math.random() * demoImages.length)];
      
      setArticles(articles.map(article => 
        article.id === articleId 
          ? {
              ...article,
              images: article.images.map(img => 
                img.id === imageId ? { ...img, url: newUrl } : img
              )
            }
          : article
      ));
    }
  };

  const handleCaptionChange = (articleId: string, imageId: string, caption: string) => {
    setArticles(articles.map(article => 
      article.id === articleId 
        ? {
            ...article,
            images: article.images.map(img => 
              img.id === imageId ? { ...img, caption } : img
            )
          }
        : article
    ));
  };

  const addImage = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    if (article.images.length >= 8) {
      toast.warning("Maximum 8 images allowed per article");
      return;
    }
    
    const newImageId = String(Date.now());
    setArticles(articles.map(a => 
      a.id === articleId 
        ? {
            ...a,
            images: [...a.images, {
              id: newImageId,
              url: 'https://via.placeholder.com/400x300?text=Upload+Image',
              caption: ''
            }]
          }
        : a
    ));
  };

  const removeImage = (articleId: string, imageId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    if (article.images.length <= 1) {
      toast.error("You need at least one image per article");
      return;
    }
    
    setArticles(articles.map(a => 
      a.id === articleId 
        ? {
            ...a,
            images: a.images.filter(img => img.id !== imageId)
          }
        : a
    ));
  };

  const moveImage = (articleId: string, imageId: string, direction: 'up' | 'down') => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    const index = article.images.findIndex(img => img.id === imageId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === article.images.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newImages = [...article.images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    setArticles(articles.map(a => 
      a.id === articleId 
        ? { ...a, images: newImages }
        : a
    ));
  };

  const handleGenerateVideo = () => {
    const hasEmptyCaptions = useCaption && articles.some(article => 
      article.images.some(img => !img.caption)
    );
    
    if (hasEmptyCaptions) {
      toast.error("Please add captions to all images");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Flatten images for the next step
      const allImages = articles.flatMap(article => 
        article.images.map(img => ({
          ...img,
          articleId: article.id,
          articleTitle: article.title
        }))
      );
      
      navigate('/trendcast/preview', { 
        state: { 
          ...location.state,
          images: allImages,
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
          {articles.map((article) => (
            <div key={article.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-lg mb-3">{article.title}</h3>
              
              {/* Article URL example from screenshot */}
              <p className="text-sm text-gray-500 mb-4 truncate">
                https://versa.io/pt/moda/zara/zara-pode-ser-mais-barata-e-melhor-o-nosso-carrinho-ja-so-tem-pecas-desta-seccao/...
              </p>
              
              {/* Article content toggle button */}
              <Button
                variant="outline"
                className="mb-4 bg-blue-600 text-white hover:bg-blue-700"
              >
                Hide Article Text
              </Button>
              
              {/* Demo article text from screenshot */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
                <p>
                  Na nossa primeira reportagem, exploramos a iniciativa da Zara Pre-Owned, já disponível em Portugal desde dezembro de 2023.
                  Esta plataforma permite-te adquirir peças de segunda-mão com preços acessíveis e que estão em sintonia com as maiores
                  tendências, desde vestidos elegantes até casacos dignos de alta-costura.
                </p>
                <p className="mt-2">
                  Lidi: O Copo da Hidratação Diária
                </p>
              </div>
              
              {useCaption && (
                <div className="mb-4">
                  <label className="text-sm text-gray-500 mb-1 block">
                    Caption
                  </label>
                  <Input
                    value="ZARA PODE SER MAIS BARATA E MELHOR? O NOSSO CARRINHO JÁ SÓ TEM PEÇAS DESTA SECÇÃO"
                    className="w-full"
                    placeholder="Enter main caption for this article"
                  />
                </div>
              )}
              
              <div className="space-y-6 mt-4">
                {article.images.map((image, index) => (
                  <div key={image.id} className="border border-gray-200 rounded-lg p-3 relative">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">Image {index + 1}</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveImage(article.id, image.id, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveImage(article.id, image.id, 'down')}
                          disabled={index === article.images.length - 1}
                          className="h-6 w-6"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImage(article.id, image.id)}
                          className="h-6 w-6 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="border border-dashed border-gray-300 rounded-lg overflow-hidden aspect-video flex items-center justify-center bg-gray-50">
                          <img 
                            src={image.url} 
                            alt={`Preview ${index + 1}`} 
                            className="max-h-full max-w-full object-contain" 
                          />
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload(e, article.id, image.id)}
                          />
                        </div>
                        <div className="absolute bottom-2 right-2 flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white/80 hover:bg-white text-blue-600 hover:text-blue-800 h-7"
                          >
                            <UploadIcon className="h-3 w-3 mr-1" /> 
                            Upload
                          </Button>
                        </div>
                      </div>
                      
                      {useCaption && (
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Image Caption
                          </label>
                          <Input
                            value={image.caption}
                            onChange={(e) => handleCaptionChange(article.id, image.id, e.target.value)}
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
                onClick={() => addImage(article.id)} 
                className="w-full mt-3 border-dashed border-gray-300 text-gray-500"
              >
                <ImagePlus className="mr-2 h-4 w-4" /> Add Image
              </Button>
            </div>
          ))}
        </div>
        
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
