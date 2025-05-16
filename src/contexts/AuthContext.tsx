
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state changed:", event, session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
          }
        );

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.email || "No session");
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  
  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
