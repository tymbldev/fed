'use client'

import React from 'react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Calculate the progress percentage
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

export default ProgressBar 