'use client'
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Spinner from "@/components/spinner/Spinner";
import { SingleCard } from "@/components/SingleCard";

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
    <div className="relative pb-[50px] pt-[50px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-5/12">
            <div className="hero-content">
              <h1 className="mb-5 text-4xl font-bold !leading-[1.208] text-gray-200 sm:text-[42px] lg:text-[40px] xl:text-5xl">
                Welcome <span className="capitalize">{username ? username : ""}</span> to 2racker
              </h1>
              <p className="mb-8 max-w-[480px] text-gray-600 text-justify">
                Take control of your financial future with 2racker, the ultimate debt payment planner. Designed to streamline the management of multiple accounts, 2racker allows you to track payments, monitor balances, and oversee project finances all in one place. With real-time data synchronization, you can stay on top of your finances effortlessly, ensuring you never miss a payment.
              </p>
              <ul className="flex flex-wrap justify-center md:justify-start items-center">
                <li>
                  <Link
                    href={username ? "/home" : "/login"}
                    className="inline-flex rounded-md bg-blue-700 px-6 py-3 text-center font-medium text-white hover:bg-blue-900 lg:px-7"
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
                  src="/hero-image-01.png"
                  alt="hero"
                  className="max-w-full lg:ml-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container pt-[50px]">
        <div className="-mx-4 flex flex-wrap justify-between">
          <div className="w-full pb-[50px]">
            <h1 className="uppercase text-3xl font-bold">What about 2racker</h1>
          </div>
          <div className="w-full lg:w-1/2 px-2 mb-5">
            <SingleCard
              CardTitle="Detailed Transaction Histories"
              btnHref="/#"
              CardDescription="Transparency is key to effective financial management. 2racker provides detailed transaction histories for every account, allowing you to review essential details such as payment amounts, dates, platforms, and receipt information. This feature ensures that you have all the information you need to make informed financial decisions, at your fingertips."
            />
          </div>
          <div className="w-full lg:w-1/2 px-2 mb-5">
            <SingleCard
              CardTitle="Project and Amenity Management"
              btnHref="/#"
              CardDescription="Easily manage and track the expenses associated with your various projects and amenities. Whether you're dealing with large-scale projects or everyday expenses, 2racker simplifies the process by offering tools to manage budgets, track due dates, and monitor payments. This ensures that you stay organized and in control of your financial commitments."
            />
          </div>
          <div className="w-full lg:w-1/2 px-2 mb-5">
            <SingleCard
              CardTitle="Real-Time Data Access"
              btnHref="/#"
              CardDescription="In today's world, having access to real-time data is crucial. 2racker's powerful backend ensures that all your account summaries, detailed reports, and transaction histories are available whenever you need them. This real-time access allows you to make quick, informed decisions that can help manage your debt more efficiently."
            />
          </div>
          <div className="w-full lg:w-1/2 px-2 mb-5">
            <SingleCard
              CardTitle="Tailored for Every User"
              btnHref="/#"
              CardDescription="2racker understands that every user's financial situation is unique. That's why our platform is designed to be flexible and customizable, allowing you to tailor your account management experience to your specific needs. Whether you're managing a few accounts or handling complex financial structures, 2racker adapts to your requirements."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
