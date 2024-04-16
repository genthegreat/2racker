import React from 'react'

interface Account {
    account_id: number,
    user_id: string,
    amount_paid: number,
    start_date: string,
    account_name: string,
    status: string,
    amount_due: number,
    balance: number
}

export default function AddAccount() {
    return (
        <div>
            <div>
                <div className="min-h-screen flex items-center justify-center w-full">
                    <div className="border-solid border-2 border-lime-900 rounded-lg px-8 py-6 max-w-md">
                        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Welcome</h1>
                        <form action="#">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name:</label>
                                <input type="name" id="name" name="name" className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date:</label>
                                <input type="name" id="name" name="name" className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status:</label>
                                <input type="name" id="name" name="name" className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="" required />
                            </div>
                            <button type="submit" className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
