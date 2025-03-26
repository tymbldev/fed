'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const openLoginModal = () => {
    console.log('Opening login modal')
    setShowLoginModal(true)
    setIsMobileMenuOpen(false) // Close mobile menu when opening login
  }
  
  const closeLoginModal = () => {
    console.log('Closing login modal') 
    setShowLoginModal(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
    console.log('Password visibility toggled to:', !showPassword)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  const handleRegister = () => {
    console.log('Register button clicked, navigating to /register')
    closeLoginModal() // Close modal if it's open
    setIsMobileMenuOpen(false) // Close mobile menu
    // Use window.location for a hard navigation to ensure it works
    window.location.href = '/register'
  }

  // Close mobile menu when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileMenuOpen])
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isNavClick = target.closest('.nav');
      const isMenuToggleClick = target.closest('.mobile-menu-toggle');
      
      if (!isNavClick && !isMenuToggleClick) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <div className="logo">
            <Link href="/">
              <div className="logo-container">
                <Image src="/favicon.svg" alt="TymbleHub Logo" className="logo-icon" width={36} height={36} />
                <span className="logo-text">TymbleHub</span>
              </div>
            </Link>
          </div>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <ul>
            <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
            <li><Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)}>Jobs</Link></li>
            <li><Link href="/refer" onClick={() => setIsMobileMenuOpen(false)}>Refer</Link></li>
            <li><Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link></li>
            <li>
              <button 
                type="button" 
                className="login-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Login button clicked directly");
                  openLoginModal();
                }}
              >
                Login
              </button>
            </li>
            <li>
              <button 
                type="button"
                className="login-btn" 
                onClick={handleRegister}
              >
                Register
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {showLoginModal && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div 
            className="login-modal visible"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={closeLoginModal}>
              ✕
            </button>
            
            <div className="login-container">
              <h1>Login</h1>
              <button 
                onClick={handleRegister}
                className="register-link"
              >
                Register for free
              </button>
              
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <label htmlFor="email">Email ID / Username</label>
                  <input 
                    type="text" 
                    id="email" 
                    placeholder="Enter your active Email ID / Username" 
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      placeholder="Enter your password" 
                    />
                    <button 
                      type="button" 
                      className="show-password"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Link href="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>
                
                <button 
                  type="button" 
                  className="login-submit-btn"
                  onClick={() => console.log('Login form submitted')}
                >
                  Login
                </button>
              </form>
              
              <div className="login-alternative">
                <div className="divider">
                  <span>Or</span>
                </div>
                
                <button 
                  className="linkedin-login-btn"
                  onClick={() => console.log('LinkedIn login clicked')}
                >
                  <Image 
                    src="/linkedin-icon.svg" 
                    alt="LinkedIn" 
                    width={24} 
                    height={24} 
                    className="linkedin-icon"
                  />
                  <span>Sign in with LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 