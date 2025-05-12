
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { attemptSupabaseConnection } from "@/utils/authUtils";

/**
 * Hook for checking and managing connectivity state
 */
export const useConnectivity = () => {
  const [connectivityStatus, setConnectivityStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  
  /**
   * Check if the browser and Supabase are online
   */
  const checkSupabaseConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      
      // First check browser's connectivity
      if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
        setConnectivityStatus('offline');
        return false;
      }
      
      // Try to make a simple request to Supabase
      await attemptSupabaseConnection(
        async () => {
          const { data } = await supabase.auth.getSession();
          return data;
        },
        0,
        3,
        1000,
        setRetryAttempt
      );
      
      // If we get here, connection was successful
      setConnectivityStatus('online');
      setRetryAttempt(0);
      return true;
    } catch (error: any) {
      console.error("Erro ao verificar conectividade:", error);
      setConnectivityStatus('offline');
      setError("Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.");
      return false;
    }
  }, []);
  
  // Set up online/offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setConnectivityStatus('online');
      setError(null);
      checkSupabaseConnectivity();
    };
    
    const handleOffline = () => {
      setConnectivityStatus('offline');
      setError("Você está offline. Verifique sua conexão com a internet.");
    };
    
    // Check initial status
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      setConnectivityStatus(navigator.onLine ? 'checking' : 'offline');
      if (navigator.onLine) {
        checkSupabaseConnectivity();
      }
    }
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkSupabaseConnectivity]);

  return {
    connectivityStatus,
    error,
    setError,
    retryAttempt,
    setRetryAttempt,
    checkSupabaseConnectivity,
    maxRetryAttempts: 3
  };
};
