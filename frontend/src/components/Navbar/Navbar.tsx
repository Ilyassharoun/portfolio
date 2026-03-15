// src/components/Navbar/Navbar.tsx
import { useState } from 'react';
import './Navbar.css';

type NavbarProps = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: 'fr' | 'en';
  toggleLanguage: () => void;
};

export default function Navbar({
  theme,
  toggleTheme,
  language,
  toggleLanguage
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: language === 'fr' ? 'Accueil' : 'Home', href: '#profile' },
    { label: language === 'fr' ? 'À propos' : 'About', href: '#about' },
    { label: language === 'fr' ? 'Projets' : 'Projects', href: '#projects' },
    { label: language === 'fr' ? 'Compétences' : 'Skills', href: '#skills' },
    { label: language === 'fr' ? 'Expérience' : 'Experience', href: '#experience' },
    { label: language === 'fr' ? 'Contact' : 'Contact', href: '#contact' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <div className="logo-icon">
            <span>IH</span>
          </div>
          <div className="logo-text">
            <span className="logo-name">Ilyass Haroun</span>
            <span className="logo-title">{language === 'fr' ? 'Dev Logiciel' : 'Software Dev'}</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-desktop">
          <div className="nav-links">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
          
          <div className="nav-controls">
            <button 
              className="btn-language" 
              onClick={toggleLanguage}
              aria-label={language === 'fr' ? 'Changer la langue' : 'Change language'}
            >
              <span className="btn-text">
                {language.toUpperCase()}
              </span>
              <span className="btn-icon">🌐</span>
            </button>
            
            <button 
              className="btn-theme" 
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Switch to dark mode'}
            >
              <span className="theme-icon">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
          
          <div className="mobile-controls">
            <button 
              className="mobile-btn-language" 
              onClick={toggleLanguage}
            >
              <span>{language.toUpperCase()}</span>
            </button>
            <button 
              className="mobile-btn-theme" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}