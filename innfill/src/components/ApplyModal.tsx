"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ApplyModalProps {
  projectId: string;
  onClose: () => void;
  onApplySuccess: () => void;
}

export default function ApplyModal({ projectId, onClose, onApplySuccess }: ApplyModalProps) {
  const { user } = useAuth();
  const supabase = createClient();
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || user.user_type !== 'freelancer') {
      setError('Only freelancers can apply for projects.');
      return;
    }

    if (!bidAmount || !proposal) {
      setError('Please enter a bid amount and a proposal message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: insertError } = await supabase.from('applications').insert({
        project_id: projectId,
        freelancer_id: user.id,
        bid_amount: parseFloat(bidAmount),
        proposal_message: proposal,
        status: 'pending',
      });

      if (insertError) throw insertError;

      onApplySuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-primary-dark rounded-2xl border border-white/10 p-8 w-full max-w-lg text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">Apply for Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-300 mb-2">Your Bid ($)</label>
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full bg-white/5 p-3 rounded-lg border border-white/10 focus:ring-accent focus:border-accent transition"
              placeholder="Enter your bid amount"
              required
            />
          </div>
          <div>
            <label htmlFor="proposal" className="block text-sm font-medium text-gray-300 mb-2">Proposal</label>
            <textarea
              id="proposal"
              rows={5}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full bg-white/5 p-3 rounded-lg border border-white/10 focus:ring-accent focus:border-accent transition"
              placeholder="Write a compelling proposal to win this project..."
              required
            ></textarea>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-accent rounded-lg hover:bg-accent/90 transition disabled:bg-gray-600">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
