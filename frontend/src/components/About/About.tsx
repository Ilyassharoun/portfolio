// src/components/About/About.tsx
import './About.css';

type AboutProps = {
  language: 'fr' | 'en';
};

export default function About({ language }: AboutProps) {
  const content = language === 'fr' ? {
    title: 'À propos de moi',
    subtitle: 'Développeur Full-Stack **passionné** par les nouvelles technologies, spécialisé dans la création de solutions web et mobiles **modernes et performantes**. Je combine compétences backend et frontend pour construire des applications complètes et évolutives.',
    getToKnowMe: 'Découvrez mon parcours',
    stats: {
      years: '2+',
      yearsLabel: "Années d'expérience",
      projects: '15+',
      projectsLabel: 'Projets réalisés'
    },
    description: `Développeur Full-Stack alliant formation en Développement Informatique à l'ILEIC Agadir et expérience backend professionnelle chez HKSolutions. Créateur de la plateforme de location Autogestion. Compétences en stack moderne (TypeScript, Node.js, Flutter, React, bases SQL/NoSQL). Trilingue (FR/AR/EN). En quête de projets stimulants pour appliquer mes compétences techniques et promouvoir l'innovation.`,
    buttonText: 'Me contacter',
    buttonIcon: 'mail'
  } : {
    title: 'About Me',
    subtitle: '**Passionate** Full-Stack Developer specializing in **modern, high-performance** web and mobile solutions. I combine backend and frontend expertise to build complete, scalable applications.',
    getToKnowMe: 'Get to know my journey',
    stats: {
      years: '2+',
      yearsLabel: 'Years Experience',
      projects: '15+',
      projectsLabel: 'Projects Completed'
    },
    description: `Full-Stack Developer combining Computer Development studies at ILEIC Agadir with professional backend experience at HKSolutions. Developer of Autogestion car rental platform. Skilled in modern stack (TypeScript, Node.js, Flutter, React, SQL/NoSQL databases). Trilingual (FR/AR/EN). Eager to tackle challenging projects and drive innovation.`,
    buttonText: 'Get In Touch',
    buttonIcon: 'mail'
  };

  const renderTextWithBold = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<span class="highlight-text">$1</span>');
  };

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Header with line and subtitle */}
        <div className="about-header">
          <div className="header-line-container">
            <div className="header-line"></div>
            <span className="header-subtitle">{content.getToKnowMe}</span>
          </div>
          <h1 className="about-title">
            {content.title}<span className="title-accent">.</span>
          </h1>
        </div>

        {/* Main Content */}
        <div className="about-content">
          <div className="content-wrapper">
            {/* Subtitle and Stats Row */}
            <div className="top-row">
              <div className="subtitle-container">
                <p 
                  className="about-subtitle" 
                  dangerouslySetInnerHTML={{ __html: renderTextWithBold(content.subtitle) }}
                />
              </div>
              
              {/* Stats Cards */}
              <div className="stats-container">
                <div className="stat-card">
                  <span className="stat-number">{content.stats.years}</span>
                  <span className="stat-label">{content.stats.yearsLabel}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{content.stats.projects}</span>
                  <span className="stat-label">{content.stats.projectsLabel}</span>
                </div>
              </div>
            </div>

            {/* Main Description */}
            <div className="description-container">
              <p className="about-description">
                {content.description}
              </p>
            </div>

            {/* Availability Note */}
            <div className="availability-note">
              <span className="material-symbols-outlined availability-icon">schedule</span>
              <span className="availability-text">
                {language === 'fr' ? 'Disponible pour de nouvelles opportunités' : 'Available for new opportunities'}
              </span>
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="about-cta">
          <a href="#contact" className="about-button">
            <span className="material-symbols-outlined button-icon">{content.buttonIcon}</span>
            <span>{content.buttonText}</span>
          </a>
        </div>
      </div>
    </section>
  );
}