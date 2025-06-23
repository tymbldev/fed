'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const footerLinks = {
    company: [
      { href: '/', label: 'Home' },
      { href: '/about-us', label: 'About Us' },
      { href: '/contact-us', label: 'Contact Us' },
      { href: '/feedback', label: 'Feedback' },
    ],
    legal: [
      { href: '/terms-conditions', label: 'Terms & Conditions' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/security-advice', label: 'Security Advice' },
    ],
    support: [
      { href: '/fraud', label: 'Fraud' },
      { href: '/report-bug', label: 'Report Bug' },
      { href: '/summons-notices', label: 'Summons/Notices' },
      { href: '/grievances', label: 'Grievances' },
      { href: '/faqs', label: 'FAQs' },
    ],
  };

  // const socialLinks = [
  //   { href: 'https://facebook.com', icon: '/icons/facebook.svg', label: 'Facebook' },
  //   { href: 'https://linkedin.com', icon: '/icons/linkedin.svg', label: 'LinkedIn' },
  //   { href: 'https://instagram.com', icon: '/icons/instagram.svg', label: 'Instagram' },
  //   { href: 'https://youtube.com', icon: '/icons/youtube.svg', label: 'YouTube' },
  //   { href: 'https://twitter.com', icon: '/icons/twitter.svg', label: 'Twitter' },
  // ];

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Links */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="TymblHub"
                width={180}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>
            {/* <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Social Links</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">{social.label}</span>
                    <Image
                      src={social.icon}
                      alt={social.label}
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                  </a>
                ))}
              </div>
            </div> */}
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 w-full">
              <p className="text-sm text-gray-400 text-center">
                © {new Date().getFullYear()} TymblHub. All rights reserved.
              </p>
            </div>
            {/* <div className="flex items-center space-x-4">
              <Link href="/app-store" className="block">
                <Image
                  src="/app-store.png"
                  alt="Download on App Store"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <Link href="/play-store" className="block">
                <Image
                  src="/play-store.png"
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}