import React from 'react';
import { fetchIndustries } from './utils/serverData';
import AuthDependentContent from './components/AuthDependentContent';
import AuthDependentCTA from './components/AuthDependentCTA';
import IndustriesCarousel from "./components/IndustriesCarousel";
import ExploreOpportunitiesButton from './components/ExploreOpportunitiesButton';
import ReferralProgramGuide from './components/ReferralProgramGuide';

export default async function Home() {
  // Get industries data on the server
  const industries = await fetchIndustries();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section - SSR */}
      <section className="relative flex items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/15 to-primary-400/10 dark:from-primary-400/20 dark:via-secondary-400/15 dark:to-primary-300/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-gray-800/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 dark:from-primary-400 dark:via-secondary-400 dark:to-primary-300 text-transparent bg-clip-text leading-tight">
                Unlock Your
                <span className="block text-4xl md:text-5xl lg:text-6xl mt-2">Career Potential</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                Discover exclusive job opportunities through trusted referrals.
                <span className="block text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-2 font-normal">
                  Join a network of professionals who help each other succeed
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <ExploreOpportunitiesButton className="btn btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explore Opportunities
                  </span>
                </ExploreOpportunitiesButton>

                {/* Auth-dependent content */}
                <AuthDependentContent />
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary-500/10 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-primary-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-8 w-8 h-8 bg-secondary-400/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </section>


      <IndustriesCarousel industries={industries} />

      {/* Features Section - SSR */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Why <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">TymblHub</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We&apos;re revolutionizing how professionals connect with opportunities through trusted referrals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group card p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-up">
              <div className="flex flex-col md:block">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">Smart Referral Matching</h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our AI-powered platform matches you with the perfect opportunities based on your skills, experience, and career goals
              </p>
            </div>

            <div className="group card p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col md:block">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 dark:from-secondary-400 dark:to-secondary-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-secondary-500 transition-colors duration-300">Trusted Professional Network</h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Connect with verified professionals and industry leaders who can vouch for your capabilities and open doors
              </p>
            </div>

            <div className="group card p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col md:block">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">Enterprise Security</h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Your personal and professional data is protected with bank-level security and privacy controls
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - SSR */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/90 font-medium">Active Professionals</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-white/90 font-medium">Top Companies</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2K+</div>
              <div className="text-white/90 font-medium">Successful Placements</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">95%</div>
              <div className="text-white/90 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - SSR with auth-dependent parts */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of professionals who have accelerated their careers through trusted referrals.
            <span className="block text-lg md:text-xl text-white/70 mt-3">
              Your next big opportunity is just one connection away
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Auth-dependent CTA buttons */}
            <AuthDependentCTA />

            <ExploreOpportunitiesButton className="btn border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-10 py-5 transform hover:scale-105 transition-all duration-300">
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore Opportunities
              </span>
            </ExploreOpportunitiesButton>
          </div>
        </div>
      </section>

      {/* Referral Program Guide Section */}
      <ReferralProgramGuide />
    </main>
  );
}