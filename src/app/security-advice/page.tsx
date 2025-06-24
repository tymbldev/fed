import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Advice - TymblHub | Protect Your Account & Personal Information',
  description: 'Learn essential security tips to protect your TymblHub account and personal information. Best practices for online safety and fraud prevention.',
  keywords: 'security advice, account protection, online safety, fraud prevention, cybersecurity, TymblHub',
  openGraph: {
    title: 'Security Advice - TymblHub',
    description: 'Essential security tips to protect your account and personal information',
    type: 'website',
  },
};

export default function SecurityAdvice() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Security Advice</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your security is our top priority. Follow these essential guidelines to protect your
          TymblHub account and personal information from potential threats.
        </p>
      </div>

      {/* Security Alert Banner */}
      <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Important Security Notice</h3>
            <p className="text-sm text-red-700 mt-1">
              Never share your login credentials with anyone. TymblHub staff will never ask for your password.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Password Security */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Password Security</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <div>
                  <h3 className="font-medium text-gray-900">Use Strong Passwords</h3>
                  <p className="text-gray-600 text-sm">Create passwords with at least 12 characters, including uppercase, lowercase, numbers, and special characters.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <div>
                  <h3 className="font-medium text-gray-900">Unique Passwords</h3>
                  <p className="text-gray-600 text-sm">Use different passwords for each account. Never reuse passwords across multiple platforms.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <div>
                  <h3 className="font-medium text-gray-900">Password Manager</h3>
                  <p className="text-gray-600 text-sm">Consider using a reputable password manager to generate and store strong passwords securely.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✗</span>
                <div>
                  <h3 className="font-medium text-gray-900">Avoid Common Mistakes</h3>
                  <p className="text-gray-600 text-sm">Don&apos;t use personal information like birthdays, names, or common words in your passwords.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Two-Factor Authentication */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Two-Factor Authentication (2FA)</h2>
            <p className="text-gray-600 mb-4">
              Enable two-factor authentication to add an extra layer of security to your account.
              This requires both your password and a second form of verification.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">How to Enable 2FA:</h3>
              <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
                <li>Go to your Account Settings</li>
                <li>Navigate to Security & Privacy</li>
                <li>Click on &quot;Enable Two-Factor Authentication&quot;</li>
                <li>Follow the setup instructions</li>
                <li>Save your backup codes in a secure location</li>
              </ol>
            </div>
          </section>

          {/* Phishing Awareness */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Phishing Awareness</h2>
            <p className="text-gray-600 mb-4">
              Phishing attacks attempt to steal your personal information through fake emails,
              websites, or messages that appear legitimate.
            </p>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Warning Signs:</h3>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Urgent requests for personal information</li>
                  <li>• Suspicious email addresses or URLs</li>
                  <li>• Poor grammar or spelling</li>
                  <li>• Requests for passwords or financial information</li>
                  <li>• Offers that seem too good to be true</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">What to Do:</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Verify the sender&apos;s email address</li>
                  <li>• Check for HTTPS in website URLs</li>
                  <li>• Don&apos;t click on suspicious links</li>
                  <li>• Report suspicious emails to security@tymblhub.com</li>
                  <li>• When in doubt, contact us directly</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Device Security */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Device Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Keep Software Updated</h3>
                <p className="text-gray-600 text-sm">Regularly update your operating system, browser, and applications to patch security vulnerabilities.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Use Antivirus Software</h3>
                <p className="text-gray-600 text-sm">Install and maintain reputable antivirus software to protect against malware and viruses.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Secure Your Network</h3>
                <p className="text-gray-600 text-sm">Use encrypted Wi-Fi networks and avoid accessing sensitive information on public networks.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Lock Your Devices</h3>
                <p className="text-gray-600 text-sm">Use PIN codes, passwords, or biometric authentication to lock your devices when not in use.</p>
              </div>
            </div>
          </section>

          {/* Account Monitoring */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Monitoring</h2>
            <p className="text-gray-600 mb-4">
              Regularly monitor your account for any suspicious activity or unauthorized access.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">🔍</span>
                <div>
                  <h3 className="font-medium text-gray-900">Check Login Activity</h3>
                  <p className="text-gray-600 text-sm">Review your recent login sessions and report any unrecognized activity.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">📧</span>
                <div>
                  <h3 className="font-medium text-gray-900">Monitor Email Notifications</h3>
                  <p className="text-gray-600 text-sm">Pay attention to security alerts and account activity notifications.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">📱</span>
                <div>
                  <h3 className="font-medium text-gray-900">Review Account Settings</h3>
                  <p className="text-gray-600 text-sm">Regularly check your account settings and update your contact information.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Security Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
                Enable 2FA
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
                Change Password
              </button>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                Review Login Activity
              </button>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-200">
                Security Settings
              </button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-700">Security Team</p>
                <p className="text-gray-600 text-sm">security@tymblhub.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Support Team</p>
                <p className="text-gray-600 text-sm">support@tymblhub.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Emergency Hotline</p>
                <p className="text-gray-600 text-sm">+971 4 123 4567</p>
              </div>
            </div>
          </div>

          {/* Security Checklist */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Checklist</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Strong password enabled</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Two-factor authentication active</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Backup codes saved</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Antivirus software installed</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Software updated</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Login activity reviewed</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Additional Security Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">Security Blog</h3>
            <p className="text-gray-600 text-sm">Stay updated with the latest security trends and best practices.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="font-semibold text-gray-900 mb-2">Security Training</h3>
            <p className="text-gray-600 text-sm">Access our security awareness training materials.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Security Tools</h3>
            <p className="text-gray-600 text-sm">Recommended security tools and applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}