"use client"

import { GithubIcon } from '@/components/icons'
import Link from 'next/link'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from 'react';
import { forgotPassword } from './actions';
import { useProfileContext } from '@/context/ProfileContext';
import { redirect, useRouter } from 'next/navigation';
import { refreshTurnstile } from 'turnstile-next/utils';
import TurnstileInput from 'turnstile-next'

const SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY as string;

export default function ForgotPassword() {

    const supabase = createClientComponentClient();
    const { profile } = useProfileContext();
    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null | undefined>(null);
    const [color, setColor] = useState<string>('green')

    if (profile.id) {
        console.log('Profile', profile.id)
        redirect('/')
    }

    const onVerify = (token: string) => {
        // console.log('Verification token:', token);
        setCaptchaToken(token);
    }

    const refresh = () => {
        console.log('refresh clicked:');
        refreshTurnstile({ className: 'cf-turnstile' });
    };

    const onError = (error: string) => {
        console.log('Turnstile error:', error);
    }



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formRef.current) {
            const formData = new FormData(formRef.current);

            // Determine the base URL on the client-side
            formData.set("redirectLink", window.location.origin);

            if (captchaToken) {
                formData.set("captchaToken", captchaToken);
                const result = await forgotPassword(formData);

                if (result === 'success') {
                    setMessage('An email has been sent to you to reset your password');
                    setColor('green')
                } else {
                    setMessage(`${result}. Try again later.`);
                    setColor('red')
                }
            }
        } else {
            console.log('Captcha verification is required.');
        }
    }

    return (
        <main id="content" role="main" className="w-full flex items-center justify-center max-w-md mx-auto min-h-full">
            <div className="border-solid border-2 border-lime-900 rounded-lg py-2 max-w-md">
                <div className="p-1 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold dark:text-gray-200">Forgot password?</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Remember your password? &nbsp;
                            <Link href="/login" className="text-blue-600 decoration-2 hover:underline font-medium">
                                Login here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-5">
                        <form ref={formRef} onSubmit={handleSubmit}>
                            {
                                !message
                                &&
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Email address</label>
                                        <div className="relative">
                                            <input type="email" id="email" name="email" className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required aria-describedby="email-error" />
                                        </div>
                                        <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                                    </div>

                                    <div className='w-full flex justify-between'>
                                        <div className='w-full flex'>
                                            <TurnstileInput
                                                onVerify={onVerify}
                                                onError={onError}
                                                siteKey={SITE_KEY}
                                                theme='light'
                                                size='normal'
                                            />
                                        </div>
                                    </div>
                                    <div className='w-30 flex mx-2 px-2'>
                                        <button className='text-xs my-2 ml-auto' onClick={refresh}>Refresh Captcha</button>
                                    </div>

                                    <button type="submit" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Reset password</button>
                                </div>
                            }
                            {message && (
                                <div className={`text-lg ${color === 'green' ? 'text-green-700' : 'text-red-700'} text-center font-bold`}>
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700">
                    <a className="pr-3.5 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-200" href="#" target="_blank">
                        <GithubIcon />
                        View Github
                    </a>
                    <a className="pl-3 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-200" href="mailto:ezragonyuie@gmail.com, ezragonyuie@gmail.com?subject=problem on forgot password">
                        Contact us!
                    </a>
                </p>
            </div>

        </main>
    )
}
