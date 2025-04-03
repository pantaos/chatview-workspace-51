
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import TrendcastLayout from '@/components/trendcast/TrendcastLayout';
import TrendcastButton from '@/components/trendcast/TrendcastButton';

const TrendcastEditScript = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    // Get links from location state or redirect back to upload
    const links = location.state?.links;
    if (!links || !Array.isArray(links) || links.length === 0) {
      navigate('/trendcast');
      return;
    }
    
    // Simulate script generation
    const timer = setTimeout(() => {
      const demoScript = `+++INTRO+++
Breves boas-vindas do VERSA Studio! Esta semana temos notícias empolgantes sobre as lojas mais interessantes em Lisboa, destacadas por um jornal inglês. Prepare-se para descobrir tesouros escondidos e boutiques modernas que tornam a capital portuguesa um destino único de compras. Vamos lá!

+++ARTICLE 1+++
ESTAS SÃO AS LOJAS MAIS INTERESSANTES EM LISBOA PARA JORNAL INGLÊS

Lisboa pode não ser considerada um dos principais destinos de compras da Europa, mas oferece uma mistura única de lojas centenárias e boutiques modernas. O coração de Lisboa, especialmente a região da Baixa, mantém um ar vintage inspirado em lojas geridas por gerações das mesmas famílias, destaca o jornal inglês The Telegraph.

Entre os destaques da Baixa, encontramos a Manteigaria Silva, famosa por seus presuntos curados e queijos artesanais. Outro local imperdível é A Vida Portuguesa, um verdadeiro tesouro que exibe marcas tradicionais portuguesas, oferecendo desde cerâmicas até joias de filigrana.`;
      
      setScript(demoScript);
      setWordCount(demoScript.split(/\s+/).length);
      setGenerating(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newScript = e.target.value;
    setScript(newScript);
    setWordCount(newScript.split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleGenerateAudio = () => {
    if (!script.trim()) {
      toast.error("Script cannot be empty");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/trendcast/audio', { 
        state: { 
          script,
          links: location.state?.links
        } 
      });
    }, 1500);
  };

  return (
    <TrendcastLayout 
      title={translate('trendcast.scriptSummary')} 
      currentStep={2}
      goBack={() => navigate('/trendcast')}
    >
      {generating ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">{translate('generating')}...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">{translate('wordCount')}</div>
              <div className="text-xl font-semibold">{wordCount}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">{translate('approxAudioLength')}</div>
              <div className="text-xl font-semibold">{Math.ceil(wordCount / 150)} {translate('minutes')}</div>
            </div>
          </div>
          
          <Textarea
            value={script}
            onChange={handleScriptChange}
            className="min-h-[500px] font-mono text-sm resize-none"
            placeholder="Your script will appear here..."
          />
          
          <div className="flex justify-end pt-4">
            <TrendcastButton 
              onClick={handleGenerateAudio}
              loading={loading}
            >
              {translate('trendcast.generateAudio')}
            </TrendcastButton>
          </div>
        </div>
      )}
    </TrendcastLayout>
  );
};

export default TrendcastEditScript;
