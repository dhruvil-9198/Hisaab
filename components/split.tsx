"use client";

import { useState } from "react";
import { motion } from 'framer-motion';
import MultiSelectDropdown from "./MultiSelect";
import toast, { Toaster } from 'react-hot-toast';

type TransactionType = {
    id: string,
    username: string,
    userId: string,
    balance: Number,
};

type ClientWrapperProps = {
  others: TransactionType[];
};

export default function split({others}: ClientWrapperProps) {
    const [splitAmount, setSplitAmount] = useState('');
    const [splitDesc, setSplitDesc] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<TransactionType[]>([]);
    const [times, setTimes] = useState<{ [key: string]: number }>({})
    const [err, seterr] = useState('');
    const [parsed, setParsed] = useState(others);

    const handleAddTransaction = async () => {
        if (!splitAmount || selectedUsers.length === 0) {
            seterr('Please enter an amount and select at least one person.');
            return;
        }

        const totalWeight = selectedUsers.reduce(
            (acc, user) => acc + (times[user.username] || 1),
            0
        );

        const results = await Promise.all(
            selectedUsers.map(async (user) => {
                const userWeight = times[user.username] || 1;
                const share = (+splitAmount * userWeight) / totalWeight;

                const response = await fetch(`/api/trans`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        trans: false,
                        Lend: true,
                        to: user.username,
                        amt: share,
                        desc: `(Split) ${splitDesc}`,
                    }),
                });

                return response.ok;
            })
        );

        if (results.every((ok) => ok)) {
            setSplitAmount('');
            setSplitDesc('');
            setSelectedUsers([]);
            setTimes({});
            seterr('');
            toast.success('Transaction added successfully!');
        } else {
            toast.error('Failed to add transaction.');
        }

    }


    return <>
        <Toaster position="top-right" reverseOrder={false} />
        <div>
            <motion.div
                key="split"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-lg mx-auto bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-6"
            >
                <h2 className="text-2xl font-bold text-orange-500 font-playfair italic">Split Amount</h2>
                {err && <label className="block text-sm font-medium text-red-500">{err}</label>}

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Amount</label>
                    <input
                        type="number"
                        placeholder="Amount (in Rs.)"
                        value={splitAmount}
                        onChange={(e) => setSplitAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                <MultiSelectDropdown
                    parsed={parsed}
                    setParsed={setParsed}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                />

                {selectedUsers.length > 0 &&
                    selectedUsers.map((user) => (
                        <div
                            key={user.username}
                            className="flex items-center gap-4 py-2 border-b border-gray-700 last:border-b-0"
                        >
                            <span className="flex-1 text-gray-200 truncate">{user.username}</span>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() =>
                                        setTimes((prev) => ({
                                            ...prev,
                                            [user.username]: Math.max(1, (prev[user.username] || 1) - 1),
                                        }))
                                    }
                                    className="px-3 py-1 bg-gray-700 text-white rounded-md"
                                >
                                    -
                                </button>

                                <div className="w-10 text-center text-white">
                                    {times[user.username] || 1}
                                </div>

                                <button
                                    onClick={() =>
                                        setTimes((prev) => ({
                                            ...prev,
                                            [user.username]: (prev[user.username] || 1) + 1,
                                        }))
                                    }
                                    className="px-3 py-1 bg-gray-700 text-white rounded-md"
                                >
                                    +
                                </button>
                            </div>

                            <span className="w-16 text-right text-sm text-gray-400">
                                ₹
                                {(() => {
                                    const totalWeight = selectedUsers.reduce(
                                        (acc, u) => acc + (times[u.username] || 1),
                                        0
                                    );
                                    const userWeight = times[user.username] || 1;
                                    return splitAmount
                                        ? ((+splitAmount * userWeight) / totalWeight).toFixed(2)
                                        : '0.00';
                                })()}
                            </span>
                        </div>
                    ))}


                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <input
                        type="text"
                        placeholder="Description"
                        value={splitDesc}
                        onChange={(e) => setSplitDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <button
                    type="submit"
                    onClick={handleAddTransaction}
                    className="w-full py-2 mt-4 cursor-pointer rounded-md bg-orange-500 text-white font-semibold font-space-grotesk hover:bg-orange-400 transition"
                >
                    Add
                </button>
            </motion.div>
        </div>
    </>
}