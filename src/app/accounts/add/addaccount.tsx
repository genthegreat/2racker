import { Control, useForm } from "react-hook-form";
import { onCreateAction } from "../actions";
import { useState } from "react";
import { accountSchema } from "@/utils/db/schema";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from "@hookform/devtools";
import Modal from "@/components/Modal";
import RadioGroup from "@/components/FormComponents/RadioGroup";
import { getCurrentUser } from "@/utils/db/dbFunctions";

type AccountFormData = z.infer<typeof accountSchema>;

export default function AddAccountForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
    });

    async function onSubmit(data: AccountFormData) {
        setIsSubmitting(true)

        const formData = new FormData();
        formData.append("account_name", data.account_name);
        formData.append("status", data.status);
        formData.append("start_date", data.start_date);

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

        setIsSubmitting(false)
    }

    return (
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit, (e) => {console.log(e)})} className="form">
                <div className="mb-4">
                    <label htmlFor="account_name" className="block text-sm font-semibold text-gray-600 py-2">Name:</label>
                    <input
                        type="text"
                        id="account_name"
                        {...register("account_name")}
                        className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        placeholder="Account name"
                    />
                    {errors.account_name && <p className="text-red-500 text-xs">{errors.account_name?.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-600 py-2">Status:</label>
                    <RadioGroup
                        options={[
                            { label: 'Active', value: 'active' },
                            { label: 'Closed', value: 'closed' },
                            { label: 'Suspended', value: 'suspended' },
                        ]}
                        name="status"
                        control={control as Control<AccountFormData>}
                        rules={{ required: 'Please select an option' }}
                    />
                    {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="start_date" className="block text-sm font-semibold text-gray-600 py-2">Start Date:</label>
                    <input
                        type="date"
                        id="start_date"
                        {...register("start_date")}
                        className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        placeholder=""                        
                    />
                    {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date?.message}</p>}
                </div>
                <button type="submit" className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Add"}</button>
            </form>
            <DevTool control={control} />
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} success={modalStatus} message={modalMessage} redirectUrl={modalStatus ? "/accounts" : undefined} />
        </div>
    );
}
