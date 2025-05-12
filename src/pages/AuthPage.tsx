
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/app/Logo";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Loader2, AlertCircle, WifiOff, RefreshCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { signIn, signUp, isLoading, error, checkSupabaseConnectivity } = useUserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState("login");
  const [connectivityStatus, setConnectivityStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    // Redirecionar para a página principal se já estiver autenticado
    if (isAuthenticated) {
      navigate("/");
    }
    
    // Verificar a conectividade
    checkConnectivity();
  }, [isAuthenticated, navigate]);
  
  const checkConnectivity = async () => {
    setConnectivityStatus('checking');
    const isConnected = await checkSupabaseConnectivity();
    setConnectivityStatus(isConnected ? 'online' : 'offline');
  };
  
  const handleRetryConnection = () => {
    setRetryCount(prev => prev + 1);
    checkConnectivity();
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Logo className="h-12 mb-4" />
          <CardTitle className="text-2xl">Bem-vindo</CardTitle>
          <CardDescription>
            Sistema de Gerenciamento de Não Conformidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectivityStatus === 'offline' && (
            <Alert variant="destructive" className="mb-4">
              <WifiOff className="h-4 w-4 mr-2" />
              <div className="flex flex-row items-center justify-between w-full">
                <AlertDescription>
                  Não foi possível conectar ao servidor. Verifique sua conexão de internet.
                </AlertDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetryConnection}
                  className="ml-2"
                >
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  Tentar novamente
                </Button>
              </div>
            </Alert>
          )}
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input 
                    id="email-login"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || connectivityStatus === 'offline'}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Senha</Label>
                  <Input 
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || connectivityStatus === 'offline'}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || connectivityStatus === 'offline'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Autenticando...
                    </>
                  ) : connectivityStatus === 'checking' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando conexão...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="cadastro">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input 
                    id="email-signup"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || connectivityStatus === 'offline'}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Senha</Label>
                  <Input 
                    id="password-signup"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || connectivityStatus === 'offline'}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || connectivityStatus === 'offline'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : connectivityStatus === 'checking' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando conexão...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
