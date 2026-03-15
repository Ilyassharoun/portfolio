// src/components/Projects/Projects.tsx
import { useEffect, useState } from 'react';
import './Projects.css';
import Rating from '@mui/material/Rating';




type Language = 'fr' | 'en';

type Project = {
  _id: string;
  title: string;
  category: 'desktop' | 'web' | 'mobile';
  description_en: string;
  description_fr: string;
  tech: string[];
  githubLink: string;
};

type Review = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
};

type Props = {
  language: Language;
  theme?: 'light' | 'dark';
};

// Project images mapping
const projectImages: Record<string, string> = {
    'JMCars Website': '/assets/projects/jmcarswebsite_image.png',
    'Autogestion': '/assets/projects/autogestion_image.png',
    'HK SOLUTIONS Website': '/assets/projects/hksolutions_image.png',
    'JMCars Gestion Location': '/assets/projects/jmcarsapp_image.png',
    'ClicknGo': '/assets/projects/clickngo_image.png',
};

// Category icons mapping
const categoryIcons = {
  web: 'language',
  mobile: 'smartphone',
  desktop: 'desktop_windows',
};

export default function Projects({ language, theme = 'light' }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProjectTitle, setCurrentProjectTitle] = useState<string>('');
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
  fetch('http://localhost:3000/api/projects')
    .then(res => res.json())
    .then(setProjects)
    .catch(error => console.error('Failed to load projects:', error));
}, []);

  // Apply theme to html data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const loadReviews = async (projectId: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/reviews/${projectId}`);
    const data = await res.json();
    setReviews(prev => ({ ...prev, [projectId]: data }));
  } catch (error) {
    console.error('Failed to load reviews:', error);
  }
};

  const openReviewsModal = (projectId: string, projectTitle: string) => {
    setCurrentProjectId(projectId);
    setCurrentProjectTitle(projectTitle);
    loadReviews(projectId);
    setShowReviewsModal(true);
  };

  const openRatingModal = (projectId: string, projectTitle: string) => {
    setCurrentProjectId(projectId);
    setCurrentProjectTitle(projectTitle);
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    setShowRatingModal(true);
    setShowReviewsModal(false);
  };

  const submitReview = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!currentProjectId || !reviewName.trim() || !reviewComment.trim() || reviewRating === 0) return;

  setIsSubmittingReview(true);
  try {
    const response = await fetch('http://localhost:3000/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        projectId: currentProjectId, 
        name: reviewName, 
        rating: reviewRating, 
        comment: reviewComment 
      }),
    });

    if (response.ok) {
      setReviewName('');
      setReviewRating(5);
      setReviewComment('');
      setShowRatingModal(false);
      loadReviews(currentProjectId);
    }
  } catch (error) {
    console.error('Failed to submit review:', error);
  } finally {
    setIsSubmittingReview(false);
  }
};

  const getAverageRating = (projectId: string): number => {
    const projectReviews = reviews[projectId] || [];
    if (projectReviews.length === 0) return 0;
    const sum = projectReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / projectReviews.length;
  };

  const getRatingCount = (projectId: string): number => {
    return reviews[projectId]?.length || 0;
  };

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category as keyof typeof categoryIcons] || 'code';
  };

  const t = {
    title: language === 'fr' ? 'Projets Professionnels' : 'Professional Projects',
    subtitle: language === 'fr' 
      ? 'Une collection de projets de génie logiciel et d\'études de cas techniques sur diverses plateformes.'
      : 'A collection of software engineering projects and technical case studies across various platforms.',
    all: language === 'fr' ? 'Tous' : 'All',
    desktop: language === 'fr' ? 'Desktop' : 'Desktop',
    web: language === 'fr' ? 'Web' : 'Web',
    mobile: language === 'fr' ? 'Mobile' : 'Mobile',
    noReviews: language === 'fr' ? 'Aucun avis pour le moment.' : 'No reviews yet.',
    addReview: language === 'fr' ? 'Écrire un avis' : 'Write a Review',
    yourName: language === 'fr' ? 'Votre nom' : 'Your Name',
    writeReview: language === 'fr' ? 'Partagez votre avis...' : 'Share your feedback...',
    submit: language === 'fr' ? 'Envoyer' : 'Submit',
    rateProject: language === 'fr' ? 'Notez ce projet' : 'Rate this Project',
    cancel: language === 'fr' ? 'Annuler' : 'Cancel',
    projectReviews: language === 'fr' ? 'Avis' : 'Reviews',
    viewDetails: language === 'fr' ? 'Voir les détails' : 'View Details',
    rate: language === 'fr' ? 'Noter' : 'Rate',
    average: language === 'fr' ? 'Moyenne' : 'Average',
    reviewsCount: language === 'fr' ? 'avis' : 'reviews',
    viewMore: language === 'fr' ? 'Voir plus sur GitHub' : 'View more on GitHub',
    justNow: language === 'fr' ? 'À l\'instant' : 'Just now',
    loadMore: language === 'fr' ? 'Charger plus d\'avis' : 'Load More Reviews',
  };

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const categories = [
    { key: 'all', label: t.all, icon: null },
    { key: 'web', label: t.web, icon: 'language' },
    { key: 'mobile', label: t.mobile, icon: 'smartphone' },
    { key: 'desktop', label: t.desktop, icon: 'desktop_windows' },
  ];

  const currentReviews = currentProjectId ? reviews[currentProjectId] || [] : [];
  const averageRating = currentProjectId ? getAverageRating(currentProjectId) : 0;

  // Calculate rating distribution
  const getRatingPercentage = (star: number) => {
    const count = currentReviews.filter(r => Math.round(r.rating) === star).length;
    return currentReviews.length > 0 ? (count / currentReviews.length) * 100 : 0;
  };

  return (
    <>
      {/* Rating Modal */}
      <div className={`modal-overlay ${showRatingModal ? 'active' : ''}`} onClick={() => setShowRatingModal(false)}>
        <div className="modal-container rating-modal" onClick={e => e.stopPropagation()}>
          <div className="px-8 pt-8 pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t.rateProject}</h3>
              <button 
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                onClick={() => setShowRatingModal(false)}
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>
            
            {currentProjectId && (
              <form className="flex flex-col gap-6" onSubmit={submitReview}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t.yourName}
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-all px-4"
                    placeholder="John Doe"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t.rateProject}
                  </label>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="hover:scale-110 transition-transform"
                        onClick={() => setReviewRating(star)}
                      >
                        <span className={`material-symbols-outlined text-3xl ${star <= reviewRating ? 'filled-star' : ''}`}>
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t.writeReview}
                  </label>
                  <textarea
                    className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-all resize-none px-4 py-3"
                    placeholder={t.writeReview}
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4 pb-8">
                  <button
                    type="submit"
                    className="flex-1 h-12 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20"
                    disabled={isSubmittingReview}
                  >
                    {t.submit}
                  </button>
                  <button
                    type="button"
                    className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-all"
                    onClick={() => setShowRatingModal(false)}
                    disabled={isSubmittingReview}
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Feed Modal */}
      <div className={`modal-overlay ${showReviewsModal ? 'active' : ''}`} onClick={() => setShowReviewsModal(false)}>
        <div className="modal-container reviews-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h3 className="modal-title">{currentProjectTitle} {t.projectReviews}</h3>
              <div className="rating-summary">
                <span className="average-rating-large">{averageRating.toFixed(1)}</span>
                <div className="rating-stats">
                  <div className="stars-container large">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`material-symbols-outlined ${star <= Math.round(averageRating) ? 'filled-star' : ''}`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="reviews-count-large">{getRatingCount(currentProjectId || '')} {t.reviewsCount}</span>
                </div>
              </div>
            </div>
            <div className="modal-header-actions">
              <button 
                className="write-review-btn desktop-only"
                onClick={() => {
                  setShowReviewsModal(false);
                  openRatingModal(currentProjectId!, currentProjectTitle);
                }}
              >
                <span className="material-symbols-outlined">edit_note</span>
                {t.rateProject}
              </button>
              <button className="modal-close" onClick={() => setShowReviewsModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Rating Distribution Chart */}
          <div className="rating-distribution-container">
            {[5, 4, 3, 2, 1].map((star) => {
              const percentage = getRatingPercentage(star);
              return (
                <div key={star} className="distribution-row">
                  <div className="star-label">
                    <span className="material-symbols-outlined filled-star small">star</span>
                    <span>{star}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="percentage-label">
                    {percentage.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>

          <div className="reviews-list-container custom-scrollbar">
            {currentReviews.length === 0 ? (
              <div className="no-reviews-message">
                <span className="material-symbols-outlined">reviews</span>
                <p>{t.noReviews}</p>
              </div>
            ) : (
              currentReviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="reviewer-name">{review.name}</p>
                        <p className="review-time">{t.justNow}</p>
                      </div>
                    </div>
                    <div className="review-rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`material-symbols-outlined ${star <= review.rating ? 'filled-star' : ''}`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="review-comment-text">{review.comment}</p>
                </div>
              ))
            )}
            
            {currentReviews.length > 0 && (
              <div className="load-more-container">
                <button className="load-more-btn">
                  {t.loadMore}
                </button>
              </div>
            )}
          </div>

          <div className="modal-footer mobile-only">
            <button 
              className="write-review-btn full-width"
              onClick={() => {
                setShowReviewsModal(false);
                openRatingModal(currentProjectId!, currentProjectTitle);
              }}
            >
              <span className="material-symbols-outlined">edit_note</span>
              {t.rateProject}
            </button>
          </div>
        </div>
      </div>

      {/* Main Projects Content */}
      <section id="projects" className="projects-section">
        <div className="projects-container">
          {/* Header */}
          <div className="projects-header">
            <h2 className="projects-title">{t.title}</h2>
            <p className="projects-subtitle">{t.subtitle}</p>
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`filter-btn ${activeFilter === cat.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.key)}
              >
                {cat.icon && (
                  <span className="material-symbols-outlined">{cat.icon}</span>
                )}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.map(project => {
              const avgRating = getAverageRating(project._id);
              const ratingCount = getRatingCount(project._id);
              const imageUrl = projectImages[project.title] || projectImages['E-commerce Engine'];
              
              return (
                <div key={project._id} className="project-card">
                  <div 
  className="project-image"
  style={{ 
    backgroundImage: `url("${projectImages[project.title] || '' }")`,
    
  }}
>
                    <div className="image-overlay">
                      <span className="view-details-btn">{t.viewDetails}</span>
                    </div>
                  </div>
                  
                  <div className="project-content">
                    <div className="project-header">
                      <h3 className="project-title">{project.title}</h3>
                      <span className={`category-badge ${project.category}`}>
                        <span className="material-symbols-outlined">
                          {getCategoryIcon(project.category)}
                        </span>
                        {project.category}
                      </span>
                    </div>

                    <div className="project-rating">
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`material-symbols-outlined ${star <= Math.round(avgRating) ? 'filled-star' : ''}`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <button 
                        className="reviews-link"
                        onClick={() => openReviewsModal(project._id, project.title)}
                      >
                        {avgRating > 0 ? avgRating.toFixed(1) : '0.0'} ({ratingCount} {t.reviewsCount})
                      </button>
                    </div>

                    <p className="project-description">
                      {language === 'fr' ? project.description_fr : project.description_en}
                    </p>

                    <div className="project-footer">
                      <div className="tech-tags">
                        {project.tech.slice(0, 2).map(tech => (
                          <span key={tech} className="tech-name">{tech}</span>
                        ))}
                      </div>
                      <button 
                        className="rate-button"
                        onClick={() => openRatingModal(project._id, project.title)}
                      >
                        <span className="material-symbols-outlined">grade</span>
                        <span>{t.rate}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View More Button */}
          <div className="view-more-container">
            <a 
              href="https://github.com/Ilyassharoun?tab=repositories" 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-more-btn"
            >
              <span className="material-symbols-outlined">code</span>
              <span>{t.viewMore}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}