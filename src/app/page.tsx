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
    <main className="flex min-h-screen w-screen flex-col items-center justify-center p-2 overflow-hidden whitespace-normal">
      <div className="max-w-full text-center">
        <h1 className="text-4xl md:text-6xl lg:text-9xl text-lime-600 break-words">Welcome {username ? username : ""}</h1>
        {!username && (
          <div className="grid content-between">
            <h2 className="text-xl md:text-3xl text-blue-600 mt-4">Please Login to proceed</h2>
            <Link href="/login" className="h-auto flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Login
            </Link>
          </div>
        )}
      </div>
    </main>

  );
}
