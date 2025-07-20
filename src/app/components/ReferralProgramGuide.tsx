import React from 'react';

const ReferralProgramGuide: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Build a comprehensive professional profile showcasing your skills, experience, and career goals. Add your resume and portfolio to increase your visibility.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: "from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500"
    },
    {
      number: 2,
      title: "Browse Opportunities",
      description: "Explore job opportunities across top companies. Use our advanced filters to find positions that match your skills, experience, and salary expectations.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: "from-secondary-500 to-secondary-600 dark:from-secondary-400 dark:to-secondary-500"
    },
    {
      number: 3,
      title: "Request Referrals",
      description: "Connect with professionals at your target companies. Send personalized referral requests with your profile and a compelling message about why you're a great fit.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: "from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400"
    },
    {
      number: 4,
      title: "Get Referred & Interview",
      description: "Once referred, your application gets priority consideration. Prepare for interviews with insights from your referrer about the company culture and role.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-green-500 to-green-600 dark:from-green-400 dark:to-green-500"
    }
  ];

  const benefits = [
    {
      title: "Higher Success Rate",
      description: "Referrals have 3x higher chance of getting hired compared to cold applications",
      icon: "📈",
      stat: "3x Higher"
    },
    {
      title: "Faster Process",
      description: "Skip the initial screening and get direct access to hiring managers",
      icon: "⚡",
      stat: "50% Faster"
    },
    {
      title: "Better Insights",
      description: "Get insider information about company culture and role expectations",
      icon: "💡",
      stat: "Insider Info"
    },
    {
      title: "Network Growth",
      description: "Build meaningful professional relationships that last beyond the job search",
      icon: "🤝",
      stat: "Long-term"
    }
  ];

  const faqs = [
    {
      question: "How do referrals work on TymblHub?",
      answer: "Our platform connects you with verified professionals at top companies. You can request referrals for specific positions, and if accepted, your application gets priority consideration in the hiring process."
    },
    {
      question: "Is there a cost to request referrals?",
      answer: "Basic referral requests are free for all users. Premium features and priority access are available through our subscription plans."
    },
    {
      question: "What happens if my referral request is declined?",
      answer: "Don't worry! You can request referrals from multiple professionals at the same company. Each request is independent, and one decline doesn't affect your other opportunities."
    },
    {
      question: "How do I increase my chances of getting referred?",
      answer: "Create a compelling profile, personalize your referral requests, and clearly explain why you're a great fit for the role. Building genuine connections with professionals also helps."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      {/* <section className="py-20 bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-primary-400/10 dark:from-primary-400/10 dark:via-secondary-400/5 dark:to-primary-300/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 dark:from-primary-400 dark:via-secondary-400 dark:to-primary-300 text-transparent bg-clip-text">
              How Our Referral Program Works
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Transform your job search with trusted referrals from industry professionals.
              <span className="block text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-2 font-normal">
                Learn how to leverage our network to accelerate your career growth
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Started Today
              </Link>
              <Link href="/search-referrals" className="btn border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300">
                Explore Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Four Simple Steps to Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our streamlined process makes it easy to connect with opportunities through trusted referrals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="group relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-700 z-0" style={{ width: 'calc(100% - 2rem)' }}></div>
                )}

                <div className="relative z-10 group card p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}>
                    {step.icon}
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-400 mb-4">0{step.number}</div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Referrals Work Better
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover the advantages of getting referred versus traditional job applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-6xl mb-4">{benefit.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{benefit.stat}</div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-white/90 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from professionals who transformed their careers through our referral program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group card p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-up">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  S
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Sarah Chen</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Software Engineer at Google</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                &quot;Through TymblHub, I connected with a senior engineer at Google who referred me. The process was smooth and I got the job within 3 weeks!&quot;
              </p>
            </div>

            <div className="group card p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Michael Rodriguez</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Product Manager at Microsoft</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                &quot;The referral gave me insights into the company culture that I couldn&apos;t get from job descriptions. It made all the difference in my interview preparation.&quot;
              </p>
            </div>

            <div className="group card p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Alex Thompson</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Data Scientist at Amazon</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                &quot;I was struggling with cold applications. TymblHub&apos;s referral program helped me bypass the initial screening and get directly to the hiring manager.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about our referral program
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="group card p-8 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReferralProgramGuide;