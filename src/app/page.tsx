'use client'
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";

export default function Home() {
  const supabase = createClient();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const { data, error } = await supabase.auth.getSession()
        let sess

        if (error) {
          // Handle error
          console.error('Error fetching session:', error.message);
        } 

        const userId = data?.session?.user.id; 
        if (!userId) {
          console.log('User is not authenticated');
          return; // Exit early if there's no userId
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', userId)
          .single();

        if (profileError) { 
          console.log(profileError);
          throw profileError;
        }

        setUsername(profileData?.username);
      } catch (error: any) {
        console.error('Error loading user data:', error.message);
        alert('Error loading user data!');
      }
    };

    fetchData();
  }, [supabase]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-9xl text-lime-600">Welcome {username ? username : ""}</h1>
    </main>
  );
}
