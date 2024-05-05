import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Spinner from '@/components/spinner/Spinner'

export default function AddAmenityForm() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState<string | null>(null)
    const [price, setPrice] = useState<string | null>(null)
    const [category, setCategory] = useState<string | null>(null)
    const [project, setProject] = useState<string | null>(null)

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, username, avatar_url`)
                .eq('id', user?.id)
                .single()

            if (error && status !== 406) {
                console.log(error)
                throw error
            }

            if (data) {
                setFullname(data.full_name)
                setUsername(data.username)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error: any) {
            console.log(error.message)
            alert(`${error.message}`)
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProfile()
    }, [user, getProfile])

    async function updateAmenity({
        username,
        avatar_url,
      }: {
        username: string | null
        fullname: string | null
        avatar_url: string | null
      }) {
        try {
          setLoading(true)
    
          const { error } = await supabase.from('profiles').upsert({
            id: user?.id as string,
            full_name: fullname,
            username,
            avatar_url,
            updated_at: new Date().toISOString(),
          })
          if (error) throw error
          alert('Profile updated!')
        } catch (error) {
          alert('Error updating the data!')
        } finally {
          setLoading(false)
        }
    }
    
    if (loading) return <Spinner />;
    
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
                                                <input placeholder="Amenity Name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="amenity_name" id="amenity_name" />
                                                <p className="text-red text-xs hidden">Please fill out this field.</p>
                                            </div>
                                        </div>
                                        <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <label className="font-semibold text-gray-600 py-2">Price <abbr title="required">*</abbr></label>
                                                <input placeholder="0" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="default_amount" id="default_amount" />
                                                <p className="text-red text-xs hidden">Please fill out this field.</p>
                                            </div>
                                            <div className="w-full flex flex-col mb-3">
                                                <label className="font-semibold text-gray-600 py-2">Project*</label>
                                                <select className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required name="project_id" id="project_id">
                                                    <option value="">Selected Project</option>
                                                    <option value="">Cochin,KL</option>
                                                    <option value="">Mumbai,MH</option>
                                                    <option value="">Bangalore,KA</option>
                                                </select>
                                                <p className="text-sm text-red-500 hidden mt-3" id="error">Please fill out this field.</p>
                                            </div>
                                        </div>
                                        <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                            <label className="font-semibold text-gray-600 py-2">Category</label>
                                            <input placeholder="Amenity Name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="category" id="category" />
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
