import React from 'react'

export default function AddAmenityForm() {

    return (
        <>
            <div>                
                <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                        <div className="grid  gap-8 grid-cols-1">
                            <div className="flex flex-col ">
                                <div className="flex flex-col sm:flex-row items-center">
                                    <h2 className="font-semibold text-black text-lg mr-auto">Add Amenity</h2>
                                    <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
                                </div>
                                <div className="mt-5">
                                    <div className="form">
                                        <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <label className="font-semibold text-gray-600 py-2">Amenity Name <abbr title="required">*</abbr></label>
                                                <input placeholder="Amenity Name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="integration[shop_name]" id="integration_shop_name" />
                                                <p className="text-red text-xs hidden">Please fill out this field.</p>
                                            </div>
                                        </div>
                                        <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <label className="font-semibold text-gray-600 py-2">Price <abbr title="required">*</abbr></label>
                                                <input placeholder="Amenity Name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="integration[shop_name]" id="integration_shop_name" />
                                                <p className="text-red text-xs hidden">Please fill out this field.</p>
                                            </div>
                                            <div className="w-full flex flex-col mb-3">
                                                <label className="font-semibold text-gray-600 py-2">Associated Project<abbr title="required">*</abbr></label>
                                                <select className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required name="integration[city_id]" id="integration_city_id">
                                                    <option value="">Selected location</option>
                                                    <option value="">Cochin,KL</option>
                                                    <option value="">Mumbai,MH</option>
                                                    <option value="">Bangalore,KA</option>
                                                </select>
                                                <p className="text-sm text-red-500 hidden mt-3" id="error">Please fill out this field.</p>
                                            </div>
                                        </div>
                                        <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                            <label className="font-semibold text-gray-600 py-2">Category</label>
                                            <input placeholder="Amenity Name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="integration[shop_name]" id="integration_shop_name" />
                                            <p className="text-xs text-gray-400 text-left my-3">You inserted 0 characters</p>
                                        </div>
                                        <p className="text-xs text-red-500 text-right my-3">Required fields are marked with an asterisk <abbr title="Required field">*</abbr></p>
                                        <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                                            <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                                            <button className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
