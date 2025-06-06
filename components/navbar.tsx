import { cookies } from "next/headers";
import NavSignedIn from "./navSignedIn";
import Hisaab from "./hisaab";


export default async function Navbar() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token')?.value;

  return (
    <div className="shadow-lg bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 text-gray-100">
      <header className="flex justify-between items-center px-8 py-5 ">
        <Hisaab />
        {token ? <NavSignedIn /> : (
          <div className="flex gap-4">

          </div>
        )}
      </header>
    </div>
  )
}
