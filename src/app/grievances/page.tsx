'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function Grievances() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grievanceType: '',
    subject: '',
    description: '',
    preferredResolution: '',
    urgency: 'medium',
    allowContact: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Grievance submitted successfully. We will review your complaint and respond within 5-7 business days.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        grievanceType: '',
        subject: '',
        description: '',
        preferredResolution: '',
        urgency: 'medium',
        allowContact: false,
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Grievance Redressal</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We are committed to addressing your concerns and resolving grievances promptly.
          Submit your complaint through our formal grievance redressal process.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Grievance Information */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Grievance Types</h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">📋</span>
                <span>Service quality issues</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">👤</span>
                <span>Customer service complaints</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">💰</span>
                <span>Billing or payment disputes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🔒</span>
                <span>Privacy or data concerns</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">⚖️</span>
                <span>Policy or terms disputes</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resolution Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">1.</span>
                  <div>
                    <p className="font-medium text-gray-700">Initial Response</p>
                    <p className="text-gray-600 text-sm">Within 24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">2.</span>
                  <div>
                    <p className="font-medium text-gray-700">Investigation</p>
                    <p className="text-gray-600 text-sm">3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">3.</span>
                  <div>
                    <p className="font-medium text-gray-700">Resolution</p>
                    <p className="text-gray-600 text-sm">5-7 business days</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">4.</span>
                  <div>
                    <p className="font-medium text-gray-700">Follow-up</p>
                    <p className="text-gray-600 text-sm">Within 30 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grievance Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit Grievance</h2>

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
                  <label htmlFor="grievanceType" className="block text-sm font-medium text-gray-700 mb-1">
                    Grievance Type *
                  </label>
                  <select
                    id="grievanceType"
                    name="grievanceType"
                    value={formData.grievanceType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select grievance type</option>
                    <option value="service-quality">Service Quality</option>
                    <option value="customer-service">Customer Service</option>
                    <option value="billing-payment">Billing/Payment</option>
                    <option value="privacy-data">Privacy/Data</option>
                    <option value="policy-terms">Policy/Terms</option>
                    <option value="technical-issue">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief summary of your grievance"
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
                  placeholder="Please provide a detailed description of your grievance, including relevant dates, times, and any supporting information..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredResolution" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Resolution
                  </label>
                  <select
                    id="preferredResolution"
                    name="preferredResolution"
                    value={formData.preferredResolution}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select preferred resolution</option>
                    <option value="refund">Refund</option>
                    <option value="compensation">Compensation</option>
                    <option value="service-replacement">Service Replacement</option>
                    <option value="policy-change">Policy Change</option>
                    <option value="apology">Apology</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="low">Low - Can wait</option>
                    <option value="medium">Medium - Standard</option>
                    <option value="high">High - Urgent</option>
                    <option value="critical">Critical - Immediate attention needed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="allowContact"
                  name="allowContact"
                  checked={formData.allowContact}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="allowContact" className="ml-2 text-sm text-gray-600">
                  I agree to be contacted for follow-up questions and resolution updates
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting Grievance...' : 'Submit Grievance'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Grievance Process */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Grievance Redressal Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 mb-2">Step 1: Submit</h3>
            <p className="text-gray-600 text-sm">Fill out the grievance form with all relevant details</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Step 2: Review</h3>
            <p className="text-gray-600 text-sm">Our team reviews and acknowledges your grievance</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Step 3: Investigate</h3>
            <p className="text-gray-600 text-sm">Thorough investigation and analysis of the issue</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-semibold text-gray-900 mb-2">Step 4: Resolve</h3>
            <p className="text-gray-600 text-sm">Provide resolution and follow-up to ensure satisfaction</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Additional Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm">Call us at +971 4 123 4567 for immediate assistance</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm">Send detailed grievances to grievances@tymblhub.com</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm">Chat with our support team for quick resolution</p>
          </div>
        </div>
      </div>
    </div>
  );
}