'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';

export default function SignUpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [EmailMiss, setEmailMiss] = useState(false);
  const [name, setName] = useState('');
  const [nameMiss, setNameMiss] = useState(false);
  const [username, setUsername] = useState('');
  const [userMiss, setUserMiss] = useState(false);
  const [password, setPassword] = useState('');
  const [PassMiss, setPassMiss] = useState(false);
  const [passInvalid, setPassInvalid] = useState(false);
  const [Repass, setRepass] = useState('');
  const [RePassMiss, setRePassMiss] = useState(false);
  const [Mismatch, setMismatch] = useState(false);
  const [Msg, setMsg] = useState('');
  const [otp, setOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const sendOtp = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);

    setIsLoading(true);
    const res = await fetch(`/api/sendotp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: generatedOtp }),
    });
    setIsLoading(false);

    if (res.ok) {
      setOtpSent(true);
      setOtpError('');
    } else {
      const data = await res.json();
      setOtpError(data.error || 'Failed to send OTP');
    }
  };

  const isPasswordValid = (pass: string): boolean => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const digit = /[0-9]/;
    const special = /[!@#$%^&*(),.?":{}|<>]/;
    return minLength.test(pass) && upper.test(pass) && lower.test(pass) && digit.test(pass) && special.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailMiss = email.trim() === '';
    const isPassMiss = password.trim() === '';
    const isNameMiss = name.trim() === '';
    const isRePassMiss = Repass.trim() === '';
    const isUserMiss = username.trim() === '';
    const isMismatch = password !== Repass;

    setEmailMiss(isEmailMiss);
    setPassMiss(isPassMiss);
    setNameMiss(isNameMiss);
    setRePassMiss(isRePassMiss);
    setUserMiss(isUserMiss);
    setMismatch(isMismatch);

    if (isEmailMiss || isPassMiss || isNameMiss || isRePassMiss || isUserMiss || isMismatch) return;

    const isInvalid = !isPasswordValid(password);
    setPassInvalid(isInvalid);
    if (isInvalid) return;

    if (!otpSent) {
      await sendOtp();
      return;
    }

    if (otp !== otpInput) {
      setOtpError('Incorrect OTP');
      return;
    }

    setIsLoading(true);
    const response = await fetch(`/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, username, password }),
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
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
              <Spinner />
            </div>
          )}

          <form className="space-y-4 relative z-0" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold text-orange-500 italic text-center">Create Account</h2>

            {Msg && <label className="block text-sm font-medium text-red-500 mb-1">{Msg}</label>}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              {nameMiss && <label className="block text-sm font-medium text-red-500 mb-1">Name is required</label>}
              <input
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              {EmailMiss && <label className="block text-sm font-medium text-red-500 mb-1">Email is required</label>}
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              {userMiss && <label className="block text-sm font-medium text-red-500 mb-1">Username is required</label>}
              <input
                type="text"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              {PassMiss && <label className="block text-sm font-medium text-red-500 mb-1">Password is required</label>}
              {passInvalid && (
                <label className="block text-sm font-medium text-red-500 mb-1">
                  Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                </label>
              )}
              <input
                type="password"
                placeholder="Create password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              {RePassMiss && <label className="block text-sm font-medium text-red-500 mb-1">Please rewrite password</label>}
              {Mismatch && <label className="block text-sm font-medium text-red-500 mb-1">Re-entered password is different</label>}
              <input
                type="password"
                placeholder="Rewrite password"
                onChange={(e) => setRepass(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Enter OTP sent to your email</label>
                {otpError && <label className="block text-sm font-medium text-red-500 mb-1">{otpError}</label>}
                <input
                  type="text"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer py-2 mt-4 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-400 transition"
              disabled={isLoading}
            >
              {otpSent ? 'Verify & Sign Up' : 'Send OTP'}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
