import React, { createContext, useContext, useState, useEffect } from 'react';
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

export const ProfileContextProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile>({ full_name: null, username: null, avatar_url: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

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
    supabase.auth.getUser().then((response: UserResponse) => {
      console.error(response);
      if (response.data?.user) { // Check if user exists within data
        fetchProfile(response.data.user.id);
      }
    }).catch(error => {
      // Handle error if necessary
      console.error('Error fetching user:', error);
    });
  }, []);


  return (
    <ProfileContext.Provider value={{ profile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
