"use client"

import { login, loginAnonymously, signup } from './actions'
import { redirect } from 'next/navigation'
import { useProfileContext } from '@/context/ProfileContext'
import TurnstileInput from 'turnstile-next'
import { useRef, useState } from 'react'
import { refreshTurnstile } from 'turnstile-next/utils'

const SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY as string;

if (!SITE_KEY) {
    throw new Error('NEXT_PUBLIC_SITE_KEY is not defined in the environment variables');
}

export default function Login() {
    const { profile } = useProfileContext();
    const formRef = useRef<HTMLFormElement>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

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
            const submitAction = (e.nativeEvent as any).submitter?.name;

            // console.log(submitAction)
            // console.log('Verification token:', captchaToken);

            if (captchaToken) {
                formData.set("captchaToken", captchaToken);

                switch (submitAction) {
                    case 'login':
                        await login(formData);
                        break;
                    case 'signup':
                        await signup(formData);
                        break;
                    case 'loginAnonymously':
                        await loginAnonymously(formData);
                        break;
                    default:
                        console.log('Unknown submit action:', submitAction);
                }
            } else {
                console.log('Captcha verification is required.');
            }
        } else {
            console.log('Form reference is null.');
        }
    }

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center w-full">
                <div className="border-solid border-2 border-lime-900 rounded-lg px-8 py-6 max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Welcome</h1>
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <input type="email" id="email" name="email" className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="your@email.com" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <input type="password" id="password" name="password" className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your password" />
                            <a href="#"
                                className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Forgot
                                Password?</a>
                        </div>

                        {/* <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                        <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:outline-none" checked />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Remember me</label>
                        </div>
                        <a href="#"
                        className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create
                        Account</a>
                        </div> */}


                        <div className='w-full flex justify-between'>
                            <div className='w-70 flex'>
                                <TurnstileInput
                                    onVerify={onVerify}
                                    onError={onError}
                                    siteKey={SITE_KEY}
                                    theme='light'
                                    size='normal'
                                />
                            </div>

                            <div className='w-30 flex mx-2 px-2'>
                                <button className='text-xs my-2 ml-auto' onClick={refresh}>Refresh Captcha</button>
                            </div>
                        </div>

                        <button type="submit" name='login' className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Log in</button>
                        <button type="submit" name='signup' className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Sign up</button>

                        <hr></hr>

                        <button type="submit" name='loginAnonymously' className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">Sign in Anonymously</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
