'use client'

import React, { useState } from 'react'
import { useRegistration } from '../context/RegistrationContext'

// Role options
const roles = [
  { value: 'employee', label: 'Job Seeker' },
  { value: 'employer', label: 'Employer' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'student', label: 'Student' }
]

const StepTwo: React.FC = () => {
  const { registrationData, updateRegistrationData, setStep, saveCurrentStep } = useRegistration()
  
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    role?: string
    phoneNumber?: string
  }>({})
  
  // Function to validate required fields
  const validateField = (name: string, value: string) => {
    if (name === 'firstName' || name === 'lastName') {
      if (!value.trim()) {
        return `${name === 'firstName' ? 'First name' : 'Last name'} is required`
      }
    } else if (name === 'role') {
      if (!value) {
        return 'Please select your role'
      }
    }
    
    return ''
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'role') {
      updateRegistrationData(name, value as any)
    } else {
      updateRegistrationData(name as keyof typeof registrationData, value)
    }
    
    // Validate and set errors
    const errorMessage = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }))
  }
  
  const handlePrevious = () => {
    saveCurrentStep()
    setStep(1)
  }
  
  const handleNext = () => {
    // Check for required fields
    const newErrors: any = {}
    
    if (!registrationData.firstName) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!registrationData.lastName) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!registrationData.role) {
      newErrors.role = 'Please select your role'
    }
    
    // If there are errors, show them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Save and proceed
    saveCurrentStep()
    setStep(3)
  }
  
  return (
    <div className="step-container">
      <h2 className="step-title">Personal Information</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            value={registrationData.firstName}
            onChange={handleInputChange}
            placeholder="Your first name"
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            value={registrationData.lastName}
            onChange={handleInputChange}
            placeholder="Your last name"
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="role">I am a *</label>
        <select
          id="role"
          name="role"
          className={`form-select ${errors.role ? 'error' : ''}`}
          value={registrationData.role || ''}
          onChange={handleInputChange}
        >
          <option value="">Select your role</option>
          {roles.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        {errors.role && <p className="error-message">{errors.role}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          className="form-input"
          value={registrationData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Your phone number (optional)"
        />
      </div>
      
      <div className="form-actions">
        <button 
          type="button" 
          className="btn secondary-btn" 
          onClick={handlePrevious}
        >
          Back
        </button>
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

export default StepTwo 