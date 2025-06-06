"use client"
import { PrismaClient, User } from "@prisma/client"
import { useState } from "react"
import { PasswordModal } from "./PasswordModal"

export default function Profile(user: User) {
    const prisma = new PrismaClient();
    const [Name, setName] = useState(user.name)
    const [modal, setModal] = useState(false);

    const handleChange = async () => {
        const response = await fetch(`/api/changeName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Name
            }),
        });
    }

    return (
        <div
            className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 px-4 py-10 `}
        >
            <div className="max-w-2xl mx-auto space-y-6 bg-gray-950 p-6 rounded-2xl shadow-lg border border-gray-800">
                <h2 className="text-3xl font-semibold text-orange-500 mb-6 italic">Your Profile</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 text-gray-300">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-300">Username</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-800 text-gray-400 border border-gray-700 rounded-md cursor-not-allowed opacity-70"
                            value={user.username}
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-300">Email</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-800 text-gray-400 border border-gray-700 rounded-md cursor-not-allowed opacity-70"
                            value={user.email}
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-300">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 bg-gray-800 text-gray-400 border border-gray-700 rounded-md cursor-not-allowed opacity-70"
                            value={"********"}
                            disabled
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            disabled={Name === user.name}
                            onClick={handleChange}
                            className={`px-4 py-2 rounded-md cursor-pointer text-white transition-colors ${Name === user.name
                                ? "bg-gray-700 cursor-not-allowed"
                                : "bg-orange-600 hover:bg-orange-700"
                                }`}
                        >
                            Save changes
                        </button>
                        <button onClick={() => { setModal(true) }} className="px-4 py-2 rounded-md cursor-pointer bg-gray-800 hover:bg-orange-600 text-white transition-colors">
                            Change Password
                        </button>
                        <PasswordModal isOpen={modal} onClose={() => setModal(false)} />
                    </div>
                </div>
            </div>
        </div>
    )
}
