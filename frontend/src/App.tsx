import { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Experience from './components/Experience/Experience'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

import './App.css'

function App() {
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

      <main>
        <Hero language={language} />
        <About language={language} />
        <Skills language={language} />
        <Experience language={language} />
        <Projects language={language} />

        <Contact language={language} />
      </main>

      <Footer language={language} />
    </>
  )
}

export default App