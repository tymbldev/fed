'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    rating: '',
    subject: '',
    message: '',
    allowContact: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for your feedback! We appreciate your input and will use it to improve our platform.');
      setFormData({
        name: '',
        email: '',
        feedbackType: '',
        rating: '',
        subject: '',
        message: '',
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">We Value Your Feedback</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your feedback helps us improve TymblHub and provide better services to our community.
          Share your thoughts, suggestions, or report issues with us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Feedback Information */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Why Your Feedback Matters</h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Helps us improve user experience
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Identifies areas for enhancement
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Guides future feature development
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Ensures we meet your needs
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Ways to Reach Us</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">Email Support</p>
                  <p className="text-gray-600">feedback@tymblhub.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Phone Support</p>
                  <p className="text-gray-600">+971 4 123 4567</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Response Time</p>
                  <p className="text-gray-600">Within 24-48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Share Your Feedback</h2>

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
                  <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback Type *
                  </label>
                  <select
                    id="feedbackType"
                    name="feedbackType"
                    value={formData.feedbackType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select feedback type</option>
                    <option value="general">General Feedback</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="improvement">Improvement Suggestion</option>
                    <option value="complaint">Complaint</option>
                    <option value="compliment">Compliment</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Very Good</option>
                    <option value="3">⭐⭐⭐ Good</option>
                    <option value="2">⭐⭐ Fair</option>
                    <option value="1">⭐ Poor</option>
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
                  placeholder="Brief summary of your feedback"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Feedback *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Please provide detailed feedback, suggestions, or describe any issues you've encountered..."
                />
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
                  I agree to be contacted for follow-up questions regarding my feedback
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Feedback Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">What Type of Feedback Are You Looking For?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Feature Requests</h3>
            <p className="text-gray-600 text-sm">Suggest new features or improvements</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🐛</div>
            <h3 className="font-semibold text-gray-900 mb-2">Bug Reports</h3>
            <p className="text-gray-600 text-sm">Report technical issues or problems</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold text-gray-900 mb-2">General Feedback</h3>
            <p className="text-gray-600 text-sm">Share your overall experience</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">Improvements</h3>
            <p className="text-gray-600 text-sm">Suggest enhancements to existing features</p>
          </div>
        </div>
      </div>
    </div>
  );
}