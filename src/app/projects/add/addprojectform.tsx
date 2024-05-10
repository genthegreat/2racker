'use client'

import { getAllAccounts } from "@/utils/db/dbFunctions";
import { Account } from "@/utils/db/types";
import { useEffect, useState } from "react";
import { submit } from "./actions";

export default function AddaccountForm() {
    const [accountData, setAccountData] = useState<Account[] | null>(null)
    const [accountId, setAccountId] = useState<number | ''>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setAccountData(await getAllAccounts())
            } catch (error) {
                throw error
            }
        }
        fetchData()
    }, []
    )

    return (
        <>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                    <div className="grid  gap-8 grid-cols-1">
                        <div className="flex flex-col ">
                            <div className="flex flex-col sm:flex-row items-center">
                                <h2 className="font-semibold text-black text-lg mr-auto">Add Project</h2>
                            </div>
                            <div className="mt-5">
                                <form action="#" className="form">
                                    <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                                        <div className="mb-3 space-y-2 w-full text-xs">
                                            <label className="font-semibold text-gray-600 py-2">Project Name*</label>
                                            <input type="text" name="name" id="name" placeholder="Project Name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required />
                                        </div>
                                    </div>
                                    <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                        <div className="w-full flex flex-col mb-3">
                                            <label className="font-semibold text-gray-600 py-2">Account*</label>
                                            <select name="accountId" id="accountId" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required value={accountId} onChange={(e) => { { setAccountId(parseInt(e.target.value)); console.log(accountId); } }}>
                                                <option value="">Select Account</option>
                                                {accountData?.map(account => (
                                                    <option key={`${account.account_id}`} value={`${account.account_id}`}>{account.account_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                        <label className="font-semibold text-gray-600 py-2">Description</label>
                                        <textarea name="description" id="description" className="w-full min-h-[100px] max-h-[300px] h-28 appearance-none block bg-gray-900 text-white border border-gray-900 rounded-lg  py-4 px-4" placeholder="Enter your account info" spellCheck="false" required></textarea>
                                    </div>
                                    <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                                        <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                                        <button formAction={submit} className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
