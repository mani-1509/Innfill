// src/components/modals/AddPaymentMethodModal.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCreditCard, FiUser, FiCalendar, FiLock } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const supabase = createClient();
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to add a payment method.');

      // Basic validation
      if (!cardholderName || !cardNumber || !expiryDate || !cvc) {
        throw new Error('Please fill all fields.');
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        throw new Error('Invalid card number.');
      }

      const { error: insertError } = await supabase.from('payment_methods').insert({
        user_id: user.id,
        method_type: 'card',
        details: {
          brand: 'Visa', // Mock brand
          last4: cardNumber.slice(-4),
        },
        is_default: isDefault,
      });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Payment Method</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white"><FiX size={24} /></button>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FiUser className="absolute top-3 left-3 text-gray-500" />
                <input type="text" placeholder="Cardholder Name" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="relative">
                <FiCreditCard className="absolute top-3 left-3 text-gray-500" />
                <input type="text" placeholder="Card Number (16 digits)" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <FiCalendar className="absolute top-3 left-3 text-gray-500" />
                    <input type="text" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div className="relative">
                    <FiLock className="absolute top-3 left-3 text-gray-500" />
                    <input type="text" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="isDefault" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-violet-500 focus:ring-violet-500" />
                <label htmlFor="isDefault" className="ml-2 text-gray-300">Set as default payment method</label>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50">
                {isSubmitting ? 'Adding...' : 'Add Card'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPaymentMethodModal;
