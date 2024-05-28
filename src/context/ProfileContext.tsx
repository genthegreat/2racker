import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

// Supabase client should be created outside of any component to ensure it's only instantiated once.
const supabase = createClient();

interface Profile {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  id: string | null;
}

interface AuthState {
  status: 'SIGNED_IN' | 'SIGNED_OUT' | null;
}

interface ProfileContextData {
  profile: Profile;
  loading: boolean;
  error: any | null;
  authState: AuthState;
}

const ProfileContext = createContext<ProfileContextData>({
  profile: { full_name: null, username: null, avatar_url: null, id: null },
  loading: false,
  error: null,
  authState: { status: null },
});

export const ProfileContextProvider = ({ children }: { children: React.ReactNode }) => {
  // States
  const [profile, setProfile] = useState<Profile>({ full_name: null, username: null, avatar_url: null, id: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [authState, setAuthState] = useState<AuthState>({ status: null });

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      setLoading(true);
      try {
        console.log('Fetching profile at:', new Date().toLocaleTimeString());
        const { data, error, status } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && status !== 406) {
          console.log('fetchProfile inner error:', error);
          setError(error);
          throw error;
        }

        if (data) {
          console.log('Profile data:', data);
          setProfile(data);
        }
      } catch (error) {
        console.log('fetchProfile outer error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    // Function to handle authentication state changes
    const handleAuthChange = (event: string, session: any) => {
      console.log('onAuthStateChange event at:', new Date().toLocaleTimeString(), 'event:', event);
      // Update the authentication state based on whether a session exists
      setAuthState({ status: session ? 'SIGNED_IN' : 'SIGNED_OUT' });
    };

    // Subscribe to authentication state changes
    const authListener = supabase.auth.onAuthStateChange(handleAuthChange);

    // Check the current authentication session when the component mounts
    supabase.auth.getSession().then(({ data }) => {
      console.log('Get session response at:', new Date().toLocaleTimeString(), 'data:', data);
      // Update the authentication state based on whether a session exists
      setAuthState({ status: data.session ? 'SIGNED_IN' : 'SIGNED_OUT' });
      // If there is a session, fetch the user profile
      if (data.session) {
        fetchProfile(data.session.user.id);
      }
    });

    // Cleanup function to unsubscribe from the auth state listener when the component unmounts
    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, authState }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
