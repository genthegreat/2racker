'use client'
import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom';
import { getProjects } from '@/utils/db/dbFunctions';
import { Project } from '@/utils/db/types';
import { submit } from '../../actions';

export default function AddAmenityForm() {

    const { pending } = useFormStatus();
    const [amenityName, setAmenityName] = useState<string | null>(null)
    const [defaultAmount, setDefaultAmount] = useState<string | null>(null)
    const [projectData, setProjectData] = useState<Project[] | null>(null)
    const [projectId, setProjectId] = useState<number>(0)
    const [category, setCategory] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProjectData(await getProjects(null))
            } catch (error) {
                throw error
            }
        }
        fetchData()
    }, []
    )

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
                                    <form action="#" className="form">
                                        <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <label className="font-semibold text-gray-600 py-2">Amenity Name*</label>
                                                <input placeholder="Amenity Name" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="text" name="amenityName" id="amenityName" onChange={(e) => setAmenityName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <label className="font-semibold text-gray-600 py-2">Price*</label>
                                                <input placeholder="0" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" required type="number" name="defaultAmount" id="defaultAmount" onChange={(e) => setDefaultAmount(e.target.value)} />
                                            </div>
                                            <div className="w-full flex flex-col mb-3">
                                                <label className="font-semibold text-gray-600 py-2">Project*</label>
                                                <select className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full" required name="projectId" id="projectId" value={projectId} onChange={(e) => { { setProjectId(parseInt(e.target.value)); console.log(projectId);}}}>
                                                    <option value={0}>Select Project</option>
                                                    {projectData?.map(project => (
                                                        <option key={`${project.project_id}`} value={`${project.project_id}`}>{project.project_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                            <label className="font-semibold text-gray-600 py-2">Category</label>
                                            <input placeholder="Category" className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4" type="text" name="category" id="category" onChange={(e) => setCategory(e.target.value)} />
                                        </div>
                                        <p className="text-xs text-red-500 text-right my-3">Required fields are marked with an asterisk*</p>
                                        <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                                            <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                                            <button formAction={submit} className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500" disabled={pending}>{pending ? "Submitting..." : "Add"}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
