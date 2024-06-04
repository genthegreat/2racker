import { getAllAccounts, getProjectData } from "@/utils/db/dbFunctions";
import { Account } from "@/utils/db/types";
import { useCallback, useEffect, useState } from "react";
import { del, update } from "../../actions";
import { useRouter } from "next/navigation";

export default function UpdateProjectForm({ project }: { project: number }) {
    const router = useRouter()
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [accountData, setAccountData] = useState<Account[] | null>(null)
    const [accountId, setAccountId] = useState<number | ''>('')
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            
            setAccountData(await getAllAccounts())

            const res = await getProjectData(project)
            
            if (res) {
                setName(res.project_name)
                setAccountId(res.account_id)
                setDescription(res.description)
            }

        } catch (error) {
            console.log("an error occured:", error)
        } finally {
            setLoading(false)
        }
    }, [project])

    useEffect(() => {
        fetchData()
    }, [project, fetchData])

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        const response = await update(formData)

        console.log(response?.status)

        if (response.success) {
            console.log("Project updated successfully!");
            setLoading(false)
            router.push('/projects')
        } else {
            console.error("Error updating Project:", response.error);
            setLoading(false)
            setError(response.error)
        }
        setLoading(false)
    }

    async function handleDeleteClick() {
        try {
            setLoading(true)
            if(confirm(`Are you sure you want to delete this transaction: ${project}`)) {
                await del(project)
            } else {
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to delete project:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                    <div className="grid  gap-8 grid-cols-1">
                        <div className="flex flex-col ">
                            <div className="flex flex-col sm:flex-row items-center">
                                <h2 className="font-semibold text-black text-lg mr-auto">Update Project</h2>
                            </div>
                            <div className="mt-5">
                                <form action="#" className="form">
                                    <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                                        <div className="mb-3 space-y-2 w-full text-xs">
                                            <label className="font-semibold text-gray-600 py-2">Project Name*</label>
                                            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required />
                                        </div>
                                    </div>
                                    <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                        <div className="w-full flex flex-col mb-3">
                                            <label className="font-semibold text-gray-600 py-2">Account*</label>
                                            <select name="accountId" id="accountId" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required value={accountId} onChange={(e) => { setAccountId(parseInt(e.target.value)) }}>
                                                {accountData?.map(account => (
                                                    <option key={`${account.account_id}`} value={`${account.account_id}`}>{account.account_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                        <label className="font-semibold text-gray-600 py-2">Description</label>
                                        <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full min-h-[100px] max-h-[300px] h-28 appearance-none block bg-gray-900 text-white border border-gray-900 rounded-lg  py-4 px-4" placeholder="Enter your account info" spellCheck="false" required></textarea>
                                    </div>
                                    <input type="hidden" name="id" id="id" value={project} />
                                    <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                                        <button onClick={() => router.back()} className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                                        <button onClick={handleDeleteClick} className="mb-2 md:mb-0 bg-red-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-500" >Delete</button>
                                        <button formAction={handleSubmit} className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500 disabled:bg-gray-600" disabled={loading}>{loading ? 'Updating' : 'Update'}</button>
                                    </div>
                                </form>
                                {error && <div><p className='text-red-500 text-lg'>{error}</p></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
