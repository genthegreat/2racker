import { useCallback, useEffect, useState } from 'react'
import Spinner from '@/components/spinner/Spinner';
import { getAmenities, fetchTransactionDataById } from '@/utils/db/dbFunctions';
import { Amenity } from '@/utils/db/types';
import { update } from '../../actions';
import { useRouter } from 'next/navigation';

export default function UpdateTransactionForm({ transaction }: { transaction: number }) {
    const router = useRouter()
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [amenityData, setAmenityData] = useState<Amenity[] | null>(null)
    const [amenityId, setAmenityId] = useState<number>(0)
    const [amountPaid, setAmountPaid] = useState<number>(0)
    const [transactionDate, setTransactionDate] = useState<string | ''>('')
    const [platform, setPlatform] = useState<string>('')
    const [receiptInfo, setReceiptInfo] = useState<string>('')
    const [status, setStatus] = useState<string>('')
    const [notes, setNotes] = useState<string>('')

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)

            setAmenityData(await getAmenities(null))

            const res = await fetchTransactionDataById(transaction)
            if (res) {
                setAmenityId(res.amenity_id)
                setAmountPaid(res.amount_paid)
                setTransactionDate(res.transaction_date)
                setPlatform(res.platform)
                setReceiptInfo(res.receipt_info)
                setStatus(res.status)
                setNotes(res.notes)
            }
        } catch (error) {
            console.log("an error occured:", error)
        } finally {
            setLoading(false)
        }
    }, [transaction])

    useEffect(() => {
        fetchData()
    }, [transaction, fetchData])

    async function handleSubmit(formData: FormData) {

        setLoading(true)
        const response = await update(formData);

        console.log(response?.status)

        if (response.success) {
            console.log("Transaction updated successfully!");
            setLoading(false)
            router.push('/history')
        } else {
            console.error("Error updating transaction:", response.error);
            setLoading(false)
            setError(response.error)
        }
        setLoading(false)
    }

    if (loading) return <Spinner />

    return (
        <>
            <div>
                <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                        <div className="grid  gap-8 grid-cols-1">
                            <div className="flex flex-col ">
                                <div className="flex flex-col sm:flex-row items-center">
                                    <h2 className="font-semibold text-black text-lg mr-auto">Update Transaction</h2>
                                    <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
                                </div>
                                <div className="mt-5">
                                    <form className="form">
                                        <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <label className="font-semibold text-gray-600 py-2">Date*</label>
                                                <input className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="date" name="date" id="date" value={transactionDate || ''} onChange={(e) => { setTransactionDate(e.target.value) }} />
                                            </div>
                                            <div className="w-full flex flex-col mb-3">
                                                <label className="font-semibold text-gray-600 py-2">Transacting For?*</label>
                                                <select className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required name="amenity" id="amenity" value={amenityId} onChange={(e) => { setAmenityId(parseInt(e.target.value)) }}>
                                                    {amenityData?.map(amenity => (
                                                        <option key={`${amenity.amenity_id}`} value={`${amenity.amenity_id}`}>{amenity.amenity_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <label className="font-semibold text-gray-600 py-2">Amount Paid*</label>
                                                <input placeholder="10" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="number" name="amount" id="amount" value={amountPaid} onChange={(e) => setAmountPaid(parseFloat(e.target.value))} />
                                            </div>
                                            <div className="w-full flex flex-col mb-3">
                                                <label className="font-semibold text-gray-600 py-2">Payment Method*</label>
                                                <select className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required name="platform" id="platform" value={platform} onChange={(e) => { setPlatform(e.target.value) }}>
                                                    <option value="MTN Momo">MTN Momo</option>
                                                    <option value="Zamtel">Zamtel Money</option>
                                                    <option value="Airtel Money">Airtel Money</option>
                                                    <option value="Bank Transfer">Bank Transfer</option>
                                                    <option value="Cash">Cash Payment</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                            <label className="font-semibold text-gray-600 py-2">Receipt Number</label>
                                            <input placeholder="Txn00004332123" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="receipt" id="receipt" value={receiptInfo} />
                                        </div>
                                        <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                            <label className="font-semibold text-gray-600 py-2">Notes*</label>
                                            <input placeholder="Deposit" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="notes" id="notes" value={notes} />
                                        </div>
                                        <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                            <div className="w-full flex flex-col mb-3">
                                                <label className="font-semibold text-gray-600 py-2">Status*</label>
                                                <select className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required name="status" id="status" value={status} onChange={(e) => { setStatus(e.target.value) }}>
                                                    <option value="success">Success</option>
                                                    <option value="rejected">Rejected</option>
                                                    <option value="pending">Pending</option>
                                                </select>
                                            </div>
                                        </div>                                        
                                        <input type="hidden" name="id" id="id" value={transaction} />
                                        <p className="text-xs text-red-500 text-right my-3">Required fields are marked with an asterisk*</p>
                                        <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                                            <button onClick={() => router.back()} className="mb-2  bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                                            <button formAction={handleSubmit} className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500" >Save</button>
                                        </div>
                                    </form>
                                    {error && <div><p className='text-red-500 text-lg'>{error}</p></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
