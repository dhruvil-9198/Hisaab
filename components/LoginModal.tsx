'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [eu, seteu] = useState('');
  const [password, setPassword] = useState('');
  const [Msg, setMsg] = useState('');
  const [EmailMiss, setEmailMiss] = useState(false);
  const [PassMiss, setPassMiss] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailMiss = eu.trim() === '';
    const isPassMiss = password.trim() === '';
    setEmailMiss(isEmailMiss);
    setPassMiss(isPassMiss);
    if (isEmailMiss || isPassMiss) return;

    let username = '', email = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(eu)) username = eu; else email = eu;

    setIsLoading(true);
    const response = await fetch(`/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
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
            <h2 className="text-3xl font-bold text-orange-500 italic text-center">Log In to Hisaab</h2>
            {Msg && <p className="text-sm text-red-500">{Msg}</p>}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email/Username</label>
              {EmailMiss && <p className="text-sm text-red-500">Email or Username is required</p>}
              <input type="text" placeholder="Enter email or username" onChange={(e) => seteu(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              {PassMiss && <p className="text-sm text-red-500">Password is required</p>}
              <input type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md" />
            </div>
            <button type="submit" className="w-full py-2 mt-4 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-400">Log In</button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
