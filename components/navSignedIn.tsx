"use client"
import { useRouter } from "next/navigation";

export default function NavSignedIn() {
    const router = useRouter();
    const handleLogout = async () => {
        const response = await fetch(`/api/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        router.push("/");
    }
    return (
        <div className="flex gap-4">
            <button onClick={() => { router.push("/settlement") }} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                Settlements
            </button>
            <button onClick={() => { router.push("/transactions") }} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                View History
            </button>
            <button onClick={() => { router.push("/profile") }} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-gray-200 hover:bg-orange-400 transition shadow">
                Profile
            </button>
            <button onClick={handleLogout} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                Logout
            </button>
        </div>
    )
}