import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UserResponse } from '@supabase/supabase-js';

interface Profile {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface ProfileContextData {
  profile: Profile;
  loading: boolean;
  error: any | null;
}

const ProfileContext = createContext<ProfileContextData>({
  profile: { full_name: null, username: null, avatar_url: null },
  loading: false,
  error: null,
});

interface AuthState {
  status: 'SIGNED_IN' | 'SIGNED_OUT' | null; // Explicit type definition
}

export const ProfileContextProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile>({ full_name: null, username: null, avatar_url: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const [authState, setAuthState] = useState<AuthState>({ status: null });  // State to track auth changes

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('full_name, username, avatar_url')
        .eq('id', userId)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    // Listener to update auth state
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      setAuthState((prevState) => ({ 
        status: session ? 'SIGNED_IN' : 'SIGNED_OUT'  
      })); 
    });

    // Initial state
    supabase.auth.getSession().then((data) => {
      setAuthState((prevState) => ({
        status: data.data.session ? 'SIGNED_IN' : 'SIGNED_OUT'
      }));
    });

    // Get initial profile data if a user is already signed in
     supabase.auth.getUser().then((response: UserResponse) => {
      if (response.data?.user) { 
        fetchProfile(response.data.user.id);
      }
    }).catch(error => {
      console.error('Error fetching user:', error);
    });

    // Cleanup function
    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);


  return (
    <ProfileContext.Provider value={{ profile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
