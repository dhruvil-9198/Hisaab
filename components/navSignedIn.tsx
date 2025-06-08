"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";

export default function NavSignedIn() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await fetch(`/api/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        router.push("/");
    };

    const goHome = () => {
        router.push("/");
    };

    const handleNavigate = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="hidden md:flex gap-4">
                {pathname === "/settlement" ? (
                    <button onClick={goHome} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                        Home
                    </button>
                ) : (
                    <button onClick={() => router.push("/settlement")} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                        Settlements
                    </button>
                )}

                {pathname === "/transactions" ? (
                    <button onClick={goHome} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                        Home
                    </button>
                ) : (
                    <button onClick={() => router.push("/transactions")} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                        View History
                    </button>
                )}

                {pathname === "/profile" ? (
                    <button onClick={goHome} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                        Home
                    </button>
                ) : (
                    <button onClick={() => router.push("/profile")} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                        Profile
                    </button>
                )}

                <button onClick={handleLogout} className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-orange-400 transition shadow">
                    Logout
                </button>
            </div>

            <div className="md:hidden flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md text-white hover:bg-orange-400 transition"
                >
                    <FiMenu size={24} />
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 flex flex-col">
                    {pathname === "/settlement" ? (
                        <button onClick={() => { goHome(); }} className="px-4 py-2 text-left text-white hover:bg-orange-400 transition">
                            Home
                        </button>
                    ) : (
                        <button onClick={() => handleNavigate("/settlement")} className="px-4 py-2 text-left text-white hover:bg-orange-400 transition">
                            Settlements
                        </button>
                    )}

                    {pathname === "/transactions" ? (
                        <button onClick={() => { goHome(); }} className="px-4 py-2 text-left text-white hover:bg-orange-400 transition">
                            Home
                        </button>
                    ) : (
                        <button onClick={() => handleNavigate("/transactions")} className="px-4 py-2 text-left text-white hover:bg-orange-400 transition">
                            View History
                        </button>
                    )}

                    {pathname === "/profile" ? (
                        <button onClick={() => { goHome(); }} className="px-4 py-2 text-left text-white hover:bg-orange-400 transition">
                            Home
                        </button>
                    ) : (
                        <button onClick={() => handleNavigate("/profile")} className="px-4 py-2 text-left text-white hover:bg-orange-400 transition">
                            Profile
                        </button>
                    )}

                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="px-4 py-2 text-left text-white hover:bg-orange-400 transition">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
