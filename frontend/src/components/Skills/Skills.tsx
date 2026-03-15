// src/components/Skills/Skills.tsx
import { useState } from 'react';
import './Skills.css';

type SkillsProps = {
  language: 'fr' | 'en';
};

export default function Skills({ language }: SkillsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const content = language === 'fr' ? {
    title: 'Compétences Techniques Complètes',
    subtitle: 'Un aperçu détaillé de ma stack technique et de mes niveaux d\'expertise dans les différents domaines du génie logiciel.',
    searchPlaceholder: 'Rechercher une compétence (ex: React, Docker, Python)...',
    
    categories: {
      programming: {
        title: 'Langages de Programmation',
        icon: 'code',
        skills: [
          { name: 'TypeScript', level: 4, badge: 'Expert', skillIcon: 'data_object' },
          { name: 'JavaScript', level: 5, skillIcon: 'javascript' },
          { name: 'Python', level: 4, skillIcon: 'terminal' },
          { name: 'Java', level: 4, skillIcon: 'coffee' },
          { name: 'PHP', level: 4, skillIcon: 'php' },
          { name: 'C#', level: 3, skillIcon: 'tag' }, // Changed from c_sharp
          { name: 'Dart', level: 3, skillIcon: 'arrow_right_alt' } // Changed from dart
        ]
      },
      frontend: {
        title: 'Développement Frontend',
        icon: 'layers',
        skills: [
          { name: 'React', level: 5, badge: 'Expert', skillIcon: 'token' },
          { name: 'Flutter', level: 4, badge: 'Avancé', skillIcon: 'flutter_dash' }, // Changed from flutter
          { name: 'HTML/CSS', level: 5, badge: 'Expert', skillIcon: 'code' },
          { name: 'Windev', level: 3, badge: 'Intermédiaire', skillIcon: 'desktop_windows' }
        ]
      },
      backend: {
        title: 'Backend & Bases de Données',
        icon: 'storage',
        skills: [
          { name: 'Node.js', level: 5, skillIcon: 'dns' },
          { name: 'Express.js', level: 5, skillIcon: 'api' }, // Changed from express
          { name: 'Django', level: 3, skillIcon: 'developer_board' }, // Changed from django
          { name: 'Laravel', level: 3, skillIcon: 'pattern' }, // Changed from laravel
          { name: 'MySQL', level: 5, skillIcon: 'database' },
          { name: 'MongoDB', level: 4, skillIcon: 'view_list' }, // Changed from mongodb
          { name: 'PostgreSQL', level: 3, skillIcon: 'view_column' }, // Changed from postgresql
          { name: 'Firebase', level: 4, skillIcon: 'fireplace' }, // Changed from firebase
          { name: 'SQLite', level: 4, skillIcon: 'view_agenda' } // Changed from sqflite
        ]
      },
      tools: {
        title: 'Outils & DevOps',
        icon: 'settings_suggest',
        skills: [
          { name: 'Git', level: 5, badge: 'Expert', skillIcon: 'fork_right' }, // Changed from git
          { name: 'VS Code', level: 5, badge: 'Expert', skillIcon: 'code' },
          { name: 'Android Studio', level: 4, badge: 'Avancé', skillIcon: 'android' },
          { name: 'Swagger', level: 3, badge: 'Intermédiaire', skillIcon: 'api' },
          { name: 'WordPress', level: 4, badge: 'Avancé', skillIcon: 'web' } // Changed from wordpress
        ]
      }
    },
    
    stats: {
      experience: '2+',
      experienceLabel: "Années d'expérience",
      projects: '5+',
      projectsLabel: 'Projets réalisés',
      languages: '7',
      languagesLabel: 'Langues',
      commits: '300+',
      commitsLabel: 'Commits Git'
    }
  } : {
    title: 'Comprehensive Technical Skills',
    subtitle: 'A detailed overview of my technical stack and expertise levels across various domains of software engineering.',
    searchPlaceholder: 'Search for a skill (e.g. React, Docker, Python)...',
    
    categories: {
      programming: {
        title: 'Programming Languages',
        icon: 'code',
        skills: [
          { name: 'TypeScript', level: 4, badge: 'Expert', skillIcon: 'data_object' },
          { name: 'JavaScript', level: 5, skillIcon: 'javascript' },
          { name: 'Python', level: 4, skillIcon: 'terminal' },
          { name: 'Java', level: 4, skillIcon: 'coffee' },
          { name: 'PHP', level: 4, skillIcon: 'php' },
          { name: 'C#', level: 3, skillIcon: 'tag' },
          { name: 'Dart', level: 3, skillIcon: 'arrow_right_alt' }
        ]
      },
      frontend: {
        title: 'Frontend Development',
        icon: 'layers',
        skills: [
          { name: 'React', level: 5, badge: 'Expert', skillIcon: 'token' },
          { name: 'Flutter', level: 4, badge: 'Advanced', skillIcon: 'flutter_dash' },
          { name: 'HTML/CSS', level: 5, badge: 'Expert', skillIcon: 'code' },
          { name: 'Windev', level: 3, badge: 'Intermediate', skillIcon: 'desktop_windows' }
        ]
      },
      backend: {
        title: 'Backend & Databases',
        icon: 'storage',
        skills: [
          { name: 'Node.js', level: 5, skillIcon: 'dns' },
          { name: 'Express.js', level: 5, skillIcon: 'api' },
          { name: 'Django', level: 3, skillIcon: 'developer_board' },
          { name: 'Laravel', level: 3, skillIcon: 'pattern' },
          { name: 'MySQL', level: 5, skillIcon: 'database' },
          { name: 'MongoDB', level: 4, skillIcon: 'view_list' },
          { name: 'PostgreSQL', level: 3, skillIcon: 'view_column' },
          { name: 'Firebase', level: 4, skillIcon: 'fireplace' },
          { name: 'SQLite', level: 4, skillIcon: 'view_agenda' }
        ]
      },
      tools: {
        title: 'Tools & DevOps',
        icon: 'settings_suggest',
        skills: [
          { name: 'Git', level: 5, badge: 'Expert', skillIcon: 'fork_right' },
          { name: 'VS Code', level: 5, badge: 'Expert', skillIcon: 'code' },
          { name: 'Android Studio', level: 4, badge: 'Advanced', skillIcon: 'android' },
          { name: 'Swagger', level: 3, badge: 'Intermediate', skillIcon: 'api' },
          { name: 'WordPress', level: 4, badge: 'Advanced', skillIcon: 'web' }
        ]
      }
    },
    
    stats: {
      experience: '2+',
      experienceLabel: 'Years Experience',
      projects: '5+',
      projectsLabel: 'Projects Delivered',
      languages: '7',
      languagesLabel: 'Languages',
      commits: '300+',
      commitsLabel: 'Git Commits'
    }
  };

  const renderSkillLevel = (level: number) => {
    return (
      <div className="skill-level-indicator">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className={`skill-level-dot ${i < level ? 'active' : 'inactive'}`}
          />
        ))}
      </div>
    );
  };

  const filteredSkills = (skills: any[]) => {
    if (!searchQuery.trim()) return skills;
    const query = searchQuery.toLowerCase();
    return skills.filter(skill => 
      skill.name.toLowerCase().includes(query)
    );
  };

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        {/* Header Section */}
        <div className="skills-header">
          <h1 className="skills-title">{content.title}</h1>
          <p className="skills-subtitle">{content.subtitle}</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="search-input"
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {/* Programming Languages */}
          <div className="skill-card">
            <div className="skill-card-header">
              <span className="material-symbols-outlined skill-category-icon">
                {content.categories.programming.icon}
              </span>
              <h3 className="skill-category-title">{content.categories.programming.title}</h3>
            </div>
            <div className="skills-list">
              {filteredSkills(content.categories.programming.skills).map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-info">
                    <span className="material-symbols-outlined skill-icon">
                      {skill.skillIcon}
                    </span>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                  {skill.badge ? (
                    <span className={`skill-badge ${skill.badge.toLowerCase()}`}>
                      {skill.badge}
                    </span>
                  ) : renderSkillLevel(skill.level)}
                </div>
              ))}
            </div>
          </div>

          {/* Frontend Development */}
          <div className="skill-card">
            <div className="skill-card-header">
              <span className="material-symbols-outlined skill-category-icon">
                {content.categories.frontend.icon}
              </span>
              <h3 className="skill-category-title">{content.categories.frontend.title}</h3>
            </div>
            <div className="skills-list">
              {filteredSkills(content.categories.frontend.skills).map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-info">
                    <span className="material-symbols-outlined skill-icon">
                      {skill.skillIcon}
                    </span>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                  {skill.badge ? (
                    <span className={`skill-badge ${skill.badge.toLowerCase()}`}>
                      {skill.badge}
                    </span>
                  ) : renderSkillLevel(skill.level)}
                </div>
              ))}
            </div>
          </div>

          {/* Backend & Databases */}
          <div className="skill-card">
            <div className="skill-card-header">
              <span className="material-symbols-outlined skill-category-icon">
                {content.categories.backend.icon}
              </span>
              <h3 className="skill-category-title">{content.categories.backend.title}</h3>
            </div>
            <div className="skills-list">
              {filteredSkills(content.categories.backend.skills).map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-info">
                    <span className="material-symbols-outlined skill-icon">
                      {skill.skillIcon}
                    </span>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                  {renderSkillLevel(skill.level)}
                </div>
              ))}
            </div>
          </div>

          {/* Tools & DevOps */}
          <div className="skill-card">
            <div className="skill-card-header">
              <span className="material-symbols-outlined skill-category-icon">
                {content.categories.tools.icon}
              </span>
              <h3 className="skill-category-title">{content.categories.tools.title}</h3>
            </div>
            <div className="skills-list">
              {filteredSkills(content.categories.tools.skills).map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-info">
                    <span className="material-symbols-outlined skill-icon">
                      {skill.skillIcon}
                    </span>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                  {skill.badge ? (
                    <span className={`skill-badge ${skill.badge.toLowerCase()}`}>
                      {skill.badge}
                    </span>
                  ) : renderSkillLevel(skill.level)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <p className="stat-number">{content.stats.experience}</p>
              <p className="stat-label">{content.stats.experienceLabel}</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">{content.stats.projects}</p>
              <p className="stat-label">{content.stats.projectsLabel}</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">{content.stats.languages}</p>
              <p className="stat-label">{content.stats.languagesLabel}</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">{content.stats.commits}</p>
              <p className="stat-label">{content.stats.commitsLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}