'use client'

import { del } from "./actions"

export default function DeleteButton({ account }: { account: number }) {
    async function handleClick() {
        try {
            if (confirm(`Are you sure you want to delete this account: ${account}`)) {
                await del(account)                
            }
        } catch (error) {
            console.error('Failed to delete account:', error)
        }
    }

    return (
        <button onClick={handleClick} className="w-52 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Delete account</button>
    )
}
