'use client'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} TymbleHub. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer 