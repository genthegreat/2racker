'use client';

import { useState } from "react";
import { onDeleteAction } from "./actions";
import Spinner from "@/components/spinner/Spinner";
import Modal from "@/components/Modal";

export default function DeleteButton({ project }: { project: number }) {
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalSuccess, setModalSuccess] = useState(false);

    async function handleDelete() {
        if (confirm(`Are you sure you want to delete this project: ${project}`)) {
            try {
                setLoading(true);
                const result = await onDeleteAction(project);

                if (result.success) {
                    setModalMessage("Project deleted successfully.");
                    setModalSuccess(true);
                } else {
                    setModalMessage(result.message ?? "An unknown error occurred.");
                    setModalSuccess(false);
                }

                // Show modal and set redirect URL after a short delay
                setModalOpen(true);
            } catch (error) {
                setModalMessage('Failed to delete project.');
                setModalSuccess(false);
                setModalOpen(true);
            } finally {
                setLoading(false);
            }
        }
    }

    if (loading) return <Spinner />;

    return (
        <>
            <button
                onClick={handleDelete}
                className="w-52 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Delete project
            </button>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                message={modalMessage}
                success={modalSuccess}
                redirectUrl={modalSuccess ? "/projects" : undefined}
            />
        </>
    );
}
