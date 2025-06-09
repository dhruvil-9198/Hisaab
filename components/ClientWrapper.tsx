'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const AddTrans = dynamic(() => import('./AddTrans'), { ssr: false });
const Lend = dynamic(() => import('./Lend'), { ssr: false });
const Split = dynamic(() => import('./split'), { ssr: false });

type TransactionType = {
        id: string,
        username: string,
        userId: string,
        balance: Number,
    };

type ClientWrapperProps = {
  others: TransactionType[];
};

export default function ClientWrapper({others}: ClientWrapperProps) {
  const [mode, setMode] = useState<'transaction' | 'lendborrow' | 'split'>('transaction');
  const [err, seterr] = useState('');

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex justify-center space-x-2 bg-gray-800 rounded-xl p-1 w-fit mx-auto">
        {['transaction', 'lendborrow', 'split'].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m as any);
              seterr('');
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-transform duration-300 ${mode === m
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-gray-300 hover:text-white'
              }`}
          >
            {{
              transaction: 'Add Transaction',
              lendborrow: 'Lend/Borrow',
              split: 'Split',
            }[m]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'transaction' && <AddTrans />}
        {mode === 'lendborrow' && <Lend />}
        {mode === 'split' && <Split others = {others}/>}
      </AnimatePresence>
    </div>
  );
}
