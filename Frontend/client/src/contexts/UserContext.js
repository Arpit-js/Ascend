// arpit-js/ascend/Ascend-5bc2710784212976585877bdfc54e4e2836b5aad/Frontend/client/src/contexts/UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Will be true only on the initial app load.

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (error) throw error;
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (error) throw error;
            setProfile(data);
          } catch (error) {
            console.error("Error fetching profile on auth state change:", error.message);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refetchProfile = async () => {
    if (session?.user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (error) console.error("Manual profile refetch failed:", error.message);
      setProfile(data || null);
    }
  };

  const value = {
    session,
    user: session?.user,
    profile,
    loading,
    refetchProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
