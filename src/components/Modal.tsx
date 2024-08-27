import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  message: string;
};

export default function Modal({ open, onClose, message }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5">
      <div className="w-full max-w-[570px] rounded-[20px] bg-white px-8 py-12 text-center dark:bg-dark-2 md:px-[70px] md:py-[60px]">
        <h3 className="pb-[18px] text-xl font-semibold text-black dark:text-white sm:text-2xl">
          {message}
        </h3>
        <div className="-mx-3 flex flex-wrap">
          <div className="w-full px-3">
            <button
              onClick={onClose}
              className="block w-full rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:bg-blue-dark"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
