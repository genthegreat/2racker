import { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase: SupabaseClient = createClient(`${supabaseUrl}`, `${supabaseAnonKey}`);

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    setSupabaseClient(supabase);
  }, []);

  return <Component {...pageProps} supabaseClient={supabaseClient} />;
}
