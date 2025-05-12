
import { useAuth } from "@/contexts/AuthContext";
import { useConnectivity } from "./useConnectivity";
import { useAuthentication } from "./useAuthentication";
import { MAX_RETRY_ATTEMPTS } from "@/utils/authUtils";

/**
 * Main hook for user authentication that combines connectivity and authentication functionality
 */
export const useUserAuth = () => {
  const { user } = useAuth();
  const { 
    connectivityStatus, 
    error: connectivityError, 
    setError: setConnectivityError, 
    retryAttempt, 
    setRetryAttempt, 
    checkSupabaseConnectivity, 
    maxRetryAttempts 
  } = useConnectivity();
  
  const { 
    signIn, 
    signUp, 
    signOut, 
    isLoading, 
    error: authError, 
    setError: setAuthError 
  } = useAuthentication(connectivityStatus, setConnectivityError, setRetryAttempt);

  // Combine errors from both sources
  const error = authError || connectivityError;
  
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
