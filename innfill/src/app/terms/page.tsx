import React from 'react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 text-gray-300">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-12">Terms & Policies</h1>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-accent mb-4">1. Terms of Service</h2>
            <div className="space-y-4 text-gray-400">
              <p>Welcome to Innfill! These terms and conditions outline the rules and regulations for the use of Innfill's Website, located at innfill.com.</p>
              <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Innfill if you do not agree to take all of the terms and conditions stated on this page.</p>
              <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-accent mb-4">2. Privacy Policy</h2>
            <div className="space-y-4 text-gray-400">
              <p>Your privacy is important to us. It is Innfill's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>
              <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
              <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-accent mb-4">3. User Conduct</h2>
            <div className="space-y-4 text-gray-400">
              <p>You agree to use our platform only for lawful purposes. You are prohibited from posting on or transmitting through the site any material that is disruptive, threatening, abusive, libelous, defamatory, obscene, or that encourages conduct that would constitute a criminal offense.</p>
              <p>You agree not to engage in any activity that would interfere with the proper working of the platform. This includes, but is not limited to, attempting to circumvent security measures, reverse engineer our code, or introduce viruses or other harmful code.</p>
            </div>
          </section>

           <section>
            <h2 className="text-2xl font-semibold text-accent mb-4">4. Payments and Escrow</h2>
            <div className="space-y-4 text-gray-400">
              <p>Innfill utilizes a secure escrow system for all project payments. Clients fund the project upon agreement, and funds are held by Innfill until the project milestones are met and approved by the Client.</p>
              <p>Freelancers will receive payment upon successful completion and approval of their work. Innfill charges a service fee on all transactions, which will be clearly outlined before any payment is made.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
