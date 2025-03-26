'use client'

import React, { useState } from 'react'
import { useRegistration } from '../context/RegistrationContext'

// Sample data for dropdowns
const designations = [
  { id: 1, name: 'Software Engineer' },
  { id: 2, name: 'Product Manager' },
  { id: 3, name: 'UX Designer' },
  { id: 4, name: 'Data Scientist' },
  { id: 5, name: 'Project Manager' },
]

const departments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Product' },
  { id: 3, name: 'Design' },
  { id: 4, name: 'Marketing' },
  { id: 5, name: 'Sales' },
]

const cities = [
  { id: 1, name: 'New York' },
  { id: 2, name: 'San Francisco' },
  { id: 3, name: 'London' },
  { id: 4, name: 'Toronto' },
  { id: 5, name: 'Sydney' },
]

const countries = [
  { id: 1, name: 'United States' },
  { id: 2, name: 'United Kingdom' },
  { id: 3, name: 'Canada' },
  { id: 4, name: 'Australia' },
  { id: 5, name: 'India' },
]

const StepThree: React.FC = () => {
  const { registrationData, updateRegistrationData, setStep, saveCurrentStep } = useRegistration()
  
  const [errors, setErrors] = useState<{
    company?: string
    designationId?: string
    departmentId?: string
    cityId?: string
    countryId?: string
    zipCode?: string
    linkedInProfile?: string
    portfolioUrl?: string
    resumeUrl?: string
    yearsOfExperience?: string
    currentSalary?: string
    expectedSalary?: string
    noticePeriod?: string
  }>({})
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // For select inputs, convert number strings to numbers
    if (['designationId', 'departmentId', 'cityId', 'countryId', 'yearsOfExperience'].includes(name)) {
      updateRegistrationData(name as keyof typeof registrationData, value ? Number(value) : null)
    } else {
      updateRegistrationData(name as keyof typeof registrationData, value)
    }
    
    // Clear any error for this field
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }
  
  const handlePrevious = () => {
    saveCurrentStep()
    setStep(2)
  }
  
  const handleNext = () => {
    // Validate the inputs - in a real application you might want to add more validation
    saveCurrentStep()
    setStep(4)
  }
  
  return (
    <div className="step-container">
      <h2 className="step-title">Professional Details</h2>
      
      <div className="form-group">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          className="form-input"
          value={registrationData.company}
          onChange={handleInputChange}
          placeholder="Your current company (if applicable)"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="designationId">Designation</label>
          <select
            id="designationId"
            name="designationId"
            className="form-select"
            value={registrationData.designationId || ''}
            onChange={handleInputChange}
          >
            <option value="">Select your designation</option>
            {designations.map(designation => (
              <option key={designation.id} value={designation.id}>
                {designation.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="departmentId">Department</label>
          <select
            id="departmentId"
            name="departmentId"
            className="form-select"
            value={registrationData.departmentId || ''}
            onChange={handleInputChange}
          >
            <option value="">Select your department</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="countryId">Country</label>
          <select
            id="countryId"
            name="countryId"
            className="form-select"
            value={registrationData.countryId || ''}
            onChange={handleInputChange}
          >
            <option value="">Select your country</option>
            {countries.map(country => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="cityId">City</label>
          <select
            id="cityId"
            name="cityId"
            className="form-select"
            value={registrationData.cityId || ''}
            onChange={handleInputChange}
          >
            <option value="">Select your city</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="zipCode">Zip/Postal Code</label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          className="form-input"
          value={registrationData.zipCode}
          onChange={handleInputChange}
          placeholder="Your zip/postal code"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="linkedInProfile">LinkedIn Profile</label>
        <input
          type="url"
          id="linkedInProfile"
          name="linkedInProfile"
          className="form-input"
          value={registrationData.linkedInProfile}
          onChange={handleInputChange}
          placeholder="https://linkedin.com/in/yourusername"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="portfolioUrl">Portfolio URL</label>
          <input
            type="url"
            id="portfolioUrl"
            name="portfolioUrl"
            className="form-input"
            value={registrationData.portfolioUrl}
            onChange={handleInputChange}
            placeholder="https://yourportfolio.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="resumeUrl">Resume URL</label>
          <input
            type="url"
            id="resumeUrl"
            name="resumeUrl"
            className="form-input"
            value={registrationData.resumeUrl}
            onChange={handleInputChange}
            placeholder="Link to your resume"
          />
        </div>
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

export default StepThree 