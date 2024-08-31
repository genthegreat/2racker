'use client'

import { getAllAccounts } from "@/utils/db/dbFunctions";
import { Account } from "@/utils/db/types";
import { useEffect, useState } from "react";
import { onCreateAction } from "../actions";
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { projectSchema } from "@/utils/db/schema";
import Modal from "@/components/Modal";

export default function AddProjectForm() {
    const [accountData, setAccountData] = useState<Account[] | null>(null)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<z.output<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
    });

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

    async function onSubmit(data: z.output<typeof projectSchema>) {
        const formData = new FormData();
        formData.append("account_id", String(data.account_id));
        formData.append("project_name", data.project_name);
        if (data.description) formData.append("description", data.description);

        const response = await onCreateAction(formData);

        if (response.status === 201) {
            setModalMessage(response.message);
            setModalOpen(true);
            setModalStatus(true);
        } else {
            setModalMessage(`Failed to add project: ${response.message}`);
            setModalOpen(true);
            setModalStatus(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                    <div className="mb-3 space-y-2 w-full text-xs">
                        <label htmlFor="project_name" className="font-semibold text-gray-600 py-2">Project Name*</label>
                        <input
                            type="text"
                            id="project_name"
                            {...register("project_name")}
                            placeholder="Project Name"
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        />
                        {errors.project_name?.message && <p className="text-red-500">{String(errors.project_name?.message)}</p>}
                    </div>
                </div>
                <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                    <div className="w-full flex flex-col mb-3">
                        <label htmlFor="account_id" className="font-semibold text-gray-600 py-2">Account*</label>
                        <select
                            id="account_id"
                            {...register("account_id", { valueAsNumber: true })}
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full"
                        >
                            <option value="">Select Account</option>
                            {accountData?.map(account => (
                                <option key={`${account.account_id}`} value={account.account_id}>{account.account_name}</option>
                            ))}
                        </select>
                        {errors.account_id && <p className="text-red-500">{String(errors.account_id.message)}</p>}
                    </div>
                </div>
                <div className="flex-auto w-full mb-1 text-xs space-y-2">
                    <label htmlFor="description" className="font-semibold text-gray-600 py-2">Description</label>
                    <textarea
                        id="description"
                        {...register("description")}
                        className="w-full min-h-[100px] max-h-[300px] h-28 appearance-none block bg-gray-900 text-white border border-gray-900 rounded-lg  py-4 px-4"
                        placeholder="Enter your account info"
                    ></textarea>
                    {errors.description?.message && <p className="text-red-500">{String(errors.description?.message)}</p>}
                </div>
                <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                    <button type="reset" className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500">Add</button>
                </div>
            </form>
            <DevTool control={control} />
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} success={modalStatus} message={modalMessage} redirectUrl={modalStatus ? "/projects" : undefined} />
        </>
    );
}
