import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Will be true only on the initial app load.

  useEffect(() => {
    // onAuthStateChange is the single source of truth. It fires on initial load (with the session from storage),
    // on login, on logout, and on token refresh. This is the only listener you need.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);

        // If a user is logged in, fetch their profile.
        // If they are logged out (currentSession is null), set the profile to null.
        if (currentSession?.user) {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
            if (error) throw error;
            setProfile(data);
          } catch (error) {
            console.error("Error fetching profile:", error.message);
            setProfile(null); // Ensure profile is cleared if fetch fails
          }
        } else {
          setProfile(null);
        }
        
        // This is crucial: set loading to false AFTER the session and profile have been determined.
        setLoading(false);
      }
    );

    // Cleanup function to remove the listener when the component unmounts.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // The empty dependency array ensures this effect runs only once to set up the listener.

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