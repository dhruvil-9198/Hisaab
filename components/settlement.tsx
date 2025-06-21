"use client"
import { useState, useEffect } from "react";
import { ConfirmationModal } from "@/components/ConfirmationModal"
import toast, { Toaster } from 'react-hot-toast';


type TransactionType = {
    balance: Number,
    id: string,
    username: string,
    userId: string,
};
type SimplifiedTransaction = { from: string; to: string; amount: number };

export default function Settlement({ trans }: { trans: TransactionType[] }) {
    const [arr, setarr] = useState(trans)
    const [totals, setTotals] = useState({ taken: 0, given: 0 });
    const [simplified, setSimplified] = useState<SimplifiedTransaction[]>([]);
    const [showSimplified, setShowSimplified] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<() => void>(() => { });

    const updateTotals = (data: TransactionType[]) => {
        const taken = data.filter(e => Number(Number(e.balance)) > 0).reduce((sum, e) => sum + Number(Number(e.balance)), 0);
        const given = data.filter(e => Number(Number(e.balance)) < 0).reduce((sum, e) => sum - Number(Number(e.balance)), 0);
        setTotals({ taken, given });
    };

    useEffect(() => {
        updateTotals(trans);
    }, []);

    const simplifyDebts = (data: TransactionType[]) => {

        const creditors = data.filter(t => Number(t.balance) > 0).map(t => ({ ...t }));
        const debtors = data.filter(t => Number(t.balance) < 0).map(t => ({ ...t, balance: -Number(t.balance) }));

        creditors.sort((a, b) => Number(a.balance) - Number(b.balance));
        debtors.sort((a, b) => Number(a.balance) - Number(b.balance));

        const result: SimplifiedTransaction[] = [];
        let i = 0, j = 0;

        while (i < creditors.length && j < debtors.length) {
            const give = Math.min(Number(creditors[i].balance), Number(debtors[j].balance));
            result.push({ from: creditors[i].username, to: debtors[j].username, amount: give });

            creditors[i].balance = Number(creditors[i].balance) - give;
            debtors[j].balance = Number(debtors[j].balance) - give;

            if (Number(creditors[i].balance) === 0) i++;
            if (Number(debtors[j].balance) === 0) j++;
        }

        for (; i < creditors.length; i++) {
            result.push({ from: creditors[i].username, to: "You", amount: Number(creditors[i].balance) });
        }

        for (; j < debtors.length; j++) {
            result.push({ from: "You", to: debtors[j].username, amount: Number(debtors[j].balance) });
        }

        setSimplified(result);
    };

    const handleDone = async (from: string, to: string, amt: number) => {
        let desc: string;

        if (from === "me") {
            desc = `(From Settlement)
            Paid ₹${amt} to ${to}`
        }
        else if (to === "me") {
            desc = `(From Settlement)
            ${from} paid ₹${amt}`
        }
        else {
            desc = `(From Settlement)
            ${from} paid ₹${amt} to ${to}`
        }

        const response = await fetch(`/api/trans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trans: false,
                From: from,
                to: to,
                amt: amt,
                desc: desc,
            }),
        });
        if (response.ok) {
            toast.success('Transaction settled successfully!');
        }
        else {
            toast.error('Failed to settle transaction.');
        }

        const updated = (arr ?? []).map(t => {
            if (t.username === from) return { ...t, balance: Number(t.balance) - amt };
            if (t.username === to) return { ...t, balance: Number(t.balance) + amt };
            return t;
        }).filter(t => Number(t.balance) !== 0);

        setarr(updated);
        updateTotals(updated);
        if (showSimplified) simplifyDebts(updated);
    };

    const openConfirmation = (action: () => void) => {
        setPendingAction(() => action);
        setIsModalOpen(true);
    };

    return <>
        <Toaster position="top-right" reverseOrder={false} />
        <div>
            <div>
                {arr && arr.length > 0 && (
                    <div>
                        <div className="flex justify-around text-sm sm:text-base text-center font-semibold">
                            <div className="text-green-400">
                                To Take<br />
                                <span className="text-xl">₹{totals.taken}</span>
                            </div>
                            <div className="text-red-400">
                                To Give<br />
                                <span className="text-xl">₹{totals.given}</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={() => {
                                    if (!showSimplified) simplifyDebts(arr);
                                    setShowSimplified(!showSimplified);
                                }}
                                className="mt-3 px-4 py-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow arrition-all"
                            >
                                {showSimplified ? "Hide Simplified Debts" : "Simplify Debts"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {showSimplified && simplified.length > 0 && (
                        <div className="mt-6 space-y-3 bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <h3 className="text-center text-lg font-semibold text-orange-400">
                                Simplified Settlements
                            </h3>
                            {simplified.map((s, idx) => {
                                const isMe = s.to === "You";
                                const isMeR = s.from === "You";
                                return (
                                    <div key={idx} className="flex justify-between items-center text-sm text-gray-200 text-center">
                                        <div>
                                            {(isMe || isMeR) ? (
                                                <>
                                                    <span className="text-blue-400 font-medium">{s.from}</span> pays{" "}
                                                    <span className="text-red-500 font-medium">₹{s.amount}</span> to{" "}
                                                    <span className="text-blue-400 font-medium">{s.to}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-blue-400 font-medium">{s.from}</span> pays{" "}
                                                    <span className="text-green-400 font-medium">₹{s.amount}</span> to{" "}
                                                    <span className="text-blue-400 font-medium">{s.to}</span>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            className="flex items-center gap-1 px-3 py-1 cursor-pointer bg-orange-600 hover:bg-orange-500 text-sm rounded-md font-medium arrition-all"
                                            onClick={() =>
                                                openConfirmation(() =>
                                                    handleDone(
                                                        s.from === "You" ? "me" : s.from,
                                                        s.to === "You" ? "me" : s.to,
                                                        s.amount
                                                    )
                                                )
                                            }
                                        >
                                            ✖ Mark as Done
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {arr && arr.length > 0 ? (
                        arr.map((e) => {
                            const amount = Math.abs(Number(e.balance));
                            const isPositive = Number(e.balance) >= 0;

                            return (
                                <div key={e.userId} className="border-b border-gray-700 pb-3">
                                    <span className="text-gray-300 font-semibold">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                {isPositive ? (
                                                    <>
                                                        <span className="text-blue-400 font-medium">{e.username}</span> gives you{" "}
                                                        <span className="text-green-500 font-semibold">₹{amount}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        You give{" "}
                                                        <span className="text-red-500 font-semibold">₹{amount}</span> to{" "}
                                                        <span className="text-blue-400 font-medium">{e.username}</span>
                                                    </>
                                                )}
                                            </div>
                                            <button
                                                className="flex items-center gap-1 px-3 py-1 cursor-pointer bg-orange-600 hover:bg-orange-500 text-sm rounded-md font-medium arrition-all"
                                                onClick={() =>
                                                    openConfirmation(() =>
                                                        handleDone(
                                                            isPositive ? e.username : "me",
                                                            isPositive ? "me" : e.username,
                                                            amount
                                                        )
                                                    )
                                                }
                                            >
                                                ✖ Mark as Done
                                            </button>
                                        </div>
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-300 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-inner space-y-1">
                            <div>
                                Lend or Borrow some money to see settlements..
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={pendingAction}
            />
        </div>
    </>
}