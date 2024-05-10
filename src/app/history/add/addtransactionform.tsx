import { useEffect, useState } from 'react'
import { useProfileContext } from '@/context/ProfileContext';
import Spinner from '@/components/spinner/Spinner';
import { getAmenities } from '@/utils/db/dbFunctions';
import { Amenity } from '@/utils/db/types';

export default function AddTransactionForm() {
    const { profile, loading } = useProfileContext();

    const [amenityData, setAmenityData] = useState<Amenity[] | null>(null)
    const [amenityId, setAmenityId] = useState<number | ''>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setAmenityData(await getAmenities())
            } catch (error) {
                throw error
            }
        }
        fetchData()
    }, []
    )

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <div>
                    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                            <div className="grid  gap-8 grid-cols-1">
                                <div className="flex flex-col ">
                                    <div className="flex flex-col sm:flex-row items-center">
                                        <h2 className="font-semibold text-black text-lg mr-auto">Add Transaction</h2>
                                        <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
                                    </div>
                                    <div className="mt-5">
                                        <form className="form">
                                            <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                                                <div className="mb-3 space-y-2 w-full text-xs">
                                                    <label className="font-semibold text-gray-600 py-2">Date*</label>
                                                    <input placeholder="Transaction Name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="date" name="date" id="date" />
                                                </div>
                                                <div className="w-full flex flex-col mb-3">
                                                    <label className="font-semibold text-gray-600 py-2">Transacting For?*</label>
                                                    <select className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required name="platform" id="platform" value={amenityId} onChange={(e) => { setAmenityId(parseInt(e.target.value)) }}>
                                                            <option value="">Select Amenity</option>
                                                            {amenityData?.map(amenity => (
                                                                <option key={`${amenity.amenity_id}`} value={`${amenity.amenity_id}`}>{amenity.amenity_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                                <div className="mb-3 space-y-2 w-full text-xs">
                                                    <label className="font-semibold text-gray-600 py-2">Amount Paid*</label>
                                                    <input placeholder="10" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="number" name="amount" id="amount" />
                                                </div>
                                                <div className="w-full flex flex-col mb-3">
                                                    <label className="font-semibold text-gray-600 py-2">Payment Method*</label>
                                                    <select className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required name="platform" id="platform">
                                                        <option value="">Payment Method</option>
                                                        <option value="">Mobile Money - MTN</option>
                                                        <option value="">Bank Transfer</option>
                                                        <option value="">Cash Payment</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                                <label className="font-semibold text-gray-600 py-2">Receipt Number</label>
                                                <input placeholder="Txn00004332123" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="receipt" id="receipt" />
                                            </div>
                                            <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                                <label className="font-semibold text-gray-600 py-2">Notes*</label>
                                                <input placeholder="Deposit" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="name" id="name" />
                                            </div>
                                            <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                                <div className="w-full flex flex-col mb-3">
                                                    <label className="font-semibold text-gray-600 py-2">Status*</label>
                                                    <select className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required name="status" id="status">
                                                        <option value="status">Status</option>
                                                        <option value="success">Success</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="pending">Pending</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <p className="text-xs text-red-500 text-right my-3">Required fields are marked with an asterisk*</p>
                                            <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                                                <button className="mb-2  bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                                                <button className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
