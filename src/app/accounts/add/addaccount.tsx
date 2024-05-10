import Spinner from "@/components/spinner/Spinner";
import { submit } from "./actions";
import { useState } from "react";

export default function AddAccountForm({ id }: { id: string | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!id) return <h1>You are not logged in</h1>

    const updateUserWithId = async (formData: FormData) => {
        // Submit form data using submit function
        try {
            setIsSubmitting(true);
            await submit(id, formData);
            // Handle successful submission (e.g., redirect)
        } catch (error) {
            // Handle errors
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {
                isSubmitting
                    ?
                        <Spinner />
                    :
                    < div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg" >
                        <div className="grid gap-8 grid-cols-1">
                            <div className="flex flex-col ">
                                <div className="flex flex-col sm:flex-row items-center">
                                    <h2 className="font-semibold text-black text-lg mr-auto">Add Account</h2>
                                    <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
                                </div>
                                <div className="mt-5">
                                    <form action={updateUserWithId} className="form">
                                        <div className="mb-4 space-y-2 w-full text-xs">
                                            <label htmlFor="name" className="block text-sm font-semibold text-gray-600 py-2">Name:</label>
                                            <input type="text" id="name" name="name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" placeholder="name" required />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="Status" className="block text-sm font-semibold text-gray-600 py-2">Status:</label>
                                            <input type="text" id="status" name="status" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" placeholder="active" required />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-600 py-2">Start Date:</label>
                                            <input type="date" id="startDate" name="startDate" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" placeholder="" required />
                                        </div>
                                        <button type="submit" className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Add"}</button>
                                    </form>
                                </div>
                            </div>
                        </div >
                    </div >
            }
        </div>
    );
}
