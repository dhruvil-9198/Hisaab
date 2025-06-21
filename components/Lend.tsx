"use client";

import { useState } from "react";
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Dropdown from "./Dropdown";

type TransactionType = {
    id: string,
    username: string,
    userId: string,
    balance: Number,
};

type ClientWrapperProps = {
    others: TransactionType[];
};

export default function Lend({ others }: ClientWrapperProps) {
    const [parsed, setParsed] = useState(others);


    const [err, seterr] = useState('')
    const [from, setFrom] = useState('');
    const [LendTo, setLendTo] = useState('');
    const [lendAmount, setLendAmount] = useState('');
    const [lendDesc, setLendDesc] = useState('');

    const [SelectedFrom, setSelectedFrom] = useState<TransactionType>();
    const [selectedTo, setSelectedTo] = useState<TransactionType>();

    const handleAddTransaction = async () => {
        if (!LendTo.trim() || !from.trim() || !lendAmount.trim()) {
            seterr('To/From and Amount are required');
            return;
        }
        else if (LendTo === from) {
            seterr('Self transfer not allowed');
            return;
        }
        else if (lendAmount.startsWith('-')) {
            seterr('Amount cannot be negative');
            return;
        }

        seterr('');
        const response = await fetch(`/api/trans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trans: false,
                From: from,
                to: LendTo,
                amt: lendAmount,
                desc: lendDesc,
            }),
        });

        if (response.ok) {
            setFrom('');
            setLendTo('');
            setSelectedFrom(undefined)
            setSelectedTo(undefined)
            setLendAmount('');
            setLendDesc('');
            toast.success('Transaction added successfully!');
        }
        else {
            toast.error('Failed to add transaction.');
        }
    };


    return <>
        <Toaster position="top-right" reverseOrder={false} />
        <div>
            <motion.div
                key="lend-borrow"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-lg mx-auto bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-6"
            >
                <h2 className="text-2xl font-bold text-orange-500 font-playfair italic">
                    Lend / Borrow
                </h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddTransaction();
                    }}
                    className="space-y-4"
                >
                    {err && <label className="block text-sm font-medium text-red-500 mb-1">{err}</label>}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">From</label>
                        <Dropdown
                            parsed={parsed}
                            setParsed={setParsed}
                            setParty={setFrom}
                            selectedUser={SelectedFrom}
                            setSelectedUser={setSelectedFrom}
                        />

                        <label className="block text-sm font-medium text-gray-300">To</label>
                        <Dropdown
                            parsed={parsed}
                            setParsed={setParsed}
                            setParty={setLendTo}
                            selectedUser={selectedTo}
                            setSelectedUser={setSelectedTo}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Amount</label>
                        <input
                            type="number"
                            placeholder="Amount (in Rs.)"
                            value={lendAmount}
                            onChange={(e) => setLendAmount(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <input
                            type="text"
                            placeholder="Description"
                            value={lendDesc}
                            onChange={(e) => setLendDesc(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 mt-4 cursor-pointer rounded-md bg-orange-500 text-white font-semibold font-space-grotesk hover:bg-orange-400 transition"
                    >
                        Add Transaction
                    </button>
                </form>
            </motion.div>
        </div>
    </>
}