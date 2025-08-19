import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Summons & Notices - TymblHub | Legal Information & Compliance',
  description: 'Information about legal summons, notices, and compliance requirements for TymblHub users. Contact our legal team for assistance.',
  keywords: 'summons, legal notices, compliance, legal information, TymblHub legal, legal assistance',
  openGraph: {
    title: 'Summons & Notices - TymblHub',
    description: 'Legal information and compliance requirements',
    type: 'website',
  },
};

export default function SummonsNotices() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Summons & Notices</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Important legal information, compliance requirements, and official notices from TymblHub.
          Stay informed about your rights and obligations as a user of our platform.
        </p>
      </div>

      {/* Legal Notice Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Legal Notice</h3>
            <p className="text-sm text-yellow-700 mt-1">
              This information is for general purposes only and does not constitute legal advice.
              For specific legal matters, please consult with qualified legal counsel.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Legal Notices */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Legal Notices</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Terms of Service Updates</h3>
                <p className="text-gray-600 mb-2">
                  We may update our Terms of Service from time to time. Users will be notified of
                  significant changes via email and through platform notifications.
                </p>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy Policy Changes</h3>
                <p className="text-gray-600 mb-2">
                  Updates to our Privacy Policy will be communicated to users with sufficient notice
                  before implementation.
                </p>
                <p className="text-sm text-gray-500">
                  Users have the right to opt-out of certain data processing activities.
                </p>
              </div>

              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Security Breach Notifications</h3>
                <p className="text-gray-600 mb-2">
                  In the event of a security breach affecting user data, we will notify affected
                  users within 72 hours as required by applicable laws.
                </p>
                <p className="text-sm text-gray-500">
                  Notifications will include details about the breach and recommended actions.
                </p>
              </div>
            </div>
          </section>

          {/* Compliance Information */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Compliance Information</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Data Protection Laws</h3>
                <p className="text-gray-600 mb-3">
                  TymblHub complies with applicable data protection laws including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>General Data Protection Regulation (GDPR)</li>
                  <li>California Consumer Privacy Act (CCPA)</li>
                  <li>UAE Data Protection Law</li>
                  <li>Other applicable local privacy laws</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Employment Laws</h3>
                <p className="text-gray-600 mb-3">
                  Our platform operates in compliance with employment and labor laws:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Equal employment opportunity laws</li>
                  <li>Anti-discrimination regulations</li>
                  <li>Fair labor standards</li>
                  <li>Workplace safety requirements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Financial Regulations</h3>
                <p className="text-gray-600 mb-3">
                  For payment processing and financial services, we comply with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Payment Card Industry Data Security Standard (PCI DSS)</li>
                  <li>Anti-money laundering (AML) regulations</li>
                  <li>Know Your Customer (KYC) requirements</li>
                  <li>Local financial services regulations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Rights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Right to Access</h3>
                    <p className="text-gray-600 text-sm">Request a copy of your personal data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Right to Rectification</h3>
                    <p className="text-gray-600 text-sm">Correct inaccurate personal information</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Right to Erasure</h3>
                    <p className="text-gray-600 text-sm">Request deletion of your personal data</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Right to Portability</h3>
                    <p className="text-gray-600 text-sm">Receive your data in a portable format</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Right to Object</h3>
                    <p className="text-gray-600 text-sm">Object to certain data processing</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Right to Withdraw Consent</h3>
                    <p className="text-gray-600 text-sm">Withdraw consent at any time</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Legal Team */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Our Legal Team</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Legal Inquiries</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Email:</strong> legal@tymblhub.com
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> +971 4 123 4567
                  </p>
                  <p className="text-gray-600">
                    <strong>Response Time:</strong> 2-3 business days
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Data Protection Officer</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Email:</strong> dpo@tymblhub.com
                  </p>
                  <p className="text-gray-600">
                    <strong>Purpose:</strong> Data protection and privacy matters
                  </p>
                  <p className="text-gray-600">
                    <strong>Response Time:</strong> 1-2 business days
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
                Request Data Access
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
                Update Personal Info
              </button>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                Download My Data
              </button>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-200">
                Contact Legal Team
              </button>
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-700">Terms Updated</p>
                <p className="text-gray-600 text-sm">January 15, 2024</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Privacy Policy</p>
                <p className="text-gray-600 text-sm">March 1, 2024</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">GDPR Compliance</p>
                <p className="text-gray-600 text-sm">May 25, 2018</p>
              </div>
            </div>
          </div>

          {/* Legal Resources */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Resources</h3>
            <div className="space-y-3">
              <Link href="/terms-conditions" className="block text-indigo-600 hover:text-indigo-800 text-sm">
                Terms & Conditions
              </Link>
              <Link href="/privacy-policy" className="block text-indigo-600 hover:text-indigo-800 text-sm">
                Privacy Policy
              </Link>
              <Link href="/security-advice" className="block text-indigo-600 hover:text-indigo-800 text-sm">
                Security Information
              </Link>
              <Link href="/grievances" className="block text-indigo-600 hover:text-indigo-800 text-sm">
                Grievance Procedure
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Additional Legal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-gray-900 mb-2">Legal Documents</h3>
            <p className="text-gray-600 text-sm">Access all legal documents and agreements.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Compliance Status</h3>
            <p className="text-gray-600 text-sm">View our compliance certifications and audits.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-semibold text-gray-900 mb-2">Legal Support</h3>
            <p className="text-gray-600 text-sm">Get assistance with legal matters and disputes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}