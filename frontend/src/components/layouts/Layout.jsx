import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  const location = useLocation()
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tss_user'))
    } catch {
      return null
    }
  })
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Listen for storage changes to update user state
  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedUser = localStorage.getItem('tss_user')
        setUser(storedUser ? JSON.parse(storedUser) : null)
      } catch {
        setUser(null)
      }
    }

    // Listen for custom event when user signs in/out
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userChanged', handleStorageChange)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout