import { useRouter } from "next/navigation";
import React from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    message: string;
    success: boolean;
    redirectUrl?: string; // Optional prop for redirect URL
};

export default function Modal({ open, onClose, message, success, redirectUrl }: ModalProps) {
    const router = useRouter();

    const handleClose = () => {
        if (redirectUrl) {
            router.replace(redirectUrl); // Replace the current history entry
            router.refresh();
        }
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-slate-900/10 backdrop-blur-sm px-4 py-5">
            <div className="w-full max-w-[570px] rounded-[20px] bg-slate-900 px-8 py-12 text-center md:px-[70px] md:py-[60px]">
                <div className="flex w-full px-4 py-4 md:p-5">
                    <div className={`${success ? 'bg-green-600' : 'bg-red-600'} mr-5 flex h-[34px] w-full max-w-[34px] items-center justify-center rounded-md`}>
                        {success ?
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_961_15637)">
                                    <path
                                        d="M8.99998 0.506248C4.3031 0.506248 0.506226 4.30312 0.506226 9C0.506226 13.6969 4.3031 17.5219 8.99998 17.5219C13.6969 17.5219 17.5219 13.6969 17.5219 9C17.5219 4.30312 13.6969 0.506248 8.99998 0.506248ZM8.99998 16.2562C5.00623 16.2562 1.77185 12.9937 1.77185 9C1.77185 5.00625 5.00623 1.77187 8.99998 1.77187C12.9937 1.77187 16.2562 5.03437 16.2562 9.02812C16.2562 12.9937 12.9937 16.2562 8.99998 16.2562Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M11.4187 6.38437L8.07183 9.64687L6.55308 8.15625C6.29996 7.90312 5.90621 7.93125 5.65308 8.15625C5.39996 8.40937 5.42808 8.80312 5.65308 9.05625L7.45308 10.8C7.62183 10.9687 7.84683 11.0531 8.07183 11.0531C8.29683 11.0531 8.52183 10.9687 8.69058 10.8L12.3187 7.3125C12.5718 7.05937 12.5718 6.66562 12.3187 6.4125C12.0656 6.15937 11.6718 6.15937 11.4187 6.38437Z"
                                        fill="white"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_961_15637">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            :
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_961_15645)">
                                    <path
                                        d="M9 0.506256C4.30313 0.506256 0.50625 4.30313 0.50625 9.00001C0.50625 13.6969 4.30313 17.5219 9 17.5219C13.6969 17.5219 17.5219 13.6969 17.5219 9.00001C17.5219 4.30313 13.6969 0.506256 9 0.506256ZM9 16.2563C5.00625 16.2563 1.77188 12.9938 1.77188 9.00001C1.77188 5.00626 5.00625 1.77188 9 1.77188C12.9938 1.77188 16.2563 5.03438 16.2563 9.02813C16.2563 12.9938 12.9938 16.2563 9 16.2563Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M11.5875 6.38438C11.3344 6.13125 10.9406 6.13125 10.6875 6.38438L9 8.1L7.28438 6.38438C7.03125 6.13125 6.6375 6.13125 6.38438 6.38438C6.13125 6.6375 6.13125 7.03125 6.38438 7.28438L8.1 9L6.38438 10.7156C6.13125 10.9688 6.13125 11.3625 6.38438 11.6156C6.49688 11.7281 6.66563 11.8125 6.83438 11.8125C7.00313 11.8125 7.17188 11.7563 7.28438 11.6156L9 9.9L10.7156 11.6156C10.8281 11.7281 10.9969 11.8125 11.1656 11.8125C11.3344 11.8125 11.5031 11.7563 11.6156 11.6156C11.8688 11.3625 11.8688 10.9688 11.6156 10.7156L9.9 9L11.6156 7.28438C11.8406 7.03125 11.8406 6.6375 11.5875 6.38438Z"
                                        fill="white"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_961_15645">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        }
                    </div>
                    <div className="w-full">
                        <h3 className="pb-[18px] text-xl font-semibold text-white sm:text-2xl">
                            {message}
                        </h3>
                    </div>
                </div>
                <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3">
                        <button
                            onClick={handleClose}
                            className={`block w-full rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:${success ? "bg-green-700" : "bg-red-700"}`}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
