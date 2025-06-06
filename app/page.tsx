import SignedOut from "@/components/SignedOut"
import { cookies } from "next/headers"
import SignedIn from "@/components/SignedIn"
import { Suspense } from "react"
import Spinner from "@/components/Spinner"
import Navbar from "@/components/navbar"

export default async function Home() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token')?.value;

  return (
    <Suspense fallback={<Spinner />}>
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 pb-10`}
      >
        <Navbar />
        {token ? (
          <SignedIn />
        ) : (
          <SignedOut />
        )}
      </div>
    </Suspense>
  )
}
