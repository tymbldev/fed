'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function ReportBug() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bugType: '',
    severity: '',
    browser: '',
    device: '',
    steps: '',
    expectedBehavior: '',
    actualBehavior: '',
    screenshots: '',
    allowContact: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Bug report submitted successfully! Our development team will investigate and get back to you soon.');
      setFormData({
        name: '',
        email: '',
        bugType: '',
        severity: '',
        browser: '',
        device: '',
        steps: '',
        expectedBehavior: '',
        actualBehavior: '',
        screenshots: '',
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Report a Bug</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Found a bug or technical issue? Help us improve TymblHub by reporting it.
          Your detailed report helps our development team fix issues faster.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Bug Information */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Before Reporting</h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Check if the issue has already been reported</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Try refreshing the page or clearing cache</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Test on different browsers or devices</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Take screenshots or screen recordings</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Note the exact steps to reproduce</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bug Severity Levels</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">🔴</span>
                  <div>
                    <p className="font-medium text-gray-700">Critical</p>
                    <p className="text-gray-600 text-sm">System crash, data loss, security issue</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-600 mr-2 mt-1">🟠</span>
                  <div>
                    <p className="font-medium text-gray-700">High</p>
                    <p className="text-gray-600 text-sm">Major functionality broken</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">🟡</span>
                  <div>
                    <p className="font-medium text-gray-700">Medium</p>
                    <p className="text-gray-600 text-sm">Minor functionality issue</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">🟢</span>
                  <div>
                    <p className="font-medium text-gray-700">Low</p>
                    <p className="text-gray-600 text-sm">Cosmetic or minor issue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bug Report Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit Bug Report</h2>

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
                  <label htmlFor="bugType" className="block text-sm font-medium text-gray-700 mb-1">
                    Bug Type *
                  </label>
                  <select
                    id="bugType"
                    name="bugType"
                    value={formData.bugType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select bug type</option>
                    <option value="ui-ux">UI/UX Issue</option>
                    <option value="functionality">Functionality Bug</option>
                    <option value="performance">Performance Issue</option>
                    <option value="security">Security Vulnerability</option>
                    <option value="mobile">Mobile App Issue</option>
                    <option value="api">API/Backend Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                    Severity Level *
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select severity</option>
                    <option value="critical">🔴 Critical</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="browser" className="block text-sm font-medium text-gray-700 mb-1">
                    Browser
                  </label>
                  <select
                    id="browser"
                    name="browser"
                    value={formData.browser}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select browser</option>
                    <option value="chrome">Google Chrome</option>
                    <option value="firefox">Mozilla Firefox</option>
                    <option value="safari">Safari</option>
                    <option value="edge">Microsoft Edge</option>
                    <option value="opera">Opera</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="device" className="block text-sm font-medium text-gray-700 mb-1">
                    Device Type
                  </label>
                  <select
                    id="device"
                    name="device"
                    value={formData.device}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select device</option>
                    <option value="desktop">Desktop/Laptop</option>
                    <option value="mobile">Mobile Phone</option>
                    <option value="tablet">Tablet</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">
                  Steps to Reproduce *
                </label>
                <textarea
                  id="steps"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. Enter...&#10;4. The bug occurs when..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="expectedBehavior" className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Behavior *
                  </label>
                  <textarea
                    id="expectedBehavior"
                    name="expectedBehavior"
                    value={formData.expectedBehavior}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="What should happen when you perform these steps?"
                  />
                </div>

                <div>
                  <label htmlFor="actualBehavior" className="block text-sm font-medium text-gray-700 mb-1">
                    Actual Behavior *
                  </label>
                  <textarea
                    id="actualBehavior"
                    name="actualBehavior"
                    value={formData.actualBehavior}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="What actually happens when you perform these steps?"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="screenshots" className="block text-sm font-medium text-gray-700 mb-1">
                  Screenshots/Additional Info
                </label>
                <textarea
                  id="screenshots"
                  name="screenshots"
                  value={formData.screenshots}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe any screenshots, error messages, or additional information that might help..."
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
                  I agree to be contacted for follow-up questions about this bug report
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Bug Report'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bug Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Common Bug Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">UI/UX Issues</h3>
            <p className="text-gray-600 text-sm">Visual glitches, layout problems, or design inconsistencies</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Functionality Bugs</h3>
            <p className="text-gray-600 text-sm">Features not working as expected or broken functionality</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">Performance Issues</h3>
            <p className="text-gray-600 text-sm">Slow loading, crashes, or performance problems</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">Mobile Issues</h3>
            <p className="text-gray-600 text-sm">Problems specific to mobile devices or responsive design</p>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-gray-900 mb-2">Known Issues</h3>
            <p className="text-gray-600 text-sm">Check our list of known issues and their status.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🆘</div>
            <h3 className="font-semibold text-gray-900 mb-2">Support Center</h3>
            <p className="text-gray-600 text-sm">Find answers to common questions and troubleshooting guides.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 text-sm">Get in touch with our technical support team for urgent issues.</p>
          </div>
        </div>
      </div>
    </div>
  );
}