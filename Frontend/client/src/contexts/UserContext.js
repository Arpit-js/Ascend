import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (user) => {
    setLoading(true);
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error) {
        setProfile(data);
      }
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // This part is for the initial page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchProfile(session?.user);
    });

    // This part listens for subsequent logins or logouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // This is the line that was missing. It refetches the profile on change.
      fetchProfile(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const value = {
    session,
    profile,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};