
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const MAX_RETRY_ATTEMPTS = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export const useUserAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectivityStatus, setConnectivityStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check for online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setConnectivityStatus('online');
      setError(null);
    };
    
    const handleOffline = () => {
      setConnectivityStatus('offline');
      setError("Você está offline. Verifique sua conexão com a internet.");
    };
    
    // Check initial status
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      setConnectivityStatus(navigator.onLine ? 'online' : 'offline');
    }
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial connectivity check
    checkSupabaseConnectivity();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const attemptSupabaseConnection = async <T,>(operation: () => Promise<T>, attempt = 0): Promise<T> => {
    try {
      // Create a timeout promise that rejects after the specified time
      const timeoutDuration = 10000; // 10 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tempo de conexão excedido. Verifique sua conexão de internet.')), timeoutDuration);
      });
      
      // Race the operation against the timeout
      return await Promise.race([
        operation(),
        timeoutPromise
      ]) as T;
    } catch (err: any) {
      // Check if this is a network-related error
      if (err.message && (
          err.message.includes('fetch') || 
          err.message.includes('Failed to fetch') || 
          err.message.includes('Network') || 
          err.message.includes('Tempo de conexão')
      )) {
        // If we haven't maxed out our retries, try again with exponential backoff
        if (attempt < MAX_RETRY_ATTEMPTS) {
          const backoffDelay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
          console.log(`Tentativa ${attempt + 1} de ${MAX_RETRY_ATTEMPTS} falhou. Tentando novamente em ${backoffDelay}ms...`);
          
          // Wait for the backoff delay
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          
          // Update retry attempt state
          setRetryAttempt(attempt + 1);
          
          // Try again
          return await attemptSupabaseConnection(operation, attempt + 1);
        }
        
        // If we've maxed out retries, update connectivity status and throw a user-friendly error
        setConnectivityStatus('offline');
        throw new Error('Não foi possível conectar ao servidor após múltiplas tentativas. Verifique sua conexão de internet ou tente novamente mais tarde.');
      }
      
      // For other errors, just rethrow
      throw err;
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if we're offline before attempting
      if (connectivityStatus === 'offline' && typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
        throw new Error('Você está offline. Verifique sua conexão com a internet antes de tentar fazer login.');
      }
      
      const { data, error } = await attemptSupabaseConnection(() => 
        supabase.auth.signInWithPassword({
          email,
          password
        })
      );
      
      if (error) throw error;
      
      // Reset retry attempts on success
      setRetryAttempt(0);
      setConnectivityStatus('online');
      
      toast({
        title: "Login realizado",
        description: "Você foi autenticado com sucesso."
      });
      
      navigate("/");
      return data;
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = "Verifique suas credenciais e tente novamente.";
      
      if (error.message.includes('conexão') || error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.";
        setConnectivityStatus('offline');
      } else if (error.message.includes('offline')) {
        errorMessage = error.message;
        setConnectivityStatus('offline');
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos.";
        setConnectivityStatus('online'); // Auth server is responding, just invalid credentials
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Email ainda não confirmado. Verifique sua caixa de entrada.";
        setConnectivityStatus('online'); // Auth server is responding
      } else {
        // For any other error, at least the server responded
        setConnectivityStatus('online');
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if we're offline before attempting
      if (connectivityStatus === 'offline' && typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
        throw new Error('Você está offline. Verifique sua conexão com a internet antes de tentar se cadastrar.');
      }
      
      const { data, error } = await attemptSupabaseConnection(() => 
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        })
      );
      
      if (error) throw error;
      
      // Reset retry attempts on success
      setRetryAttempt(0);
      setConnectivityStatus('online');
      
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso. Verifique seu e-mail para confirmar."
      });
      
      return data;
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      
      let errorMessage = "Ocorreu um erro durante o cadastro.";
      
      if (error.message.includes('conexão') || error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.";
        setConnectivityStatus('offline');
      } else if (error.message.includes('offline')) {
        errorMessage = error.message;
        setConnectivityStatus('offline');
      } else if (error.message.includes('User already registered')) {
        errorMessage = "Este email já está cadastrado.";
        setConnectivityStatus('online'); // Auth server is responding
      } else {
        // For any other error, at least the server responded
        setConnectivityStatus('online');
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await attemptSupabaseConnection(() => 
        supabase.auth.signOut()
      );
      
      if (error) throw error;
      
      navigate("/auth");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      
      let errorMessage = "Não foi possível finalizar sua sessão.";
      
      if (error.message.includes('conexão') || error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.";
      }
      
      toast({
        title: "Erro ao fazer logout",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkSupabaseConnectivity = async () => {
    try {
      setError(null);
      
      // First check browser's connectivity
      if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
        setConnectivityStatus('offline');
        return false;
      }
      
      // Try to make a simple request to Supabase
      await attemptSupabaseConnection(async () => {
        const { data } = await supabase.auth.getSession();
        return data;
      });
      
      // If we get here, connection was successful
      setConnectivityStatus('online');
      return true;
    } catch (error: any) {
      console.error("Erro ao verificar conectividade:", error);
      setConnectivityStatus('offline');
      setError("Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.");
      return false;
    }
  };
  
  return {
    signIn,
    signUp,
    signOut,
    isLoading,
    error,
    isAuthenticated: !!user,
    checkSupabaseConnectivity,
    connectivityStatus,
    retryAttempt,
    maxRetryAttempts: MAX_RETRY_ATTEMPTS,
  };
};
