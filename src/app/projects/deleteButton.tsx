'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { onDeleteAction } from "./actions";
import Spinner from "@/components/spinner/Spinner";

export default function DeleteButton({ project }: { project: number }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();  // Use useRouter to manage client-side navigation

    async function handleClick() {
        try {
            setLoading(true);
            if (confirm(`Are you sure you want to delete this project: ${project}`)) {
                const result = await onDeleteAction(project);

                if (result.success) {
                    // Navigate to the projects page after successful deletion
                    router.push("/projects");
                } else {
                    // Navigate to the error page if there's an issue
                    const errorMessage = result.error ?? "An unknown error occurred";
                    router.push(`/error?error=${encodeURIComponent(errorMessage)}`);
                }
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
            router.push(`/error?error=${encodeURIComponent('Failed to delete project.')}`);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Spinner />;

    return (
        <button
            onClick={handleClick}
            className="w-52 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Delete project
        </button>
    );
}
