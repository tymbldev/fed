'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function Fraud() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fraudType: '',
    incidentDate: '',
    description: '',
    evidence: '',
    contactMethod: 'email',
    allowFollowUp: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Fraud report submitted successfully. Our security team will investigate and contact you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        fraudType: '',
        incidentDate: '',
        description: '',
        evidence: '',
        contactMethod: 'email',
        allowFollowUp: false,
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Report Fraud</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          If you&apos;ve encountered suspicious activity or fraud on TymblHub, we&apos;re here to help.
          Report incidents immediately to protect yourself and our community.
        </p>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Emergency Contact</h3>
            <p className="text-sm text-red-700 mt-1">
              For immediate assistance, call our fraud hotline: <strong>+971 4 123 4567</strong> (24/7)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Fraud Information */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Common Fraud Types</h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">⚠️</span>
                <span>Phishing emails or fake websites</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">⚠️</span>
                <span>Unauthorized account access</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">⚠️</span>
                <span>Fake job postings or offers</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">⚠️</span>
                <span>Identity theft attempts</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">⚠️</span>
                <span>Payment or financial fraud</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Do Immediately</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">1.</span>
                  <div>
                    <p className="font-medium text-gray-700">Change Your Password</p>
                    <p className="text-gray-600 text-sm">If your account was compromised</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">2.</span>
                  <div>
                    <p className="font-medium text-gray-700">Contact Your Bank</p>
                    <p className="text-gray-600 text-sm">If financial information was involved</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">3.</span>
                  <div>
                    <p className="font-medium text-gray-700">Document Everything</p>
                    <p className="text-gray-600 text-sm">Screenshots, emails, timestamps</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">4.</span>
                  <div>
                    <p className="font-medium text-gray-700">Report to Authorities</p>
                    <p className="text-gray-600 text-sm">Local police or cybercrime units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fraud Report Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Report Fraudulent Activity</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="fraudType" className="block text-sm font-medium text-gray-700 mb-1">
                    Type of Fraud *
                  </label>
                  <select
                    id="fraudType"
                    name="fraudType"
                    value={formData.fraudType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select fraud type</option>
                    <option value="phishing">Phishing Attack</option>
                    <option value="account-hijacking">Account Hijacking</option>
                    <option value="fake-job">Fake Job Posting</option>
                    <option value="identity-theft">Identity Theft</option>
                    <option value="payment-fraud">Payment Fraud</option>
                    <option value="data-breach">Data Breach</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-1">
                  When Did This Happen? *
                </label>
                <input
                  type="date"
                  id="incidentDate"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Please provide a detailed description of what happened, including any suspicious emails, messages, or activities..."
                />
              </div>

              <div>
                <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-1">
                  Evidence (Optional)
                </label>
                <textarea
                  id="evidence"
                  name="evidence"
                  value={formData.evidence}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Screenshots, email addresses, URLs, or other evidence you have..."
                />
              </div>

              <div>
                <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Contact Method
                </label>
                <select
                  id="contactMethod"
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="allowFollowUp"
                  name="allowFollowUp"
                  checked={formData.allowFollowUp}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="allowFollowUp" className="ml-2 text-sm text-gray-600">
                  I agree to be contacted for follow-up questions and investigation updates
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Fraud Report'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Prevention Tips */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Fraud Prevention Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Your Account</h3>
            <p className="text-gray-600 text-sm">Use strong passwords and enable two-factor authentication</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Verify Emails</h3>
            <p className="text-gray-600 text-sm">Check sender addresses and avoid clicking suspicious links</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-semibold text-gray-900 mb-2">Protect Financial Info</h3>
            <p className="text-gray-600 text-sm">Never share banking details or payment information</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">Monitor Activity</h3>
            <p className="text-gray-600 text-sm">Regularly check your account for suspicious activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}