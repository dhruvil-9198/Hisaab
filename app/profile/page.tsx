import { getUser } from "@/lib/getUser"
import Profile from "@/components/profile";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/navbar";

export default async function profile() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    let user
    if (token)
        user = await getUser();
    return <>
        <Suspense fallback={<Spinner />}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
                <Navbar />
                {token ? (<Profile
                    name={user?.name ?? ""}
                    username={user?.username ?? ""}
                    id={user?.id ?? ""}
                    password={user?.password ?? ""}
                    email={user?.email ?? ""}
                />) : (<div className="text-center text-gray-300 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-inner space-y-1">
                    <div>
                        Please <span className="text-orange-400 font-semibold">Log In</span> or <span className="text-orange-400 font-semibold">Sign Up</span>.
                    </div>
                    <div className="text-sm text-gray-500 italic">
                        Click on <span className="text-orange-500">Hisaab</span> if you don't see the option.
                    </div>
                </div>
                )}
            </div>
        </Suspense>
    </>
}