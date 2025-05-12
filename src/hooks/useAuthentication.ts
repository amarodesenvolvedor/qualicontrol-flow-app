
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { attemptSupabaseConnection, handleAuthError } from "@/utils/authUtils";

/**
 * Hook for authentication operations (sign in, sign up, sign out)
 */
export const useAuthentication = (
  connectivityStatus: 'checking' | 'online' | 'offline',
  setConnectivityStatus: (status: 'checking' | 'online' | 'offline') => void,
  setRetryAttempt: (attempt: number) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if we're offline before attempting
      if (connectivityStatus === 'offline' && typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
        throw new Error('Você está offline. Verifique sua conexão com a internet antes de tentar fazer login.');
      }
      
      const { data, error } = await attemptSupabaseConnection(
        () => supabase.auth.signInWithPassword({ email, password }),
        0,
        3,
        1000,
        setRetryAttempt
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
      handleAuthError(error, setError, setConnectivityStatus);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if we're offline before attempting
      if (connectivityStatus === 'offline' && typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
        throw new Error('Você está offline. Verifique sua conexão com a internet antes de tentar se cadastrar.');
      }
      
      const { data, error } = await attemptSupabaseConnection(
        () => supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin }
        }),
        0,
        3,
        1000,
        setRetryAttempt
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

  /**
   * Sign out current user
   */
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await attemptSupabaseConnection(
        () => supabase.auth.signOut(),
        0,
        3,
        1000,
        setRetryAttempt
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

  return {
    signIn,
    signUp,
    signOut,
    isLoading,
    error,
    setError
  };
};
