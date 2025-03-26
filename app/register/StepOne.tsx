'use client'

import React, { useState } from 'react'
import { useRegistration } from '../context/RegistrationContext'

const StepOne: React.FC = () => {
  const { registrationData, updateRegistrationData, setStep, saveCurrentStep } = useRegistration()
  
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})
  
  const [showPassword, setShowPassword] = useState(false)
  
  // Validate email format
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return 'Email is required'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    
    return ''
  }
  
  // Validate password strength
  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required'
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number'
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character'
    }
    
    return ''
  }
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    updateRegistrationData('email', email)
    
    const errorMessage = validateEmail(email)
    setErrors(prev => ({ ...prev, email: errorMessage }))
  }
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    updateRegistrationData('password', password)
    
    const errorMessage = validatePassword(password)
    setErrors(prev => ({ ...prev, password: errorMessage }))
  }
  
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }
  
  const handleNext = () => {
    // Validate both fields
    const emailError = validateEmail(registrationData.email)
    const passwordError = validatePassword(registrationData.password)
    
    // If there are any errors, don't proceed
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      })
      return
    }
    
    // Save and proceed to next step
    saveCurrentStep()
    setStep(2)
  }
  
  return (
    <div className="step-container">
      <h2 className="step-title">Create Your Account</h2>
      
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          value={registrationData.email}
          onChange={handleEmailChange}
          placeholder="Your email address"
          autoComplete="email"
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            value={registrationData.password}
            onChange={handlePasswordChange}
            placeholder="Create a password"
          />
          <button 
            type="button"
            className="password-toggle-btn"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.password && <p className="error-message">{errors.password}</p>}
        <p className="password-requirements">
          Password must be at least 8 characters and include numbers and special characters.
        </p>
      </div>
      
      <div className="form-actions">
        <div></div> {/* Empty div to maintain the flex space-between */}
        <button 
          type="button" 
          className="btn primary-btn" 
          onClick={handleNext}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default StepOne 