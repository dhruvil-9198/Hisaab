"use client"
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal"
import { useState } from "react";
import { Wallet, Sparkles, ShieldCheck, ScrollText, Scale, Users } from "lucide-react"

export default function SignedOut() {
    const [modal, setModal] = useState(false)
    const [Smodal, setSModal] = useState(false)

    const features = [
        {
            icon: <Wallet size={28} className="text-orange-400" />,
            title: "Unified Transaction Logging",
            description: "Categorize each transaction as normal, lending, or borrowing in a single streamlined flow.",
        },
        {
            icon: <Users size={28} className="text-blue-400" />,
            title: "Contact-Based Tracking",
            description: "Link lending and borrowing records to specific people for clearer accountability.",
        },
        {
            icon: <Scale size={28} className="text-green-500" />,
            title: "Auto Net Balance",
            description: "Automatically calculates how much you owe or are owed, across all transactions.",
        },
        {
            icon: <ScrollText size={28} className="text-purple-400" />,
            title: "Comprehensive Ledger View",
            description: "View detailed logs of your entire financial history, neatly categorized and searchable.",
        },
        {
            icon: <Sparkles size={28} className="text-pink-400" />,
            title: "Minimalist Interface",
            description: "Focus on what matters with a clean, distraction-free UI optimized for speed.",
        },
        {
            icon: <ShieldCheck size={28} className="text-red-400" />,
            title: "Secure Access",
            description: "Your data is protected with authentication and safe storage mechanisms.",
        }
    ]

    return (
        <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="space-y-6">
                <h1 className="text-4xl sm:text-6xl font-bold text-orange-500 font-playfair tracking-tight leading-tight italic">
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                        Hisaab
                    </span>
                </h1>
                <p className="text-lg text-gray-300 max-w-xl mx-auto font-space-grotesk">
                    One-stop solution to manage all your financial transactions. Please log in to continue.
                </p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setModal(true)} className="px-5 py-2 cursor-pointer bg-orange-500 rounded-md text-white font-semibold hover:bg-orange-400 transition">
                        Log In
                    </button>
                    <LoginModal isOpen={modal} onClose={() => setModal(false)} />
                    <button onClick={() => setSModal(true)} className="px-5 py-2 cursor-pointer bg-gray-700 rounded-md text-white font-semibold hover:bg-gray-600 transition">
                        Sign Up
                    </button>
                    <SignUpModal isOpen={Smodal} onClose={() => setSModal(false)} />
                </div>
                <div>
                    <h2 className="text-3xl font-semibold text-gray-200 font-playfair mb-6 italic">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="bg-gradient-to-tr from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-5 shadow-lg transition transform hover:scale-[1.03] hover:border-orange-400 group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-gray-700 p-2 rounded-full group-hover:bg-orange-300 transition">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-100 font-playfair">{feature.title}</h3>
                                </div>
                                <p className="text-gray-400 text-sm font-space-grotesk">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}