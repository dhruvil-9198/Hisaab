"use client";
import { useState, useMemo } from "react";

type Props = {
    transactions: {
        id: string;
        To: string;
        Description: string;
        Amount: Number;
        Date: string;
        Lend: boolean;
    }[];
};

function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function TransactionList({ transactions }: Props) {
    const [filter, setFilter] = useState<"All" | "Month" | "Year">("All");

    const now = new Date();

    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            const d = new Date(t.Date);
            if (filter === "Month") {
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            } else if (filter === "Year") {
                return d.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }, [transactions, filter]);

    const total = filtered
        .filter((t) => Number(t.Amount) > 0)
        .reduce((sum, t) => sum + Number(t.Amount), 0);

    return (
        <>
            <div className="flex justify-between items-center border border-gray-700 bg-gray-800 rounded-lg p-3 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                    <label className="text-gray-400">Filter:</label>
                    <select
                        className="bg-gray-900 text-orange-400 border border-gray-600 rounded px-2 py-1"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as "All" | "Month" | "Year")}
                    >
                        <option value="All">All Time</option>
                        <option value="Month">This Month</option>
                        <option value="Year">This Year</option>
                    </select>
                </div>
                <div className="font-semibold text-sm sm:text-base">
                    Total Spent: ₹{total}
                </div>
            </div>

            <div className="space-y-4 mt-4">
                {filtered.length > 0 ? (
                    filtered.map((e) => (
                        <div key={e.id} className="flex justify-between items-center border-b border-gray-700 pb-3">
                            <div className="flex flex-col">
                                <span className="text-blue-400 text-xl font-semibold">{e.To}</span>
                                <span className="text-gray-300 text-sm">{e.Description}</span>
                                <span className="text-gray-400 text-xs mt-1">{formatDate(e.Date)}</span>
                            </div>
                            <span className={`text-lg font-bold ${Number(e.Amount) <= 0 ? "text-green-500" : "text-red-500"}`}>
                                {Number(e.Amount) <= 0 ? `+ ₹${Math.abs(Number(e.Amount))}` : `- ₹${Number(e.Amount)}`}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-300 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-inner">
                        No transactions found.
                    </div>
                )}
            </div>
        </>
    );
}
