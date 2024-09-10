'use client'

import { useState } from "react";
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from "@/components/Modal";
import { contactSchema } from "@/utils/db/schema";

export default function ContactForm() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.output<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
    });

    async function onSubmit(data: z.output<typeof contactSchema>) {
        const formData = new FormData();
        formData.append("name", String(data.name));
        formData.append("email", String(data.email));
        formData.append("message", String(data.message));

        const res = await fetch("/api/sendgrid", {
            body: JSON.stringify({
                email: data.email,
                name: data.name,
                message: data.message,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });

        const { error } = await res.json();

        if (res.ok) {
            setModalMessage("Form submitted successfully");
            setModalOpen(true);
            setModalStatus(true);
        } else {
            console.log(error)
            setModalMessage(`Error: ${error}`);
            setModalOpen(true);
            setModalStatus(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                    <div className="mb-3 space-y-2 w-full text-xs">
                        <label htmlFor="name" className="font-semibold text-gray-600 py-2">Name</label>
                        <input
                            id="name"
                            {...register("name")}
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        />
                        {errors.name?.message && <p className="text-red-500">{String(errors.name?.message)}</p>}
                    </div>
                </div>
                <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                    <div className="mb-3 space-y-2 w-full text-xs">
                        <label htmlFor="email" className="font-semibold text-gray-600 py-2">E-mail</label>
                        <input
                            id="email"
                            {...register("email")}
                            className="appearance-none block w-full bg-gray-900 text-white border border-gray-900 rounded-lg h-10 px-4"
                        />
                        {errors.email?.message && <p className="text-red-500">{String(errors.email?.message)}</p>}
                    </div>
                </div>
                <div className="flex-auto w-full mb-1 text-xs space-y-2">
                    <label htmlFor="message" className="font-semibold text-gray-600 py-2">Message</label>
                    <textarea
                        id="message"
                        {...register("message")}
                        className="w-full min-h-[100px] max-h-[300px] h-28 appearance-none block bg-gray-900 text-white border border-gray-900 rounded-lg  py-4 px-4"
                    ></textarea>
                    {errors.message?.message && <p className="text-red-500">{String(errors.message?.message)}</p>}
                </div>
                <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                    <button type="submit" className="mb-2 md:mb-0 rounded-xl px-5 tracking-wider bg-green-400 text-center font-medium text-gray-900 hover:bg-green-500" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send"}
                    </button>
                </div>
            </form>
            <DevTool control={control} />
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                success={modalStatus}
                message={modalMessage}
                redirectUrl={undefined}
            />
        </>
    );
}
