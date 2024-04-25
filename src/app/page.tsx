'use client'
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import Spinner from "@/components/spinner/Spinner";

export default function Home() {
  const supabase = createClient();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true);

        const { data, error } = await supabase.auth.getSession()

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) return <Spinner />;

  return (
    <main className="flex min-h-80 flex-col items-center justify-between p-2">
      <h1 className="text-9xl text-lime-600">Welcome {username ? username : ""}</h1>
      {!username && 
      <>
        <h2 className="text-3xl text-blue-600">Please Login to proceed</h2>
        <Link href="/login" className="p-3 border-solid border-2 rounded-2xl text-lg bg-cyan-500 border-amber-100">Login</Link>
      </>
      }
    </main>
  );
}
