
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export const useUserAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verifica a conexão com o Supabase antes de tentar fazer login
      try {
        // Timeout para evitar que o usuário fique esperando muito tempo
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Tempo de conexão excedido. Verifique sua conexão de internet.')), 10000);
        });
        
        const { data, error } = await Promise.race([
          supabase.auth.signInWithPassword({
            email,
            password
          }),
          timeoutPromise
        ]) as { data: any; error: any };
        
        if (error) throw error;
        
        toast({
          title: "Login realizado",
          description: "Você foi autenticado com sucesso."
        });
        
        navigate("/");
        return data;
      } catch (err: any) {
        if (err.message && err.message.includes('fetch')) {
          throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.');
        }
        throw err;
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = "Verifique suas credenciais e tente novamente.";
      
      if (error.message.includes('conexão') || error.message.includes('fetch')) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.";
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos.";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Email ainda não confirmado. Verifique sua caixa de entrada.";
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
      
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Tempo de conexão excedido. Verifique sua conexão de internet.')), 10000);
        });
        
        const { data, error } = await Promise.race([
          supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin
            }
          }),
          timeoutPromise
        ]) as { data: any; error: any };
        
        if (error) throw error;
        
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso. Verifique seu e-mail para confirmar."
        });
        
        return data;
      } catch (err: any) {
        if (err.message && err.message.includes('fetch')) {
          throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.');
        }
        throw err;
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      
      let errorMessage = "Ocorreu um erro durante o cadastro.";
      
      if (error.message.includes('conexão') || error.message.includes('fetch')) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.";
      } else if (error.message.includes('User already registered')) {
        errorMessage = "Este email já está cadastrado.";
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
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      navigate("/auth");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Não foi possível finalizar sua sessão.",
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
    isAuthenticated: !!user
  };
};
