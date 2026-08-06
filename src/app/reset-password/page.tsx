"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function ResetPassword() {
  const { isPasswordRecovery, loading, clearPasswordRecovery } = useAuth();

  const [color, setColor] = useState<string>("green");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const newPassword = e.currentTarget.password.value;

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const result = await response.json();
      setMessage(result.message);

      if (response.ok) {
        setColor("green");
        clearPasswordRecovery();
      } else {
        setColor("red");
      }
    } catch (error: unknown) {
      setColor("red");
      setMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <main
      id="content"
      role="main"
      className="min-h-full my-5 flex items-center justify-center w-full"
    >
      <div className="border-solid border-2 border-lime-900 rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
          Reset Password
        </h1>
        {isPasswordRecovery ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your new password"
              />
            </div>
            <button
              type="submit"
              name="update"
              disabled={isLoading}
              className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? "Loading..." : "Update Password"}
            </button>
          </form>
        ) : (
          <>
            {!message && (
              <>
                Not Allowed. &nbsp;
                <Link
                  href="forgot-password"
                  className="text-amber-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Request Forgot Password
                </Link>
              </>
            )}
          </>
        )}

        {message && (
          <div
            className={`text-lg ${
              color === "green" ? "text-green-700" : "text-red-700"
            } text-center font-bold`}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
