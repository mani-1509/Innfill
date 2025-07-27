"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const PaymentsPage = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientComponentClient();
    async function fetchPayments() {
      const { data, error } = await supabase
        .from("payments")
        .select("id, amount, status, sender, receiver, created_at")
        .order("created_at", { ascending: false });
      setPayments(data || []);
      setLoading(false);
    }
    fetchPayments();
  }, []);

  if (loading) return <div className="p-8 text-lg">Loading payments...</div>;
  if (!payments.length) return <div className="p-8 text-lg">No payments found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <div className="space-y-6">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="rounded-xl bg-neutral-900 border border-neutral-700 p-6 shadow hover:border-blue-500 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg">{payment.amount} USD</div>
              <div className="text-sm text-neutral-400">
                {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : ""}
              </div>
            </div>
            <div className="mb-2 text-neutral-300">Status: {payment.status}</div>
            <div className="text-sm text-neutral-500">From: {payment.sender} → To: {payment.receiver}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsPage;
