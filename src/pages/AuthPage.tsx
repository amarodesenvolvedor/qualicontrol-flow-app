
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/app/Logo";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Import our new components
import { ConnectivityStatus } from "@/components/auth/ConnectivityStatus";
import { ConnectivityHelpDialog } from "@/components/auth/ConnectivityHelpDialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { OfflineAlert } from "@/components/auth/OfflineAlert";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { 
    signIn, 
    signUp, 
    isLoading: authActionLoading, 
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
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  useEffect(() => {
    console.log("AuthPage - isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "redirectAttempted:", redirectAttempted);
    
    // Only redirect if:
    // 1. We're not currently loading authentication status
    // 2. User is authenticated
    // 3. We haven't already attempted to redirect (to prevent loops)
    if (!isLoading && isAuthenticated && !redirectAttempted) {
      console.log("Authenticated user on auth page, redirecting to home");
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
      setRedirectAttempted(true);
      navigate(from, { replace: true });
    }
    
    // Verificar a conectividade
    const intervalId = setInterval(() => {
      if (connectivityStatus === 'offline') {
        checkConnectivity();
      }
    }, 30000); // Check every 30 seconds if offline
    
    return () => clearInterval(intervalId);
  }, [isLoading, isAuthenticated, navigate, connectivityStatus, location, redirectAttempted]);
  
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
  
  // Show loading state while determining auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
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
            <ConnectivityStatus 
              status={connectivityStatus} 
            />
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
            <OfflineAlert
              retryAttempt={retryAttempt}
              maxRetryAttempts={maxRetryAttempts}
              isLoading={authActionLoading}
              onRetry={checkConnectivity}
            />
          )}
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                isLoading={authActionLoading}
                connectivityStatus={connectivityStatus}
                onSubmit={handleLogin}
              />
            </TabsContent>
            
            <TabsContent value="cadastro">
              <SignupForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                isLoading={authActionLoading}
                connectivityStatus={connectivityStatus}
                onSubmit={handleSignUp}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Connectivity Help Dialog */}
      <ConnectivityHelpDialog 
        open={showConnectivityHelp} 
        onOpenChange={setShowConnectivityHelp}
        onRetry={checkConnectivity}
      />
    </div>
  );
};

export default AuthPage;
