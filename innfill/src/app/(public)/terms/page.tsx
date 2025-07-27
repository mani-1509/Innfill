// src/app/(public)/terms/page.tsx
'use client';

import React from 'react';
import StaticPageLayout from '@/components/Layouts/StaticPageLayout';

const TermsPage = () => {
  return (
    <StaticPageLayout 
      title="Terms of Service"
      subtitle="Last updated: October 26, 2023"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
          <p>Welcome to Innfill! These Terms of Service govern your use of our platform and services. By accessing or using Innfill, you agree to be bound by these terms. If you do not agree, you may not use our services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">2. User Accounts</h2>
          <p>To use most features of Innfill, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">3. Platform Services</h2>
          <p>Innfill provides a marketplace for clients to connect with freelancers for various professional services. We are not a party to the contracts between clients and freelancers. We do not hire or employ freelancers, and we are not responsible for the quality of their work.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">4. Fees and Payments</h2>
          <p>Certain services on Innfill may require payment of fees. All fees are quoted in U.S. Dollars unless otherwise specified. You agree to pay all applicable fees and taxes. Payments are processed through our third-party payment processors, and you agree to their terms of service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">5. User Conduct</h2>
          <p>You agree not to use Innfill for any unlawful purpose or in any way that could harm our platform, services, or general business. You are solely responsible for your interactions with other users.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">6. Termination</h2>
          <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not to a breach of the Terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">7. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice before any new terms taking effect. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </section>
      </div>
    </StaticPageLayout>
  );
};

export default TermsPage;
