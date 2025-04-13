export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Us</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Welcome to TymblHub, your trusted partner in professional career growth and job search.
          We are dedicated to connecting talented professionals with outstanding career opportunities
          across various industries.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          Our mission is to revolutionize the way professionals find their dream jobs by leveraging
          the power of referrals and creating meaningful connections between job seekers and employers.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-3 mb-6">
          <li>Access to exclusive job opportunities from top companies</li>
          <li>Powerful referral system that increases your chances of getting hired</li>
          <li>Professional network building capabilities</li>
          <li>Dedicated support team to assist you throughout your job search</li>
          <li>Regular updates about relevant job openings</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
            <p className="text-gray-600">
              We believe in maintaining complete transparency in our processes and communications.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600">
              We continuously innovate to provide the best job search experience for our users.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
            <p className="text-gray-600">
              We strive for excellence in everything we do to ensure the best outcomes for our users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}