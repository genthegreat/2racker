'use client'
import { useCallback, useEffect, useState } from 'react'
import { fetchAmenityDataById, getProjects } from '@/utils/db/dbFunctions';
import { Project } from '@/utils/db/types';
import { onDeleteAction, onUpdateAction } from '../../actions';
import Spinner from '@/components/spinner/Spinner';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { amenitySchema } from "@/utils/db/schema";
import Modal from "@/components/Modal";

export default function AddAmenityForm({ params: { amenity_id } }: { params: { amenity_id: number } }) {
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [projectData, setProjectData] = useState<Project[] | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalStatus, setModalStatus] = useState(false)
    const [modalMessage, setModalMessage] = useState("")

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<z.output<typeof amenitySchema>>({
        resolver: zodResolver(amenitySchema),
    })

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setProjectData(await getProjects(null))

            const res = await fetchAmenityDataById(amenity_id)

            if (res) {
                setValue("amenity_name", res.amenity_name)
                setValue("default_amount", res.default_amount)
                setValue("project_id", res.project_id)
                setValue("category", res.category)
            }

        } catch (error: any) {
            console.log("an error occured:", error)
        } finally {
            setLoading(false)
        }
    }, [amenity_id, setValue])

    useEffect(() => {
        fetchData()
    }, [amenity_id, fetchData]
    )

    async function onSubmit(data: z.output<typeof amenitySchema>) {
        setLoading(true);

        const formData = new FormData();
        formData.append("amenity_id", String(amenity_id))
        formData.append("amenity_name", data.amenity_name)
        formData.append("project_id", String(data.project_id))
        formData.append("default_amount", String(data.default_amount))
        if (data.category) formData.append("category", data.category)

        const response = await onUpdateAction(formData);

        if (response.success) {
            setModalMessage("Amenity updated successfully!");
            setModalStatus(true);
        } else {
            setModalMessage(`Failed to update amenity: ${response.message}`);
            setModalStatus(false);
        }

        setModalOpen(true);
        setLoading(false);
    }

    async function handleDeleteClick() {
        try {
            setLoading(true);
            if (confirm(`Are you sure you want to delete this amenity: ${amenity_id}`)) {
                const result = await onDeleteAction(amenity_id);

                if (result.success) {
                    setModalMessage("Amenity deleted successfully.");
                    setModalStatus(true);
                } else {
                    setModalMessage(result.message ?? `An unknown error occurred. ${result.message}`);
                    setModalStatus(false);
                }

                // Show modal and set redirect URL after a short delay
                setModalOpen(true);
            } else {
                router.refresh();
            }
        } catch (error) {
            setModalMessage(`Failed to delete amenity. ${error}`);
            setModalStatus(false);
            setModalOpen(true);
        } finally {
            setLoading(false);
        }
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
                                    <h2 className="font-semibold text-black text-lg mr-auto">Update Amenity</h2>
                                    <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
                                </div>
                                <div className="mt-5">
                                    <form onSubmit={handleSubmit(onSubmit)} className="form">
                                        <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <label htmlFor="amenity_name" className="font-semibold text-gray-600 py-2">Amenity Name*</label>
                                                <input
                                                    id="amenity_name"
                                                    {...register("amenity_name")}
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
                                                    className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                                                />
                                                {errors.default_amount && <p className="text-red-500">{String(errors.default_amount.message)}</p>}
                                            </div>
                                            <div className="w-full flex flex-col mb-3">
                                                <label htmlFor="project_id" className="font-semibold text-gray-600 py-2">Project*</label>
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
                                            <button onClick={() => router.back()} className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">Cancel</button>
                                            <button onClick={handleDeleteClick} className="mb-2 md:mb-0 bg-red-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-500" >Delete</button>
                                            <button type="submit" className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update"}</button>
                                        </div>
                                    </form>
                                    <DevTool control={control} />
                                    <Modal
                                        open={modalOpen}
                                        onClose={() => setModalOpen(false)}
                                        success={modalStatus}
                                        message={modalMessage}
                                        redirectUrl={modalStatus ? `/amenities` : undefined}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
