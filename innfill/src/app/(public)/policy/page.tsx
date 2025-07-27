// src/app/(public)/policy/page.tsx
'use client';

import React from 'react';
import StaticPageLayout from '@/components/Layouts/StaticPageLayout';

const PolicyPage = () => {
  return (
    <StaticPageLayout 
      title="Privacy Policy"
      subtitle="Your privacy is important to us. Last updated: October 26, 2023"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, update your profile, post projects, or communicate with us. This may include your name, email address, payment information, and any other information you choose to provide.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services. This includes connecting clients with freelancers, processing transactions, sending you technical notices and support messages, and communicating with you about products, services, offers, and events offered by Innfill.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">3. Information Sharing</h2>
          <p>We may share information about you as follows: with other users on the platform (e.g., your profile information is visible to others), with vendors and service providers who need access to such information to carry out work on our behalf, in response to a request for information if we believe disclosure is in accordance with any applicable law, or between and among Innfill and our current and future parents, affiliates, and subsidiaries.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">5. Your Choices</h2>
          <p>You may update, correct, or delete information about you at any time by logging into your online account. If you wish to delete or deactivate your account, please email us at support@innfill.com, but note that we may retain certain information as required by law or for legitimate business purposes.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at: support@innfill.com.</p>
        </section>
      </div>
    </StaticPageLayout>
  );
};

export default PolicyPage;
