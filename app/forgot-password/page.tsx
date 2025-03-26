'use client'

import React from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  return (
    <div className="container">
      <div style={{ 
        maxWidth: '500px', 
        margin: '3rem auto', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        backgroundColor: 'white'
      }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Reset Password</h1>
        <p style={{ marginBottom: '2rem' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Email Address
          </label>
          <input 
            type="email" 
            id="email"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Enter your email address"
          />
        </div>
        
        <button style={{
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '0.75rem 1.5rem',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '1rem'
        }}>
          Send Reset Link
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ 
            color: 'var(--primary-color)',
            textDecoration: 'none'
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 