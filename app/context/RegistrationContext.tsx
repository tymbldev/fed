'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define types
export type Role = 'JOB_SEEKER' | 'RECRUITER' | 'REFERRER'

export interface Education {
  degree: string
  institution: string
  year: string
}

export interface RegistrationData {
  // Basic Information
  email: string
  password: string
  firstName: string
  lastName: string
  role: Role | null
  phoneNumber: string
  
  // Professional Details
  company: string
  designationId: number | null
  departmentId: number | null
  cityId: number | null
  countryId: number | null
  zipCode: string
  
  // Social Profiles
  linkedInProfile: string
  portfolioUrl: string
  resumeUrl: string
  
  // Experience
  yearsOfExperience: number | null
  currentSalary: string
  expectedSalary: string
  noticePeriod: string
  
  // Skills
  skills: string[]
  
  // Education
  education: Education[]
}

// Initial state
const initialRegistrationData: RegistrationData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: null,
  phoneNumber: '',
  company: '',
  designationId: null,
  departmentId: null,
  cityId: null,
  countryId: null,
  zipCode: '',
  linkedInProfile: '',
  portfolioUrl: '',
  resumeUrl: '',
  yearsOfExperience: null,
  currentSalary: '',
  expectedSalary: '',
  noticePeriod: '',
  skills: [],
  education: []
}

interface RegistrationContextType {
  registrationData: RegistrationData
  updateRegistrationData: (field: keyof RegistrationData, value: any) => void
  step: number
  setStep: (step: number) => void
  saveCurrentStep: () => void
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export const useRegistration = () => {
  const context = useContext(RegistrationContext)
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider')
  }
  return context
}

interface RegistrationProviderProps {
  children: ReactNode
}

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialRegistrationData)
  const [step, setStep] = useState(1)

  const updateRegistrationData = (field: keyof RegistrationData, value: any) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveCurrentStep = () => {
    // Here you would implement the actual saving logic
    // For now, we'll just log the current data
    console.log('Saving data for step', step, registrationData)
    
    // In a real app, you would send this to your backend
    // Example: api.post('/register/step/' + step, { data: registrationData })
  }

  return (
    <RegistrationContext.Provider value={{ 
      registrationData, 
      updateRegistrationData, 
      step, 
      setStep,
      saveCurrentStep
    }}>
      {children}
    </RegistrationContext.Provider>
  )
} 