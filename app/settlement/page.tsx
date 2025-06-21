import Navbar from "@/components/navbar";
import Spinner from "@/components/Spinner";
import Settlement from "@/components/settlement";
import { getSettlement } from "@/lib/getSettlement";
import { cookies } from "next/headers";
import { Suspense } from "react";


export default async function Settlements() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    let trans
    if (token)
        trans = await getSettlement();
    trans = (trans ?? []).map((user) => ({
        ...user,
        balance: user.balance.toNumber(),
    }));

    return (
        <Suspense fallback={<Spinner />}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-8 bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg space-y-4 overflow-y-auto scrollbar-hide">
                    <h2 className="text-2xl font-bold text-orange-500 italic text-center mb-4">
                        Settlements
                    </h2>

                    {token ? (
                        <Settlement trans={trans} />
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