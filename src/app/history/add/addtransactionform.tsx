import { useEffect, useState } from 'react'
import { getAmenities, getAmenityAccountId } from '@/utils/db/dbFunctions';
import { Amenity } from '@/utils/db/types';
import { onCreateAction } from '../actions';
import { useRouter } from 'next/navigation';
import { transactionSchema } from '@/utils/db/schema';
import { DevTool } from '@hookform/devtools'
import Modal from "@/components/Modal"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Control, useForm } from 'react-hook-form'
import RadioGroup from '@/components/FormComponents/RadioGroup';
import Spinner from '@/components/spinner/Spinner';

export default function AddTransactionForm() {
    const router = useRouter()

    const [amenityData, setAmenityData] = useState<Amenity[] | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalStatus, setModalStatus] = useState(false)
    const [modalMessage, setModalMessage] = useState("")

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<z.output<typeof transactionSchema>>({
        resolver: zodResolver(transactionSchema),
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setAmenityData(await getAmenities(null))
                getAmenityAccountId(7)
            } catch (error) {
                throw error
            }
        }
        fetchData()
    }, []
    )

    const handleAmenityChange = async (amenityId: number) => {
        // Fetch account_id whenever amenity_id changes
        const account_id = await getAmenityAccountId(amenityId);
        console.log("passed account id", account_id)
        if (account_id) {
            setValue("account_id", account_id); // Set the account_id in the form
        }
    };

    async function onSubmit(data: z.output<typeof transactionSchema>) {
        const formData = new FormData()
        formData.append('account_id', String(data.account_id));  //  Account ID is already set
        formData.append("amenity_id", String(data.amenity_id))
        formData.append("amount_paid", String(data.amount_paid))
        formData.append("platform", data.platform)
        formData.append("transaction_date", data.transaction_date)
        if (data.notes) formData.append("notes", data.notes)
        if (data.receipt_info) formData.append("receipt_info", data.receipt_info)
        if (data.status) formData.append("status", data.status)

        const response = await onCreateAction(formData)

        if (response.status === 201) {
            setModalMessage(response.message)
            setModalOpen(true)
            setModalStatus(true)
        } else {
            setModalMessage(`Failed to add project: ${response.message}`)
            setModalOpen(true)
            setModalStatus(false)
        }
    }

    if (isSubmitting) return <Spinner />

    return (
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit, (e) => { console.log(e) })} className="form">
                <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                    <div className="mb-3 space-y-2 w-full text-xs">
                        <label htmlFor="transaction_date" className="font-semibold text-gray-600 py-2">Date*</label>
                        <input
                            type="date"
                            id="transaction_date"
                            {...register("transaction_date")}
                            placeholder="Transaction Date"
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        />
                        {errors.transaction_date && <p className="text-red-500 text-xs">{errors.transaction_date.message}</p>}
                    </div>
                    <div className="w-full flex flex-col mb-3">
                        <label htmlFor="amenity_id" className="font-semibold text-gray-600 py-2">Transacting For?*</label>
                        <select
                            id="amenity_id"
                            {...register("amenity_id", { valueAsNumber: true })}
                            onChange={(e) => handleAmenityChange(Number(e.target.value))} // Fetch account_id on change
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full"
                        >
                            <option value="">Select Amenity</option>
                            {amenityData?.map(amenity => (
                                <option key={`${amenity.amenity_id}`} value={`${amenity.amenity_id}`}>{amenity.amenity_name}</option>
                            ))}
                        </select>
                        {errors.amenity_id && <p className="text-red-500 text-xs">{errors.amenity_id.message}</p>}
                    </div>
                </div>
                <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                    <div className="mb-3 space-y-2 w-full text-xs">
                        <label htmlFor="amount_paid" className="font-semibold text-gray-600 py-2">Amount Paid*</label>
                        <input
                            type="number"
                            id="amount_paid"
                            {...register("amount_paid", { valueAsNumber: true })}
                            placeholder="10"
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        />
                        {errors.amount_paid && <p className="text-red-500 text-xs">{errors.amount_paid.message}</p>}
                    </div>
                    <div className="w-full flex flex-col mb-3">
                        <label htmlFor="platform" className="font-semibold text-gray-600 py-2">Payment Method*</label>
                        <select
                            id="platform"
                            {...register("platform")}
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full"
                        >
                            <option value="">Payment Method</option>
                            <option value="MTN Momo">MTN Momo</option>
                            <option value="Zamtel">Zamtel Money</option>
                            <option value="Airtel Money">Airtel Money</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cash">Cash Payment</option>
                        </select>
                        {errors.platform && <p className="text-red-500 text-xs">{errors.platform.message}</p>}
                    </div>
                </div>
                <div className="flex-auto w-full mb-1 text-xs space-y-2">
                    <label htmlFor="receipt_info" className="font-semibold text-gray-600 py-2">Receipt Number</label>
                    <input
                        type="text"
                        id="receipt_info"
                        {...register("receipt_info")}
                        placeholder="Txn00004332123"
                        className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                    />
                    {errors.receipt_info && <p className="text-red-500 text-xs">{errors.receipt_info.message}</p>}
                </div>
                <div className="flex-auto w-full mb-1 text-xs space-y-2">
                    <label htmlFor="notes" className="font-semibold text-gray-600 py-2">Notes*</label>
                    <input
                        type="text"
                        id="notes"
                        {...register("notes")}
                        className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                    />
                    {errors.notes && <p className="text-red-500 text-xs">{errors.notes.message}</p>}
                </div>
                <div className="flex-auto w-full mb-1 text-xs space-y-2">
                    <div className="w-full flex flex-col mb-3">
                        <label htmlFor="status" className="font-semibold text-gray-600 py-2">Status*</label>
                        <RadioGroup
                            options={[
                                { label: 'Success', value: 'success' },
                                { label: 'Rejected', value: 'rejected' },
                                { label: 'Pending', value: 'pending' },
                            ]}
                            name="status"
                            control={control as Control<z.infer<typeof transactionSchema>>}
                            rules={{ required: 'Please select an option' }}
                        />
                        {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
                    </div>
                </div>
                <p className="text-xs text-red-500 text-right my-3">Required fields are marked with an asterisk*</p>
                <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                    <button onClick={() => router.back()} className="mb-2  bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500" disabled={isSubmitting}>{isSubmitting ? "Submitting" : "Add"}</button>
                </div>
            </form>
            <DevTool control={control} />
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                success={modalStatus}
                message={modalMessage}
                redirectUrl={modalStatus ? "/history" : undefined}
            />
        </div>
    );
}
