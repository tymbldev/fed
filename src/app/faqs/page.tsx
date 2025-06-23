'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQData {
  [key: string]: FAQ[];
}

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqData: FAQData = {
    'Account & Registration': [
      {
        question: 'How do I create a TymblHub account?',
        answer: 'To create a TymblHub account, click on the "Sign Up" button on our homepage. Fill in your personal information, including your name, email address, and create a strong password. Verify your email address to complete the registration process.'
      },
      {
        question: 'Can I use my existing social media accounts to sign up?',
        answer: 'Yes, you can sign up using your Google, LinkedIn, or Facebook accounts. This will automatically import your basic profile information and make the registration process faster.'
      },
      {
        question: 'What should I do if I forgot my password?',
        answer: 'Click on the "Forgot Password" link on the login page. Enter your email address, and we will send you a password reset link. Follow the instructions in the email to create a new password.'
      },
      {
        question: 'How can I update my profile information?',
        answer: 'Log into your account and go to the Profile section. Click on "Edit Profile" to update your personal information, work experience, skills, and other details. Remember to save your changes.'
      }
    ],
    'Job Search & Applications': [
      {
        question: 'How does the referral system work?',
        answer: 'Our referral system connects job seekers with employees at companies. When you apply for a job, your application is shared with relevant employees who can refer you to the hiring team, increasing your chances of getting hired.'
      },
      {
        question: 'How do I apply for jobs on TymblHub?',
        answer: 'Browse available job listings, click on a job that interests you, and click "Apply Now." You can use your existing profile or upload a custom resume. Make sure your profile is complete for better chances.'
      },
      {
        question: 'Can I save job listings for later?',
        answer: 'Yes, you can save job listings by clicking the bookmark icon. Access your saved jobs from your dashboard under "Saved Jobs" to review and apply later.'
      },
      {
        question: 'How do I know if my application was received?',
        answer: 'You will receive an email confirmation immediately after submitting your application. You can also track your application status in your dashboard under "My Applications."'
      }
    ],
    'Privacy & Security': [
      {
        question: 'How is my personal information protected?',
        answer: 'We use industry-standard encryption and security measures to protect your data. Your personal information is never shared with third parties without your explicit consent, and we comply with all applicable data protection laws.'
      },
      {
        question: 'Can I delete my account and data?',
        answer: 'Yes, you can request account deletion by contacting our support team. We will delete your account and associated data within 30 days, except where we are legally required to retain certain information.'
      },
      {
        question: 'How do I enable two-factor authentication?',
        answer: 'Go to your Account Settings > Security, and click on "Enable Two-Factor Authentication." Follow the setup instructions to link your phone number or authenticator app for added security.'
      },
      {
        question: 'What should I do if I suspect unauthorized access?',
        answer: 'Immediately change your password and contact our security team at security@tymblhub.com. We will investigate and take appropriate action to secure your account.'
      }
    ],
    'Payment & Billing': [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment partners.'
      },
      {
        question: 'Can I get a refund for premium services?',
        answer: 'Refunds are available within 30 days of purchase if you are not satisfied with our premium services. Contact our support team with your request and reason for the refund.'
      },
      {
        question: 'How do I update my billing information?',
        answer: 'Go to your Account Settings > Billing to update your payment method, billing address, or subscription details. Changes take effect immediately for future payments.'
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'No, we are transparent about all fees. The price you see is the price you pay. There are no hidden charges or surprise fees on our platform.'
      }
    ],
    'Technical Support': [
      {
        question: 'What browsers are supported?',
        answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.'
      },
      {
        question: 'Is there a mobile app available?',
        answer: 'Yes, we have mobile apps for both iOS and Android devices. Download them from the App Store or Google Play Store for a better mobile experience.'
      },
      {
        question: 'What should I do if the website is not loading?',
        answer: 'First, check your internet connection. If the problem persists, try clearing your browser cache and cookies, or try accessing the site from a different browser or device.'
      },
      {
        question: 'How do I report a technical issue?',
        answer: 'Use our "Report Bug" feature or contact our technical support team at support@tymblhub.com. Include details about the issue, your device, and browser for faster resolution.'
      }
    ]
  };

  const categories = Object.keys(faqData);
  const allFaqs = Object.values(faqData).flat();

  const filteredFaqs = activeCategory === 'all'
    ? allFaqs.filter((faq: FAQ) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqData[activeCategory]?.filter((faq: FAQ) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about TymblHub. Can&apos;t find what you&apos;re looking for?
          Contact our support team for assistance.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Questions
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Results */}
      <div className="space-y-6">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all questions to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>

      {/* Popular Questions */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Popular Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">How do I get started with TymblHub?</h3>
            <p className="text-gray-600 text-sm">Create an account, complete your profile, and start browsing job opportunities. Our referral system will help you connect with potential employers.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Is TymblHub free to use?</h3>
            <p className="text-gray-600 text-sm">Yes, basic features are free. We also offer premium services for enhanced job search capabilities and priority support.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">How secure is my data?</h3>
            <p className="text-gray-600 text-sm">We use bank-level security measures to protect your personal information. Your data is encrypted and never shared without your consent.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Can I delete my account?</h3>
            <p className="text-gray-600 text-sm">Yes, you can request account deletion at any time. We will remove your data within 30 days, except where legally required to retain it.</p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Still Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm">support@tymblhub.com</p>
            <p className="text-gray-500 text-xs">Response within 24 hours</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm">+971 4 123 4567</p>
            <p className="text-gray-500 text-xs">Mon-Fri, 9 AM - 6 PM GST</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm">Available 24/7</p>
            <p className="text-gray-500 text-xs">Instant responses</p>
          </div>
        </div>
      </div>
    </div>
  );
}