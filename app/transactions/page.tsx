import getTrans from "@/lib/getTrans";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/navbar";
import TransactionList from "@/components/transaction";

export default async function Transaction() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    let trans;
    if (token) {
        trans = await getTrans();
    }

    return (
        <Suspense fallback={<Spinner />}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-8 bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-4 overflow-y-auto scrollbar-hide">
                    <h2 className="text-2xl font-bold text-orange-500 italic text-center mb-4">
                        Transaction Log
                    </h2>

                    {token ? (
                        <TransactionList
                            transactions={
                                (trans || []).map((t: any) => ({
                                    id: t.id,
                                    To: t.To,
                                    Description: t.Description ?? "",
                                    Amount: Number(t.Amount),
                                    Date: t.Date instanceof Date ? t.Date.toISOString() : String(t.Date),
                                    Lend: t.Lend,
                                }))
                            }
                        />
                    ) : (
                        <div className="text-center text-gray-300 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-inner space-y-1">
                            <div>
                                Please <span className="text-orange-400 font-semibold">Log In</span> or{" "}
                                <span className="text-orange-400 font-semibold">Sign Up</span>.
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
