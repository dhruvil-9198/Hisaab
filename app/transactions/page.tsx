import getTrans from "@/lib/getTrans";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/navbar";

function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default async function Transaction() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    let trans;
    if (token)
        trans = await getTrans();

    return (
        <Suspense fallback={<Spinner />}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-8 bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-4 overflow-y-auto scrollbar-hide">
                    <h2 className="text-2xl font-bold text-orange-500 italic text-center mb-4">
                        Transaction Log
                    </h2>
                    {token ? (<div className="space-y-4">
                        {(trans && trans.length > 0) ? (trans.map((e) => (
                            <div key={e.id} className="flex justify-between items-center border-b border-gray-700 pb-3">
                                <div className="flex flex-col">
                                    <span className="text-blue-400 text-xl font-semibold">{e.To}</span>
                                    <span className="text-gray-300 text-sm">{e.Description}</span>
                                    <span className="text-gray-400 text-xs mt-1">{formatDate(e.Date)}</span>
                                </div>
                                <span className={`text-lg font-bold ${e.Amount.toNumber() <= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {e.Amount.toNumber() <= 0 ? `+ ₹${Math.abs(e.Amount.toNumber())}` : `- ₹${e.Amount.toNumber()}`}
                                </span>
                            </div>
                        ))) : (<div className="text-center text-gray-300 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-inner space-y-1">
                            <div>
                                Add a transaction to see logs.
                            </div>
                        </div>)}
                    </div>) : (<div className="text-center text-gray-300 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-inner space-y-1">
                        <div>
                            Please <span className="text-orange-400 font-semibold">Log In</span> or <span className="text-orange-400 font-semibold">Sign Up</span>.
                        </div>
                        <div className="text-sm text-gray-500 italic">
                            Click on <span className="text-orange-500">Hisaab</span> if you don't see the option.
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </Suspense>
    );
}
