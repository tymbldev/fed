import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - TymblHub | Your Data Protection & Privacy Rights',
  description: 'Learn how TymblHub protects your personal data and privacy. Our comprehensive privacy policy explains data collection, usage, and your rights as a user.',
  keywords: 'privacy policy, data protection, personal information, GDPR, user rights, TymblHub',
  openGraph: {
    title: 'Privacy Policy - TymblHub',
    description: 'Your data protection and privacy rights at TymblHub',
    type: 'website',
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <p className="text-blue-800">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          At TymblHub, we are committed to protecting your privacy and ensuring the security of your personal information.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Information We Collect</h2>

          <h3 className="text-xl font-medium text-gray-900 mb-4">Personal Information</h3>
          <p className="text-gray-600 mb-4">
            We collect information you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Name, email address, and contact information</li>
            <li>Professional details including work experience, skills, and education</li>
            <li>Resume, cover letters, and other documents you upload</li>
            <li>Job preferences and career objectives</li>
            <li>Communication preferences and settings</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-900 mb-4">Automatically Collected Information</h3>
          <p className="text-gray-600 mb-4">
            We automatically collect certain information when you use our platform:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, features used)</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Log files and analytics data</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Provide and maintain our job referral platform</li>
            <li>Match you with relevant job opportunities</li>
            <li>Connect you with potential employers and referrers</li>
            <li>Send you job alerts and career-related communications</li>
            <li>Improve our services and user experience</li>
            <li>Ensure platform security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. Information Sharing and Disclosure</h2>
          <p className="text-gray-600 mb-4">
            We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
            <li><strong>With employers:</strong> To facilitate job applications and referrals</li>
            <li><strong>With referrers:</strong> To enable the referral process</li>
            <li><strong>Service providers:</strong> With trusted third-party services that help us operate our platform</li>
            <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">4. Data Security</h2>
          <p className="text-gray-600 mb-4">
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and assessments</li>
            <li>Access controls and authentication measures</li>
            <li>Secure data centers and infrastructure</li>
            <li>Employee training on data protection</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">5. Your Rights and Choices</h2>
          <p className="text-gray-600 mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Objection:</strong> Object to certain processing activities</li>
            <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">6. Cookies and Tracking</h2>
          <p className="text-gray-600 mb-4">
            We use cookies and similar technologies to enhance your experience:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Essential cookies:</strong> Required for basic platform functionality</li>
            <li><strong>Analytics cookies:</strong> Help us understand how users interact with our platform</li>
            <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Marketing cookies:</strong> Deliver relevant content and advertisements</li>
          </ul>
          <p className="text-gray-600">
            You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">7. International Data Transfers</h2>
          <p className="text-gray-600 mb-4">
            Your information may be transferred to and processed in countries other than your own.
            We ensure appropriate safeguards are in place to protect your data in accordance with
            applicable data protection laws.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">8. Children's Privacy</h2>
          <p className="text-gray-600 mb-4">
            Our platform is not intended for children under 16 years of age. We do not knowingly
            collect personal information from children under 16. If you believe we have collected
            such information, please contact us immediately.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">9. Changes to This Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any material
            changes by posting the new policy on this page and updating the "Last updated" date.
            Your continued use of our platform after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">10. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600 mb-2">
              <strong>Email:</strong> privacy@tymblhub.com
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Phone:</strong> +971 4 123 4567
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Address:</strong> 123 Business Street, Suite 100, Dubai, UAE
            </p>
            <p className="text-gray-600">
              <strong>Data Protection Officer:</strong> dpo@tymblhub.com
            </p>
          </div>
        </section>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
          <p className="text-green-800">
            <strong>Your privacy matters to us.</strong> We are committed to transparency and protecting your personal information.
          </p>
        </div>
      </div>
    </div>
  );
}