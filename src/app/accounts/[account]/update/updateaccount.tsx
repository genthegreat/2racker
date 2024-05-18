import { fetchAccountDataById } from "@/utils/db/dbFunctions";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { update } from "../../actions";

export default function UpdateAccountForm({ account }: { account: number }) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [name, setName] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)

            const res = await fetchAccountDataById(account)

            if (res) {
                setName(res.account_name)
                setStatus(res.status)
                setDate(res.start_date)
            }

        } catch (error) {
            console.log("an error occured:", error)
        } finally {
            setLoading(false)
        }
    }, [account])

    useEffect(() => {
        fetchData()
    }, [account, fetchData])

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        const response = await update(formData)

        console.log(response?.status)

        if (response.success) {
            console.log("Account updated successfully!");
            setLoading(false)
            router.push('/accounts')
        } else {
            console.error("Error updating Account:", response.error);
            setLoading(false)
            setError(response.error)
        }
        setLoading(false)
    }

    return (
        <div>
            <div>
                <div className="min-h-screen flex items-center justify-center w-full">
                    <div className="border-solid border-2 border-lime-900 rounded-lg px-8 py-6 max-w-md">
                        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Update Account</h1>
                        <form action="#">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name:</label>
                                <input type="text" id="name" name="name" value={name} onChange={(e) => (setName(e.target.value))} className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Account Name" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date:</label>
                                <input type="date" id="date" name="date" onChange={(e) => (setDate(e.target.value))} value={date} className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status:
                                <select name="status" id="status" value={status} onChange={(e) => { setStatus(e.target.value) }} className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required>
                                    <option value="active">Active</option>
                                    <option value="closed">Closed</option>
                                </select></label>
                            </div>
                            <input name="id" id="id" type="hidden" value={account} />
                            <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                                <button onClick={() => router.back()} className="w-auto my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
                                <button formAction={handleSubmit} type="submit" className="w-auto my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={loading}>{loading ? 'Updating' : 'Update'}</button>
                            </div>
                        </form>
                        {error && <div><p className='text-red-500 text-lg'>{error}</p></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
