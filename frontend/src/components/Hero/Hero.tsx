// src/components/Hero/Hero.tsx
import { useState } from 'react';
import { 
  FaCode, 
  FaDatabase, 
  FaMobileAlt 
} from 'react-icons/fa';
import './Hero.css';

type HeroProps = {
  language: 'fr' | 'en';
};

export default function Hero({ language }: HeroProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [, setDownloadError] = useState<string | null>(null);
  
  const content = {
    greeting: language === 'fr' ? 'Bonjour, je suis' : 'Hello, I\'m',
    name: 'Ilyass Haroun',
    tagline: language === 'fr' 
      ? 'Développeur de logiciels créant des solutions évolutives'
      : 'Software Developer building scalable solutions',
    description: language === 'fr'
      ? 'Je crée des applications propres, efficaces et centrées sur l\'utilisateur en me concentrant sur les performances et les principes de design minimaliste.'
      : 'I create clean, efficient, and user-centric applications with a focus on performance and minimalist design principles.',
    cv: language === 'fr' ? 'Télécharger CV' : 'Download CV',
    contact: language === 'fr' ? 'Me contacter' : 'Contact Me',
    available: language === 'fr' ? 'Disponible pour nouveaux projets' : 'Available for new projects',
    expertise: {
      title: language === 'fr' ? 'Expertise Principale' : 'Core Expertise',
      description: language === 'fr' 
        ? 'Spécialisation en développement full-stack moderne et conception architecturale.'
        : 'Specializing in modern full-stack development and architectural design.',
      frontend: {
        title: language === 'fr' ? 'Développement Frontend' : 'Frontend Dev',
        description: language === 'fr'
          ? 'Création d\'interfaces réactives avec React, TypeScript et CSS pour une expérience utilisateur optimale.'
          : 'Crafting responsive interfaces with React, TypeScript, and Tailwind CSS for optimal user experience.'
      },
      backend: {
        title: language === 'fr' ? 'Architecture Backend' : 'Backend Architecture',
        description: language === 'fr'
          ? 'Conception de systèmes côté serveur robustes utilisant Node.js, Python et des bases de données PostgreSQL évolutives.'
          : 'Designing robust server-side systems using Node.js, Python, and scalable PostgreSQL databases.'
      },
      mobile: {
        title: language === 'fr' ? 'Développement Mobile' : 'Mobile Development',
        description: language === 'fr'
          ? 'Création d\'applications performantes multiplateformes avec Flutter pour iOS et Android.'
          : 'Building high-performance cross-platform applications with Flutter for iOS and Android.'
      }
    }
  };

  const handleDownloadCV = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://portfolio-backend-ceqv.onrender.com/api';
      const response = await fetch(`${API_URL}/cv`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'HarounIlyass.pdf';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(error instanceof Error ? error.message : 'Download failed');
      
      alert(language === 'fr' 
        ? 'Échec du téléchargement. Veuillez réessayer plus tard.' 
        : 'Download failed. Please try again later.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="profile" className="hero-section">
      <div className="hero-container">
        {/* Hero Section */}
        <div className="hero-content-wrapper">
          {/* Profile Image */}
          <div className="profile-image-container">
            <img 
              src="/assets/images/profile.png" 
              alt="Ilyass Haroun"
            />
          </div>

          {/* Hero Content */}
          <div className="hero-text-content">
            {/* Availability Badge */}
            <div className="availability-badge">
              <span className="ping-dot">
                <span className="ping-outer"></span>
                <span className="ping-inner"></span>
              </span>
              {content.available}
            </div>

            {/* Name and Tagline */}
            <h1 className="hero-title">
              {content.greeting} <span>{content.name}</span>
              <div className="hero-subtitle mt-2">{content.tagline}</div>
            </h1>

            {/* Description */}
            <p className="hero-description">
              {content.description}
            </p>

            {/* Buttons */}
            <div className="hero-buttons">
              <button 
                className="hero-btn hero-btn-primary"
                onClick={handleDownloadCV}
                disabled={isDownloading}
              >
                {isDownloading 
                  ? (language === 'fr' ? 'Téléchargement...' : 'Downloading...')
                  : content.cv
                }
              </button>
              <a href="#contact" className="hero-btn hero-btn-secondary">
                {content.contact}
              </a>
            </div>
          </div>
        </div>

        {/* Expertise Section */}
        <div className="expertise-section">
          <div className="expertise-header">
            <h2 className="expertise-title">
              {content.expertise.title}
            </h2>
            <p className="expertise-description">
              {content.expertise.description}
            </p>
          </div>

          <div className="expertise-grid">
            {/* Frontend Card */}
            <div className="expertise-card">
              <div className="expertise-icon">
                <FaCode size={24} />
              </div>
              <div className="expertise-content">
                <h3>{content.expertise.frontend.title}</h3>
                <p>{content.expertise.frontend.description}</p>
              </div>
            </div>

            {/* Backend Card */}
            <div className="expertise-card">
              <div className="expertise-icon">
                <FaDatabase size={24} />
              </div>
              <div className="expertise-content">
                <h3>{content.expertise.backend.title}</h3>
                <p>{content.expertise.backend.description}</p>
              </div>
            </div>

            {/* Mobile Card */}
            <div className="expertise-card">
              <div className="expertise-icon">
                <FaMobileAlt size={24} />
              </div>
              <div className="expertise-content">
                <h3>{content.expertise.mobile.title}</h3>
                <p>{content.expertise.mobile.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}