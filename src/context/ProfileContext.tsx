import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UserResponse } from '@supabase/supabase-js';

interface Profile {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface AuthState {
  status: 'SIGNED_IN' | 'SIGNED_OUT' | null; // Explicit type definition
}

interface ProfileContextData {
  profile: Profile;
  loading: boolean;
  error: any | null;
  authState: AuthState;
}

const ProfileContext = createContext<ProfileContextData>({
  profile: { full_name: null, username: null, avatar_url: null },
  loading: false,
  error: null,
  authState: { status: null },
});

export const ProfileContextProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile>({ full_name: null, username: null, avatar_url: null });
  const [loading, setLoading] = useState(true);
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

      if (error && status !== 406) {
        console.log('fetchProfile inner error:', error)
        setError(error);
        throw error
      };

      if (data) {
        console.log(data)
        setProfile(data);
      }
    } catch (error) {
      console.log('fetchProfile outer error:', error)
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listener to update auth state
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      console.log('onAuthStateChange event:', event)
      setAuthState((prevState) => ({
        status: session ? 'SIGNED_IN' : 'SIGNED_OUT'
      }));
    });

    // Initial state
    supabase.auth.getSession().then((data) => {
      console.log('Get session response:', data)
      setAuthState((prevState) => ({
        status: (data.data.session ? 'SIGNED_IN' : 'SIGNED_OUT')
      }));
      console.log('Session Set:', authState.status)
    });

    // Get initial profile data if a user is already signed in
    supabase.auth.getUser().then(({ data, error }: UserResponse) => {
      if(error) {
        console.log('User is not authenticated:', error)
        setAuthState((prevState) => ({
          status: 'SIGNED_OUT'
        }));
        console.log('Session Set:', authState.status)
      }

      if (data.user) {
        console.log('Get user response:', data)
        fetchProfile(data.user.id);
      } 
      
    }).catch(error => {
      console.error('Error fetching user:', error);
    }).finally(() => {
      setLoading(false)
    });

    console.log('authState:', authState)

    // Cleanup function
    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, [supabase.auth]);


  return (
    <ProfileContext.Provider value={{ profile, loading, error, authState }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
