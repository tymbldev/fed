'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleRegister = () => {
    console.log('Register Now button clicked, navigating to /register')
    // Use window.location for a hard navigation to ensure it works
    window.location.href = '/register'
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="hero-section">
          <h1>Welcome to <span className="highlight">TymbleHub</span></h1>
          <p className="tagline">Your network for recruitment referrals</p>
          <p className="description">
            Connect with professionals who can refer you to your dream job. 
            TymbleHub bridges the gap between job seekers and referrers.
          </p>
          <div className="home-cta-buttons">
            <button 
              className="home-btn primary-btn"
              onClick={() => console.log('CTA button clicked')}
            >
              Find Referrers
            </button>
            <button 
              className="home-btn secondary-btn"
              onClick={handleRegister}
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 