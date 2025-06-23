import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - TymblHub | Professional Career Growth & Job Referral Platform',
  description: 'Learn about TymblHub, your trusted partner in professional career growth. We connect talented professionals with outstanding career opportunities through our innovative referral system.',
  keywords: 'about TymblHub, career growth, job referrals, professional networking, job search platform, career opportunities',
  openGraph: {
    title: 'About Us - TymblHub',
    description: 'Your trusted partner in professional career growth and job search',
    type: 'website',
  },
};

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About TymblHub</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-8">
          Welcome to TymblHub, your trusted partner in professional career growth and job search.
          We are dedicated to connecting talented professionals with outstanding career opportunities
          across various industries through our innovative referral-based platform.
        </p>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Our mission is to revolutionize the way professionals find their dream jobs by leveraging
            the power of referrals and creating meaningful connections between job seekers and employers.
            We believe that personal connections and trusted referrals lead to better job matches and
            more successful career outcomes.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Why Choose TymblHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Exclusive Job Opportunities</h3>
                  <p className="text-gray-600">Access to exclusive job opportunities from top companies that may not be advertised elsewhere.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Powerful Referral System</h3>
                  <p className="text-gray-600">Our referral system increases your chances of getting hired by connecting you with employees at target companies.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Professional Network Building</h3>
                  <p className="text-gray-600">Build and expand your professional network with industry leaders and potential employers.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Dedicated Support Team</h3>
                  <p className="text-gray-600">Our dedicated support team assists you throughout your job search journey with personalized guidance.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Regular Job Updates</h3>
                  <p className="text-gray-600">Receive regular updates about relevant job openings that match your skills and preferences.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Advanced Matching Technology</h3>
                  <p className="text-gray-600">Our AI-powered matching technology ensures you find the most relevant opportunities.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">
                We believe in maintaining complete transparency in our processes and communications.
                You always know what&apos;s happening with your applications and referrals.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to provide the best job search experience for our users,
                leveraging cutting-edge technology and industry best practices.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do to ensure the best outcomes for our users
                and maintain the highest standards of service quality.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-6 text-lg">
            TymblHub was founded with a simple yet powerful vision: to make job searching more human
            and more effective. We recognized that traditional job boards often lead to impersonal
            applications and low success rates. By focusing on referrals and personal connections,
            we&apos;ve created a platform that puts people first.
          </p>
          <p className="text-gray-600 mb-6 text-lg">
            Since our inception, we&apos;ve helped thousands of professionals find their dream jobs
            and assisted companies in finding the perfect candidates. Our success is measured not just
            in numbers, but in the stories of career growth and professional fulfillment we&apos;ve
            helped create.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Commitment</h2>
          <div className="bg-blue-50 p-8 rounded-lg">
            <p className="text-gray-700 text-lg mb-4">
              We are committed to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Providing exceptional user experience and support</li>
              <li>Maintaining the highest standards of data security and privacy</li>
              <li>Continuously improving our platform based on user feedback</li>
              <li>Building a diverse and inclusive professional community</li>
              <li>Supporting career growth and professional development</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}