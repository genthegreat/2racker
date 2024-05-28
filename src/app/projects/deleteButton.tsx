'use client'

import { del } from "./actions"

export default function DeleteButton({ project }: { project: number }) {
    async function handleClick() {
        try {
            await del(project)
        } catch (error) {
            console.error('Failed to delete project:', error)
        }
    }

    return (
        <button onClick={handleClick} className="w-52 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Delete project</button>
    )
}
