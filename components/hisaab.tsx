"use client"
import { useRouter } from "next/navigation"

export default function Hisaab() {
    const router = useRouter();
    return (
        <button onClick={() => { router.push('/') }} className="text-3xl cursor-pointer font-bold text-orange-500 tracking-wide">
            Hisaab
        </button>
    )
}