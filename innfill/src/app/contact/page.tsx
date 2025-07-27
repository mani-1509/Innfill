"use client";

import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic (e.g., send to an API endpoint)
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-4">Contact Us</h1>
        <p className="text-lg text-center text-gray-300 mb-12">
          Have a question or want to work with us? Drop us a message!
        </p>

        <div className="bg-primary-dark p-8 rounded-2xl border border-white/10 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-white/5 border border-white/20 rounded-md py-3 px-4 text-white shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-white/5 border border-white/20 rounded-md py-3 px-4 text-white shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
              <textarea
                name="message"
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-white/5 border border-white/20 rounded-md py-3 px-4 text-white shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-12">
            <h3 className="text-xl font-semibold text-white">Or reach us directly</h3>
            <p className="text-gray-400 mt-2">Email: <a href="mailto:support@innfill.com" className="text-accent hover:underline">support@innfill.com</a></p>
            <div className="flex justify-center gap-6 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
