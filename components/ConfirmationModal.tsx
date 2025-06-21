'use client';

import { Dialog } from '@headlessui/react';

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-14 w-14 text-yellow-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.29 2.86c.55-.32 1.22-.32 1.77 0l7.01 4.05c.55.32.89.91.89 1.54v8.1c0 .63-.34 1.22-.89 1.54l-7.01 4.05a1.998 1.998 0 01-1.77 0l-7.01-4.05A1.75 1.75 0 013 16.55v-8.1c0-.63.34-1.22.89-1.54l7.01-4.05z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01"
                />
              </svg>

              <h2 className="text-2xl font-bold text-orange-500 italic text-center">
                Mark as Done
              </h2>
            </div>

            <p className="text-gray-300 text-center">
              You are about to settle a transaction. Make sure you have
              <span className="text-green-400 font-semibold"> received</span> or
              <span className="text-red-400 font-semibold"> paid</span> the amount.
            </p>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2 cursor-pointer rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 cursor-pointer rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
              >
                Proceed
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}