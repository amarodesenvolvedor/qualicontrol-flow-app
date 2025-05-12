
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Constants
export const MAX_RETRY_ATTEMPTS = 3;
export const INITIAL_RETRY_DELAY = 1000; // 1 second

/**
 * Attempts a Supabase operation with automatic retries and exponential backoff
 */
export const attemptSupabaseConnection = async <T,>(
  operation: () => Promise<T>, 
  attempt = 0,
  maxRetries = MAX_RETRY_ATTEMPTS,
  initialDelay = INITIAL_RETRY_DELAY,
  onRetryAttemptChange?: (attempt: number) => void
): Promise<T> => {
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
      if (attempt < maxRetries) {
        const backoffDelay = initialDelay * Math.pow(2, attempt);
        console.log(`Tentativa ${attempt + 1} de ${maxRetries} falhou. Tentando novamente em ${backoffDelay}ms...`);
        
        // Wait for the backoff delay
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        
        // Update retry attempt state
        if (onRetryAttemptChange) {
          onRetryAttemptChange(attempt + 1);
        }
        
        // Try again
        return await attemptSupabaseConnection(
          operation, 
          attempt + 1, 
          maxRetries, 
          initialDelay, 
          onRetryAttemptChange
        );
      }
      
      // If we've maxed out retries, throw a user-friendly error
      throw new Error('Não foi possível conectar ao servidor após múltiplas tentativas. Verifique sua conexão de internet ou tente novamente mais tarde.');
    }
    
    // For other errors, just rethrow
    throw err;
  }
};

/**
 * Handles authentication errors and shows appropriate toasts
 */
export const handleAuthError = (error: any, setError: (error: string | null) => void, setConnectivityStatus: (status: 'checking' | 'online' | 'offline') => void): void => {
  console.error("Erro de autenticação:", error);
  
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
    title: "Erro de autenticação",
    description: errorMessage,
    variant: "destructive"
  });
};
