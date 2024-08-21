'use client'
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState, useEffect } from "react";
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
    <main className="relative">
      <div className="relative pb-[50px] pt-[50px] lg:pt-[50px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-5/12">
              <div className="hero-content">
                <h1 className="mb-5 text-4xl font-bold !leading-[1.208] text-gray-200 sm:text-[42px] lg:text-[40px] xl:text-5xl">
                  Welcome <span className="capitalize">{username ? username : ""}</span> to 2racker
                </h1>
                <p className="mb-8 max-w-[480px] text-gray-600">
                  Take control of your financial future with 2racker, the ultimate debt payment planner. Designed to streamline the management of multiple accounts, 2racker allows you to track payments, monitor balances, and oversee project finances all in one place. With real-time data synchronization, you can stay on top of your finances effortlessly, ensuring you never miss a payment.
                </p>
                <ul className="flex flex-wrap items-center">
                  <li>
                    <Link
                      href={username ? "/home" : "/login"}
                      className="inline-flex items-center justify-center rounded-md bg-blue-700 px-6 py-3 text-center font-medium text-white hover:bg-blue-dark lg:px-7"
                    >
                      {username ? "Get Started" : "Login"}
                    </Link>
                  </li>                  
                </ul>
              </div>
            </div>
            <div className="hidden px-4 lg:block lg:w-1/12"></div>
            <div className="w-full px-4 lg:w-6/12">
              <div className="lg:ml-auto lg:text-right">
                <div className="relative inline-block pt-11 lg:pt-0">
                  <img
                    src="https://cdn.tailgrids.com/1.0/assets/images/hero/hero-image-01.png"
                    alt="hero"
                    className="max-w-full lg:ml-auto"
                  />                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
