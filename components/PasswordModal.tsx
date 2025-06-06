'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';

export function PasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [oldPass, setoldPass] = useState('');
  const [password, setPassword] = useState('');
  const [RePass, setRePass] = useState('');
  const [Msg, setMsg] = useState('');
  const [oldPassMiss, setoldPassMiss] = useState(false);
  const [PassMiss, setPassMiss] = useState(false);
  const [RePassMiss, setRePassMiss] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isOldMiss = oldPass.trim() === '';
    const isPassMiss = password.trim() === '';
    const isReMiss = RePass.trim() === '';

    setoldPassMiss(isOldMiss);
    setPassMiss(isPassMiss);
    setRePassMiss(isReMiss);

    if (isOldMiss || isPassMiss || isReMiss) return;

    setIsLoading(true);
    const response = await fetch(`/api/changePass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPass, password }),
    });
    setIsLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setMsg(data.error);
      return;
    }

    router.refresh();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg relative">
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
              <Spinner />
            </div>
          )}
          <form className="space-y-4 relative z-0" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold text-orange-500 italic text-center">Change Password</h2>
            {Msg && <p className="text-sm text-red-500">{Msg}</p>}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Old Password</label>
              {oldPassMiss && <p className="text-sm text-red-500">Old password is required</p>}
              <input type="text" onChange={(e) => setoldPass(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">New Password</label>
              {PassMiss && <p className="text-sm text-red-500">New password is required</p>}
              <input type="password" onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
              {RePassMiss && <p className="text-sm text-red-500">Please confirm password</p>}
              {password !== RePass && <p className="text-sm text-red-500">Password did not match</p>}
              <input type="password" onChange={(e) => setRePass(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md" />
            </div>
            <button type="submit" className={`w-full py-2 mt-4 rounded-md ${oldPass && password && RePass ? 'bg-orange-500' : 'bg-gray-600'} text-white font-semibold`}>Change</button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}