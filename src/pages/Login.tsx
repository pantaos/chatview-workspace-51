
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import loginGradient from "@/assets/login-gradient.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    toast({
      title: "Login successful",
      description: "Redirecting to dashboard...",
    });
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section with gradient background image */}
      <div 
        className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 justify-center relative overflow-hidden min-h-[50vh] lg:min-h-screen"
        style={{ 
          backgroundImage: `url(${loginGradient})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute top-8 left-8">
          <Logo className="text-white" variant="white" />
        </div>

        <div className="mt-24 lg:mt-0 z-10 max-w-lg">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            discover<br />designInspiration
          </h1>
          
          <p className="text-white/80 text-lg md:text-xl max-w-md mt-4 leading-relaxed">
            Unleash your creativity with AI-powered workflows designed for modern teams
          </p>

          <div className="mt-12 flex flex-wrap gap-3">
            <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
              <span className="mr-2 text-white/70">+</span>
              <span>kostengünstiges ufo für musikvideo</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
              <span className="mr-2 text-white/70">+</span>
              <span>logo re-design modern</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-white min-h-[50vh] lg:min-h-screen">
        <Card className="w-full max-w-md p-6 md:p-8 border border-gray-100 shadow-lg bg-white rounded-xl">
          <div className="text-center mb-8">
            <h2 className="text-lg font-medium text-gray-500">Willkommen zurück!</h2>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-700">Log dich ein</h1>
          </div>

          <CardContent className="p-0">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">E-Mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-md border-gray-200 focus:border-[#3f5fa9] focus:ring-[#3f5fa9] bg-gray-50/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Passwort</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 rounded-md border-gray-200 focus:border-[#3f5fa9] focus:ring-[#3f5fa9] bg-gray-50/50"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm text-gray-500 hover:text-[#3f5fa9] hover:underline transition-colors">
                    Passwort vergessen?
                  </a>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium rounded-md text-white shadow-md hover:shadow-lg hover:bg-gray-800 transition-all duration-200 bg-gray-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Einloggen"}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">oder</span>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-11 w-11 p-0 rounded-md border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-11 w-11 p-0 rounded-md border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M11.5 3L2 12h3v9h5v-6h3v6h5v-9h3L11.5 3z" fill="#0078D4"/>
                    <rect x="7" y="8" width="3" height="3" fill="#0078D4"/>
                    <rect x="12" y="8" width="3" height="3" fill="#0078D4"/>
                  </svg>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
