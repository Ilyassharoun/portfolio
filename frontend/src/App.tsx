import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Experience from './components/Experience/Experience';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import Login from './components/Login/Login';
import Unauthorized from './pages/Unauthorized';
import VisitorDashboard from './components/VisitorDashboard/VisitorDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';


import './App.css';

function AppContent() {
  const location = useLocation();

  // Track visitor on route change (only once per session to avoid counting refreshes)
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Check if we've already tracked a visitor in this session
        const hasTracked = sessionStorage.getItem('visitorTracked');
        if (hasTracked) return;

        await axios.post('http://localhost:3000/api/visitors/track', {
          ipAddress: 'unknown', // The backend will capture the actual IP // In a real app, you would get the actual IP
          userAgent: navigator.userAgent,
          path: location.pathname
        });
        // Mark that we've tracked a visitor in this session
        sessionStorage.setItem('visitorTracked', 'true');
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, [location]);

  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [language, setLanguage] = useState<'en' | 'fr'>('en')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr')
  }

  return (
    <>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        toggleLanguage={toggleLanguage}
      />

      <Routes>
        <Route path="/" element={
          <main>
            <Hero language={language} />
            <About language={language} />
            <Skills language={language} />
            <Experience language={language} />
            <Projects language={language} />
            <Contact language={language} />
          </main>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="admin"><VisitorDashboard /></ProtectedRoute>} />
      </Routes>

      <Footer language={language} />
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App