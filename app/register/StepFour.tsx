'use client'

import React, { useState } from 'react'
import { useRegistration } from '../context/RegistrationContext'

// Sample data for experience
const experienceOptions = [
  { value: 0, label: '0-1 years' },
  { value: 1, label: '1-3 years' },
  { value: 3, label: '3-5 years' },
  { value: 5, label: '5-7 years' },
  { value: 7, label: '7-10 years' },
  { value: 10, label: '10+ years' },
]

// Sample data for notice period
const noticePeriodOptions = [
  { value: 'immediate', label: 'Immediate' },
  { value: '15days', label: '15 Days' },
  { value: '30days', label: '30 Days' },
  { value: '60days', label: '60 Days' },
  { value: '90days', label: '90 Days' },
]

const StepFour: React.FC = () => {
  const { registrationData, updateRegistrationData, setStep, saveCurrentStep } = useRegistration()
  
  const [errors, setErrors] = useState<{
    yearsOfExperience?: string
    currentSalary?: string
    expectedSalary?: string
    noticePeriod?: string
    skills?: string
    education?: string
  }>({})
  
  const [newSkill, setNewSkill] = useState('')
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: ''
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // For select inputs with numeric values
    if (name === 'yearsOfExperience') {
      updateRegistrationData(name, value ? Number(value) : null)
    } else {
      updateRegistrationData(name as keyof typeof registrationData, value)
    }
    
    // Clear any error for this field
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }
  
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...(registrationData.skills || []), newSkill.trim()]
      updateRegistrationData('skills', updatedSkills)
      setNewSkill('')
    }
  }
  
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...(registrationData.skills || [])]
    updatedSkills.splice(index, 1)
    updateRegistrationData('skills', updatedSkills)
  }
  
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEducation(prev => ({ ...prev, [name]: value }))
  }
  
  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      const education = {
        degree: newEducation.degree,
        institution: newEducation.institution,
        year: newEducation.year
      }
      
      const updatedEducation = [...(registrationData.education || []), education]
      updateRegistrationData('education', updatedEducation)
      
      setNewEducation({
        degree: '',
        institution: '',
        year: ''
      })
    }
  }
  
  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...(registrationData.education || [])]
    updatedEducation.splice(index, 1)
    updateRegistrationData('education', updatedEducation)
  }
  
  const handlePrevious = () => {
    saveCurrentStep()
    setStep(3)
  }
  
  const handleSubmit = () => {
    // Validate the inputs if needed
    // Here you could submit the entire form data to your API
    saveCurrentStep()
    alert('Registration complete! Form data would be submitted to the API.')
    // In a real app, you would call an API and redirect on success
    // router.push('/registration-complete')
  }
  
  return (
    <div className="step-container">
      <h2 className="step-title">Career Information</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="yearsOfExperience">Years of Experience</label>
          <select
            id="yearsOfExperience"
            name="yearsOfExperience"
            className="form-select"
            value={registrationData.yearsOfExperience || ''}
            onChange={handleInputChange}
          >
            <option value="">Select experience</option>
            {experienceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="noticePeriod">Notice Period</label>
          <select
            id="noticePeriod"
            name="noticePeriod"
            className="form-select"
            value={registrationData.noticePeriod || ''}
            onChange={handleInputChange}
          >
            <option value="">Select notice period</option>
            {noticePeriodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="currentSalary">Current Salary</label>
          <input
            type="text"
            id="currentSalary"
            name="currentSalary"
            className="form-input"
            value={registrationData.currentSalary}
            onChange={handleInputChange}
            placeholder="Your current salary"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="expectedSalary">Expected Salary</label>
          <input
            type="text"
            id="expectedSalary"
            name="expectedSalary"
            className="form-input"
            value={registrationData.expectedSalary}
            onChange={handleInputChange}
            placeholder="Your expected salary"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Skills</label>
        <div className="skills-input-container">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className="form-input"
          />
          <button 
            type="button" 
            className="btn small-btn" 
            onClick={handleAddSkill}
          >
            Add
          </button>
        </div>
        
        {registrationData.skills && registrationData.skills.length > 0 ? (
          <div className="skills-list">
            {registrationData.skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                {skill}
                <button 
                  type="button" 
                  className="remove-btn" 
                  onClick={() => handleRemoveSkill(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-list-message">No skills added yet</p>
        )}
      </div>
      
      <div className="form-group">
        <label>Education</label>
        <div className="education-inputs">
          <input
            type="text"
            name="degree"
            value={newEducation.degree}
            onChange={handleEducationChange}
            placeholder="Degree/Certification"
            className="form-input"
          />
          <input
            type="text"
            name="institution"
            value={newEducation.institution}
            onChange={handleEducationChange}
            placeholder="Institution"
            className="form-input"
          />
          <input
            type="text"
            name="year"
            value={newEducation.year}
            onChange={handleEducationChange}
            placeholder="Year"
            className="form-input small-input"
          />
          <button 
            type="button" 
            className="btn small-btn" 
            onClick={handleAddEducation}
          >
            Add
          </button>
        </div>
        
        {registrationData.education && registrationData.education.length > 0 ? (
          <div className="education-list">
            {registrationData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="education-details">
                  <span className="degree">{edu.degree}</span>
                  <span className="institution">{edu.institution}</span>
                  {edu.year && <span className="year">{edu.year}</span>}
                </div>
                <button 
                  type="button" 
                  className="remove-btn" 
                  onClick={() => handleRemoveEducation(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-list-message">No education added yet</p>
        )}
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
          onClick={handleSubmit}
        >
          Complete Registration
        </button>
      </div>
    </div>
  )
}

export default StepFour 