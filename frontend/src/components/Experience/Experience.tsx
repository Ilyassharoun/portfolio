// src/components/Experience/Experience.tsx
import './Experience.css';

type ExperienceProps = {
  language: 'fr' | 'en';
};

export default function Experience({ language }: ExperienceProps) {
  const content = language === 'fr' ? {
    title: 'Parcours Professionnel',
    subtitle: 'Une chronologie détaillée de mes expériences professionnelles et stages, avec les compétences techniques que j\'ai acquises.',
    
    experiences: [
      {
        id: 1,
        title: 'Stagiaire Développeur Backend',
        company: 'HK SOLUTIONS',
        period: 'Novembre 2025 — Présent',
        description: 'Développement Backend d\'un site web pour HK SOLUTIONS. Intégration d\'API tierces et optimisation des performances du site.',
        icon: 'code',
        type: 'stage'
      },
      {
        id: 2,
        title: 'Stagiaire Développeur Informatique',
        company: 'JMCars - Location de Voitures',
        period: 'Mars 2025 — Septembre 2025 (7 mois)',
        description: 'Développement d\'une application desktop Java pour la gestion des locations avec alertes d\'entretien. Création et personnalisation d\'un site WordPress pour les réservations en ligne.',
        icon: 'laptop_mac',
        type: 'stage'
      }
    ],
    
    stats: {
      experience: '2+',
      experienceLabel: "Années d'expérience",
      projects: '5+',
      projectsLabel: 'Projets réalisés',
      internships: '2',
      internshipsLabel: 'Stages effectués',
      commits: '300+',
      commitsLabel: 'Commits Git'
    }
  } : {
    title: 'Professional Journey',
    subtitle: 'A detailed timeline of my professional experiences and internships, with the technical skills I\'ve acquired.',
    
    experiences: [
      {
        id: 1,
        title: 'Backend Developer Intern',
        company: 'HK SOLUTIONS',
        period: 'November 2025 — Present',
        description: 'Backend development of a website for HK SOLUTIONS. Integrated third-party APIs and optimized site performance.',
        icon: 'code',
        type: 'internship'
      },
      {
        id: 2,
        title: 'Software Developer Intern',
        company: 'JMCars - Car Rental',
        period: 'March 2025 — September 2025 (7 months)',
        description: 'Developed a Java desktop application for car rental management including vehicle maintenance alerts. Built and customized a WordPress website for online bookings.',
        icon: 'laptop_mac',
        type: 'internship'
      }
    ],
    
    stats: {
      experience: '2+',
      experienceLabel: 'Years Experience',
      projects: '5+',
      projectsLabel: 'Projects Delivered',
      internships: '2',
      internshipsLabel: 'Internships Completed',
      commits: '300+',
      commitsLabel: 'Git Commits'
    }
  };

  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        {/* Header Section */}
        <div className="experience-header">
          <h1 className="experience-title">{content.title}</h1>
          <p className="experience-subtitle">{content.subtitle}</p>
        </div>

        {/* Main Content Grid */}
        <div className="experience-grid">
          {/* Left: Timeline (Work Experience) */}
          <div className="timeline-section">
            <div className="section-header">
              <span className="material-symbols-outlined section-icon">work</span>
              <h2 className="section-title">
                {language === 'fr' ? 'Expériences & Stages' : 'Experience & Internships'}
              </h2>
            </div>
            
            {/* Timeline */}
            <div className="timeline">
              {content.experiences.map((exp, index) => (
                <div key={exp.id} className="timeline-entry">
                  {/* Timeline Connector */}
                  {index < content.experiences.length - 1 && (
                    <div className="timeline-connector"></div>
                  )}
                  
                  <div className="timeline-content">
                    {/* Timeline Icon */}
                    <div className="timeline-icon">
                      <div className="icon-container">
                        <span className="material-symbols-outlined">{exp.icon}</span>
                      </div>
                    </div>

                    {/* Timeline Details */}
                    <div className="timeline-details">
                      <div className="experience-title-container">
                        <h3 className="experience-role">{exp.title}</h3>
                        <span className={`experience-type-badge ${exp.type}`}>
                          {language === 'fr' ? 'Stage' : 'Internship'}
                        </span>
                      </div>
                      <p className="experience-company">{exp.company}</p>
                      <p className="experience-period">{exp.period}</p>
                      <p className="experience-description">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats Section */}
          <div className="stats-section">
            <div className="section-header">
              <span className="material-symbols-outlined section-icon">insights</span>
              <h2 className="section-title">
                {language === 'fr' ? 'Aperçu' : 'Overview'}
              </h2>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="material-symbols-outlined stat-icon">schedule</span>
                  <div className="stat-info">
                    <h4 className="stat-title">{language === 'fr' ? 'Expérience' : 'Experience'}</h4>
                    <p className="stat-subtitle">{language === 'fr' ? 'Totale' : 'Total'}</p>
                  </div>
                  <span className="stat-value">{content.stats.experience}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="material-symbols-outlined stat-icon">folder</span>
                  <div className="stat-info">
                    <h4 className="stat-title">{language === 'fr' ? 'Projets' : 'Projects'}</h4>
                    <p className="stat-subtitle">{language === 'fr' ? 'Livrés' : 'Delivered'}</p>
                  </div>
                  <span className="stat-value">{content.stats.projects}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="material-symbols-outlined stat-icon">school</span>
                  <div className="stat-info">
                    <h4 className="stat-title">{language === 'fr' ? 'Stages' : 'Internships'}</h4>
                    <p className="stat-subtitle">{language === 'fr' ? 'Terminés' : 'Completed'}</p>
                  </div>
                  <span className="stat-value">{content.stats.internships}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="material-symbols-outlined stat-icon">code</span>
                  <div className="stat-info">
                    <h4 className="stat-title">{language === 'fr' ? 'Contributions' : 'Contributions'}</h4>
                    <p className="stat-subtitle">Git</p>
                  </div>
                  <span className="stat-value">{content.stats.commits}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Footer Stats */}
        <div className="footer-stats">
          <div className="footer-stat">
            <p className="stat-number">{content.stats.experience}</p>
            <p className="stat-label">{content.stats.experienceLabel}</p>
          </div>
          <div className="footer-stat">
            <p className="stat-number">{content.stats.projects}</p>
            <p className="stat-label">{content.stats.projectsLabel}</p>
          </div>
          <div className="footer-stat">
            <p className="stat-number">{content.stats.internships}</p>
            <p className="stat-label">{content.stats.internshipsLabel}</p>
          </div>
          <div className="footer-stat">
            <p className="stat-number">{content.stats.commits}</p>
            <p className="stat-label">{content.stats.commitsLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}