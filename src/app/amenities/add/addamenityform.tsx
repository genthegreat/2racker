'use client'
import { useEffect, useState } from 'react'
import { getProjects } from '@/utils/db/dbFunctions'
import { Project } from '@/utils/db/types'
import { onCreateAction } from '../actions'
import { DevTool } from '@hookform/devtools'
import Modal from "@/components/Modal"
import { amenitySchema } from '@/utils/db/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'

export default function AddAmenityForm() {
    const [projectData, setProjectData] = useState<Project[] | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalStatus, setModalStatus] = useState(false)
    const [modalMessage, setModalMessage] = useState("")

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.output<typeof amenitySchema>>({
        resolver: zodResolver(amenitySchema),
    })

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

    async function onSubmit(data: z.output<typeof amenitySchema>) {
        const formData = new FormData()
        formData.append("amenity_name", data.amenity_name)
        formData.append("project_id", String(data.project_id))
        formData.append("default_amount", String(data.default_amount))
        if (data.category) formData.append("category", data.category)

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

    return (
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                    <div className="mb-3 space-y-2 w-full text-xs">
                        <label htmlFor="amenity_name" className="font-semibold text-gray-600 py-2">Amenity Name*</label>
                        <input
                            id="amenity_name"
                            {...register("amenity_name")}
                            placeholder="Amenity Name"
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        />
                        {errors.amenity_name && <p className="text-red-500">{String(errors.amenity_name.message)}</p>}
                    </div>
                </div>
                <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                    <div className="mb-3 space-y-2 w-full text-xs">
                        <label htmlFor="default_amount" className="font-semibold text-gray-600 py-2">Price*</label>
                        <input
                            id="default_amount"
                            {...register("default_amount", { valueAsNumber: true })}
                            placeholder="0"
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        />
                        {errors.default_amount && <p className="text-red-500">{String(errors.default_amount.message)}</p>}
                    </div>
                    <div className="w-full flex flex-col mb-3">
                        <label  htmlFor="project_id" className="font-semibold text-gray-600 py-2">Project*</label>
                        <select
                            id="project_id"
                            {...register("project_id", { valueAsNumber: true })}
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full"
                        >
                            <option value={undefined}>Select Project</option>
                            {projectData?.map(project => (
                                <option key={`${project.project_id}`} value={`${project.project_id}`}>{project.project_name}</option>
                            ))}
                        </select>
                        {errors.project_id && <p className="text-red-500">{String(errors.project_id.message)}</p>}
                    </div>
                </div>
                <div className="flex-auto w-full mb-1 text-xs space-y-2">
                    <label htmlFor="category" className="font-semibold text-gray-600 py-2">Category</label>
                    <input
                        type="text"
                        id="category"
                        {...register("category")}
                        className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                    />
                    {errors.category && <p className="text-red-500">{String(errors.category.message)}</p>}
                </div>
                <p className="text-xs text-red-500 text-right my-3">Required fields are marked with an asterisk*</p>
                <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                    <button type="reset" className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Add"}</button>
                </div>
            </form>
            <DevTool control={control} />
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                success={modalStatus}
                message={modalMessage}
                redirectUrl={modalStatus ? "/amenities" : undefined}
            />
        </div>
    )
}
