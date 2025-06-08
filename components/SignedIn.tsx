'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function SignedIn() {
  const [trans, setTrans] = useState(true);
  const [Lend, setLend] = useState(true);

  const [err, seterr] = useState('');

  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [party, setParty] = useState('');
  const [lendAmount, setLendAmount] = useState('');
  const [lendDesc, setLendDesc] = useState('');

  const handleAddTransaction = async () => {
    if (trans) {
      if (!to.trim() || !amount.trim()) {
        seterr('To and Amount are required');
        return;
      }
      if (amount.startsWith('-')) {
        seterr('Amount cannot be negative');
        return;
      }
    } else {
      if (!party.trim() || !lendAmount.trim()) {
        seterr('To/From and Amount are required');
        return;
      }
      if (lendAmount.startsWith('-')) {
        seterr('Amount cannot be negative');
        return;
      }
    }

    seterr('');

    const response = await fetch(`/api/trans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trans,
        Lend,
        to: trans ? to : party,
        amt: trans ? amount : lendAmount,
        desc: trans ? description : lendDesc,
      }),
    });

    if (response.ok) {
      if (trans) {
        setTo('');
        setAmount('');
        setDescription('');
      } else {
        setParty('');
        setLendAmount('');
        setLendDesc('');
      }

      toast.success('Transaction added successfully!');
    } else {
      toast.error('Failed to add transaction.');
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setTrans(true);
            seterr('');
          }}
          className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${trans
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
        >
          Add Transaction
        </button>
        <button
          onClick={() => {
            setTrans(false);
            seterr('');
          }}
          className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${!trans
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
        >
          Lend / Borrow
        </button>
      </div>

      <AnimatePresence mode="wait">
        {trans ? (
          <motion.div
            key="normal-transaction"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg mx-auto bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-6"
          >
            <h2 className="text-2xl font-bold text-orange-500 font-playfair italic">
              New Transaction
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTransaction();
              }}
              className="space-y-4"
            >
              {err && <label className="block text-sm font-medium text-red-500 mb-1">{err}</label>}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">To</label>
                <input
                  type="text"
                  placeholder="Paid to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Amount</label>
                <input
                  type="number"
                  placeholder="Amount (in Rs.)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-4 cursor-pointer rounded-md bg-orange-500 text-white font-semibold font-space-grotesk hover:bg-orange-400 transition"
              >
                Add Transaction
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="lend-borrow"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg mx-auto bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-6"
          >
            <h2 className="text-2xl font-bold text-orange-500 font-playfair italic">
              Lend / Borrow
            </h2>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setLend(true);
                  seterr('');
                }}
                className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${Lend
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                Lend
              </button>
              <button
                onClick={() => {
                  setLend(false);
                  seterr('');
                }}
                className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${!Lend
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                Borrow
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTransaction();
              }}
              className="space-y-4"
            >
              {err && <label className="block text-sm font-medium text-red-500 mb-1">{err}</label>}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {Lend ? 'To' : 'From'}
                </label>
                <input
                  type="text"
                  placeholder={Lend ? 'Paid to' : 'Received from'}
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Amount</label>
                <input
                  type="number"
                  placeholder="Amount (in Rs.)"
                  value={lendAmount}
                  onChange={(e) => setLendAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <input
                  type="text"
                  placeholder="Description"
                  value={lendDesc}
                  onChange={(e) => setLendDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-4 cursor-pointer rounded-md bg-orange-500 text-white font-semibold font-space-grotesk hover:bg-orange-400 transition"
              >
                Add Transaction
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
