import { getAllAccounts, getProjectData } from "@/utils/db/dbFunctions";
import { Account } from "@/utils/db/types";
import { useCallback, useEffect, useState } from "react";
import { onDeleteAction, onUpdateAction } from "../../actions";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { projectSchema } from "@/utils/db/schema";
import Modal from "@/components/Modal";

export default function UpdateProjectForm({ project }: { project: number }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [accountData, setAccountData] = useState<Account[] | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<z.output<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setAccountData(await getAllAccounts());

            const res = await getProjectData(project);

            if (res) {
                setValue("project_name", res.project_name);
                setValue("account_id", res.account_id);
                setValue("description", res.description || "");
            }
        } catch (error) {
            console.log("An error occurred:", error);
        } finally {
            setLoading(false);
        }
    }, [project, setValue]);

    useEffect(() => {
        fetchData();
    }, [project, fetchData]);

    async function onSubmit(data: z.output<typeof projectSchema>) {
        setLoading(true);

        const formData = new FormData();
        formData.append("project_id", String(project));
        formData.append("project_name", data.project_name);
        formData.append("accountId", String(data.account_id));
        if (data.description) formData.append("description", data.description);

        const response = await onUpdateAction(formData);

        if (response.success) {
            setModalMessage("Project updated successfully!");
            setModalStatus(true);
        } else {
            setModalMessage(`Failed to update project: ${response.message}`);
            setModalStatus(false);
        }

        setModalOpen(true);
        setLoading(false);
    }

    async function handleDeleteClick() {
        try {
            setLoading(true);
            if (confirm(`Are you sure you want to delete this project: ${project}`)) {
                const result = await onDeleteAction(project);

                if (result.success) {
                    setModalMessage("Project deleted successfully.");
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
            setModalMessage(`Failed to delete project. ${error}`);
            setModalStatus(false);
            setModalOpen(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                    <div className="mb-3 space-y-2 w-full text-xs">
                        <label htmlFor="project_name" className="font-semibold text-gray-600 py-2">
                            Project Name*
                        </label>
                        <input
                            type="text"
                            id="project_name"
                            {...register("project_name")}
                            placeholder="Project Name"
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        />
                        {errors.project_name?.message && (
                            <p className="text-red-500">{String(errors.project_name?.message)}</p>
                        )}
                    </div>
                </div>
                <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                    <div className="w-full flex flex-col mb-3">
                        <label htmlFor="account_id" className="font-semibold text-gray-600 py-2">
                            Account*
                        </label>
                        <select
                            id="account_id"
                            {...register("account_id", { valueAsNumber: true })}
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4 md:w-full"
                        >
                            <option value="">Select Account</option>
                            {accountData?.map((account) => (
                                <option key={account.account_id} value={account.account_id}>
                                    {account.account_name}
                                </option>
                            ))}
                        </select>
                        {errors.account_id && (
                            <p className="text-red-500">{String(errors.account_id.message)}</p>
                        )}
                    </div>
                </div>
                <div className="flex-auto w-full mb-1 text-xs space-y-2">
                    <label htmlFor="description" className="font-semibold text-gray-600 py-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...register("description")}
                        className="w-full min-h-[100px] max-h-[300px] h-28 appearance-none block bg-gray-900 text-white border border-gray-900 rounded-lg py-4 px-4"
                        placeholder="Enter your account info"
                    ></textarea>
                    {errors.description?.message && (
                        <p className="text-red-500">{String(errors.description?.message)}</p>
                    )}
                </div>
                <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="mb-2 md:mb-0 bg-red-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-500"
                    >
                        Delete
                    </button>
                    <button
                        type="submit"
                        className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500 disabled:bg-gray-600"
                        disabled={loading}
                    >
                        {loading ? "Updating" : "Update"}
                    </button>
                </div>
            </form>
            <DevTool control={control} />
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                success={modalStatus}
                message={modalMessage}
                redirectUrl={modalStatus ? `/projects/${project}` : undefined}
            />
        </>
    );
}
