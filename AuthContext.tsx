import { supabase } from './src/utils/supabase';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  session: any | null;
  user: any | null;
  professionalId: string | null;
  loading: boolean;
  setSession: (session: any | null) => void;
  setUser: (user: any | null) => void;
  setProfessionalId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setProfessionalId(session?.user?.id || null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setProfessionalId(session?.user?.id || null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, professionalId, loading, setSession, setUser, setProfessionalId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};