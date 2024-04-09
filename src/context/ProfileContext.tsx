import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
    fullname: string | null;
    username: string | null;
    avatarUrl: string | null;
  }
  
  interface ProfileContextData {
    profile: Profile;
    loading: boolean;
    error: any | null;
  }
  
  const ProfileContext = createContext<ProfileContextData>({
    profile: { fullname: null, username: null, avatarUrl: null },
    loading: false,
    error: null,
  });
  
  export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const supabase = createClient()
    const [profile, setProfile] = useState<Profile>({ fullname: null, username: null, avatarUrl: null });
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
      // Fetch profile data if you have a user.id available here
      const user = supabase.auth.getUser(); 
      if (user) {
        fetchProfile(user.id);
      }
    }, []);
  
    return (
      <ProfileContext.Provider value={{ profile, loading, error }}>
        {children}
      </ProfileContext.Provider>
    );
  };
  
export const useProfileContext = () => useContext(ProfileContext);
