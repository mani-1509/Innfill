// src/app/(platform)/payments/page.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiClock, FiCheckCircle, FiPlus, FiMoreVertical, FiCreditCard, FiDownload, FiAlertTriangle } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { Transaction, PaymentMethod } from '@/types/types';
import AddPaymentMethodModal from '@/components/modals/AddPaymentMethodModal';

const PaymentsPage = () => {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPaymentData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated.');

      // Fetch transactions and payment methods in parallel
      const [transResponse, pmResponse] = await Promise.all([
        supabase
          .from('transactions')
          .select('*, projects(title)')
          .or(`payee_id.eq.${user.id},payer_id.eq.${user.id}`)
          .order('created_at', { ascending: false }),
        supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (transResponse.error) throw transResponse.error;
      setTransactions(transResponse.data || []);

      if (pmResponse.error) throw pmResponse.error;
      setPaymentMethods(pmResponse.data || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  const summaryData = useMemo(() => {
    const totalEarnings = transactions
      .filter(t => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const pendingPayouts = transactions
        .filter(t => t.status === 'pending' && t.amount < 0)
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const lastPayout = transactions
        .filter(t => t.status === 'processed' && t.amount < 0)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    return [
      { title: 'Total Earnings', amount: `$${totalEarnings.toFixed(2)}`, icon: FiDollarSign, color: 'text-green-400' },
      { title: 'Pending Payouts', amount: `$${pendingPayouts.toFixed(2)}`, icon: FiClock, color: 'text-yellow-400' },
      { title: 'Last Payout', amount: lastPayout ? `$${Math.abs(lastPayout.amount).toFixed(2)}` : '$0.00', icon: FiCheckCircle, color: 'text-blue-400' },
    ];
  }, [transactions]);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'processed': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const formatCurrency = (amount: number) => {
    const value = Math.abs(amount).toFixed(2);
    return amount > 0 ? `+$${value}` : `-$${value}`;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full"><FiClock className="animate-spin h-8 w-8 text-white"/></div>;
  }

  if (error) {
    return (
        <div className="flex flex-col justify-center items-center h-full text-red-400">
            <FiAlertTriangle className="h-12 w-12 mb-4" />
            <h2 className="text-xl font-bold mb-2">Failed to load payment data</h2>
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Payments</h1>
                <p className="text-gray-400">Track your earnings and manage payouts.</p>
            </div>
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                <FiDownload />
                <span>Export Report</span>
            </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryData.map((item, index) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * index }} className="bg-gray-800/50 p-6 rounded-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400">{item.title}</p>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <p className="text-3xl font-bold text-white">{item.amount}</p>
          </motion.div>
        ))}
      </div>

      {/* Transactions and Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transactions List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl border border-white/10 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3 text-sm font-semibold text-gray-400">Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-400">Description</th>
                  <th className="p-3 text-sm font-semibold text-gray-400 text-right">Amount</th>
                  <th className="p-3 text-sm font-semibold text-gray-400 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="p-3 text-sm text-gray-300">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-sm text-white font-medium">{tx.projects?.title || 'Platform Transaction'}</td>
                    <td className={`p-3 text-sm font-bold text-right ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(tx.amount)}</td>
                    <td className="p-3 text-center"><span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusChip(tx.status)}`}>{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-gray-800/50 p-6 rounded-xl border border-white/10 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Payment Methods</h2>
          <div className="space-y-4">
            {paymentMethods.map(method => (
                <div key={method.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FiCreditCard className="w-8 h-8 text-violet-400" />
                        <div>
                            <p className="font-semibold text-white">{method.details.brand || 'Bank'} <span className="text-gray-400">**** {method.details.last4}</span></p>
                        </div>
                    </div>
                    {method.is_default && <span className="text-xs text-blue-400 font-bold">Default</span>}
                    <button className="text-gray-500 hover:text-white"><FiMoreVertical /></button>
                </div>
            ))}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-600 hover:border-violet-500 hover:text-violet-500 text-gray-400 font-semibold py-3 rounded-lg transition-colors">
                <FiPlus />
                <span>Add New Method</span>
            </button>
          </div>
        </motion.div>
      </div>
      <AddPaymentMethodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
            fetchPaymentData(); // Refetch data to show the new method
        }}
      />
    </div>
  );
};

export default PaymentsPage;
