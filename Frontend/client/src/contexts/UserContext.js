import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the profile with built-in retry logic
  const fetchProfile = useCallback(async (user, retries = 3) => {
    setLoading(true);
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // If data is found OR the error is NOT "Row not found", we exit the loop
      if (data) {
        setProfile(data);
        setLoading(false);
        return;
      }

      // Supabase error code PGRST116 means "No row found"
      // If we don't find a row, it means the trigger hasn't finished yet. We wait and retry.
      if (error && error.code === 'PGRST116' && i < retries - 1) {
        console.warn(`Profile not found yet. Retrying in 1 second... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
      } else if (error) {
        console.error("Final Profile Fetch Error:", error.message);
        setProfile(null);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchProfile(session?.user);
    });

    // Listener for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Immediately refetch profile on login
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