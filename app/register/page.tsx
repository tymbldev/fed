'use client'

import React, { useState } from 'react'
import { RegistrationProvider } from '../context/RegistrationContext'
import StepOne from './StepOne'
import './register.css'

// Placeholder components until the actual ones are created
const StepTwo = () => <div>Step Two: Personal Information (Coming Soon)</div>
const StepThree = () => <div>Step Three: Professional Details (Coming Soon)</div>
const StepFour = () => <div>Step Four: Career Information (Coming Soon)</div>

// Simple Progress Bar component
const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100
  
  return (
    <div className="progress-container">
      <div className="progress-steps">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div 
            key={i} 
            className={`progress-step ${i + 1 === currentStep ? 'active' : ''} ${i + 1 < currentStep ? 'completed' : ''}`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <StepOne />
      case 2:
        return <StepTwo />
      case 3:
        return <StepThree />
      case 4:
        return <StepFour />
      default:
        return <StepOne />
    }
  }
  
  return (
    <RegistrationProvider>
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">Create Your Account</h1>
          <p className="register-subtitle">Join <span className="highlight">TymbleHub</span> and find your perfect job opportunity</p>
        </div>
        
        <ProgressBar currentStep={currentStep} totalSteps={4} />
        
        {renderStep()}
      </div>
    </RegistrationProvider>
  )
}

export default Register 