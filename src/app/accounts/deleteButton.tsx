import { useState } from "react";
import { onDeleteAction } from "./actions";
import Spinner from "@/components/spinner/Spinner";
import Modal from "@/components/Modal";

export default function DeleteButton({ account }: { account: number }) {
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalSuccess, setModalSuccess] = useState(false);

    async function handleDelete() {
        if (confirm(`Are you sure you want to delete this account: ${account}`)) {
            try {
                setLoading(true);
                const result = await onDeleteAction(account);

                if (result.success) {
                    setModalMessage("Account deleted successfully.");
                    setModalSuccess(true);
                } else {
                    setModalMessage(result.message ?? "An unknown error occurred.");
                    setModalSuccess(false);
                }

                // Show modal and set redirect URL after a short delay
                setModalOpen(true);
            } catch (error) {
                setModalMessage('Failed to delete account.');
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
                Delete account
            </button>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                message={modalMessage}
                success={modalSuccess}
                redirectUrl={modalSuccess ? "/accounts" : undefined}
            />
        </>
    );
}
