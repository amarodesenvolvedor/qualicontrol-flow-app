
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/app/Logo";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Loader2, AlertCircle, WifiOff, RefreshCcw, Wifi } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    signIn, 
    signUp, 
    isLoading, 
    error, 
    checkSupabaseConnectivity, 
    connectivityStatus, 
    retryAttempt,
    maxRetryAttempts
  } = useUserAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState("login");
  const [showConnectivityHelp, setShowConnectivityHelp] = useState(false);
  
  useEffect(() => {
    // Redirecionar para a página principal se já estiver autenticado
    if (isAuthenticated) {
      navigate("/");
    }
    
    // Verificar a conectividade
    const intervalId = setInterval(() => {
      if (connectivityStatus === 'offline') {
        checkConnectivity();
      }
    }, 30000); // Check every 30 seconds if offline
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, navigate, connectivityStatus]);
  
  const checkConnectivity = async () => {
    await checkSupabaseConnectivity();
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
          {/* Connectivity Status Indicator */}
          <div className="mb-4 flex items-center justify-center">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm 
              ${connectivityStatus === 'online' ? 'bg-green-100 text-green-800' : 
              connectivityStatus === 'offline' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'}`}>
              {connectivityStatus === 'online' ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span>Conectado</span>
                </>
              ) : connectivityStatus === 'offline' ? (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Desconectado</span>
                </>
              ) : (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Verificando conexão...</span>
                </>
              )}
            </div>
            {connectivityStatus === 'offline' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-1 h-7 px-2"
                onClick={() => setShowConnectivityHelp(true)}
              >
                <AlertCircle className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {connectivityStatus === 'offline' && (
            <Alert variant="destructive" className="mb-4">
              <WifiOff className="h-4 w-4 mr-2" />
              <div className="flex flex-row items-center justify-between w-full">
                <AlertDescription>
                  Não foi possível conectar ao servidor. Verifique sua conexão de internet.
                  {retryAttempt > 0 && ` (Tentativa ${retryAttempt}/${maxRetryAttempts})`}
                </AlertDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={checkConnectivity}
                  className="ml-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-3 w-3 mr-1" />
                  )}
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
      
      {/* Connectivity Help Dialog */}
      <Dialog 
        open={showConnectivityHelp} 
        onOpenChange={setShowConnectivityHelp}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Problemas de Conexão</DialogTitle>
            <DialogDescription>
              Não foi possível conectar ao servidor. Aqui estão algumas dicas para resolver o problema:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Verifique sua conexão com a internet</h4>
              <p className="text-sm text-muted-foreground">
                Certifique-se de que seu dispositivo está conectado à internet. Tente acessar outros sites para confirmar se sua conexão está funcionando.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Verifique seu firewall ou VPN</h4>
              <p className="text-sm text-muted-foreground">
                Se você está usando um firewall ou VPN, eles podem estar bloqueando a conexão. Tente desativá-los temporariamente.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Limpe o cache do navegador</h4>
              <p className="text-sm text-muted-foreground">
                Problemas de cache podem interferir na autenticação. Tente limpar o cache do seu navegador.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">4. Tente outro navegador</h4>
              <p className="text-sm text-muted-foreground">
                Se o problema persistir, tente acessar o sistema usando outro navegador.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => checkConnectivity()}>
              Tentar novamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
