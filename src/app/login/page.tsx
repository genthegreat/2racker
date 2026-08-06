"use client";

import { login, loginAnonymously, signup } from "./actions";
import { useAuth } from "@/context/AuthContext";
import TurnstileInput from "turnstile-next";
import { useEffect, useRef, useState } from "react";
import { refreshTurnstile } from "turnstile-next/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormState } from "@/utils/db/types";

const SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY as string;

if (!SITE_KEY) {
  throw new Error(
    "NEXT_PUBLIC_SITE_KEY is not defined in the environment variables"
  );
}

export default function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [loading, user, router]);

  const onVerify = (token: string) => {
    setCaptchaToken(token);
    setError(null);
  };

  const refresh = () => {
    refreshTurnstile({ className: "cf-turnstile" });
  };

  const onError = (turnstileError: string) => {
    console.log("Turnstile error:", turnstileError);
  };

  const handleAuthResult = (result: FormState | void) => {
    if (result && result.success === false) {
      setError(result.message);
      refresh();
      setCaptchaToken(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const submitAction = (e.nativeEvent as SubmitEvent).submitter as
      | HTMLButtonElement
      | null;
    const actionName = submitAction?.name;

    if (!captchaToken) {
      setError("Captcha verification is required.");
      return;
    }

    formData.set("captchaToken", captchaToken);
    setError(null);
    setIsSubmitting(true);

    try {
      switch (actionName) {
        case "login":
          handleAuthResult(await login(formData));
          break;
        case "signup":
          handleAuthResult(await signup(formData));
          break;
        case "loginAnonymously":
          handleAuthResult(await loginAnonymously(formData));
          break;
        default:
          setError("Unknown submit action.");
      }
    } catch (submitError: unknown) {
      // Next.js redirect() throws; ignore redirect navigations
      if (
        submitError &&
        typeof submitError === "object" &&
        "digest" in submitError &&
        String((submitError as { digest?: string }).digest).startsWith(
          "NEXT_REDIRECT"
        )
      ) {
        return;
      }

      setError(
        submitError instanceof Error
          ? submitError.message
          : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || user) {
    return null;
  }

  return (
    <div>
      <div className="min-h-full my-5 flex items-center justify-center w-full">
        <div className="border-solid border-2 border-lime-900 rounded-lg px-8 py-6 max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
            Welcome
          </h1>
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your@email.com"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
              <Link
                href="forgot-password"
                className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="w-full flex justify-between">
              <div className="w-full flex">
                <TurnstileInput
                  onVerify={onVerify}
                  onError={onError}
                  siteKey={SITE_KEY}
                  theme="light"
                  size="normal"
                />
              </div>
            </div>
            <div className="w-30 flex mx-2 px-2">
              <button
                type="button"
                className="text-xs my-2 ml-auto"
                onClick={refresh}
              >
                Refresh Captcha
              </button>
            </div>

            {error && <p className="text-red-700 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              name="login"
              disabled={isSubmitting}
              className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              Log in
            </button>
            <button
              type="submit"
              name="signup"
              disabled={isSubmitting}
              className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60"
            >
              Sign up
            </button>

            <hr></hr>

            <button
              type="submit"
              name="loginAnonymously"
              disabled={isSubmitting}
              className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-60"
            >
              Sign in Anonymously
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
