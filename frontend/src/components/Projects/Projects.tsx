// src/components/Projects/Projects.tsx
import { useEffect, useState } from 'react';
import './Projects.css';

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
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Check backend status
  const checkBackendStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://portfolio-backend-ceqv.onrender.com/api/projects', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setBackendStatus('available');
          return true;
        } else {
          setBackendStatus('available');
          return true;
        }
      }
      return false;
    } catch (error) {
      setBackendStatus('unavailable');
      return false;
    }
  };

  // Fetch projects with retry logic
  const fetchProjects = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      // First, check if backend is responsive
      const isAvailable = await checkBackendStatus();
      
      if (!isAvailable) {
        // If this is the first attempt, retry after delay
        if (retryCount < 3) {
          setBackendStatus('checking');
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 3000);
          setIsLoading(true);
          return;
        } else {
          throw new Error('Backend service unavailable');
        }
      }

      const response = await fetch('https://portfolio-backend-ceqv.onrender.com/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const data = await response.json();
      setProjects(data);
      setBackendStatus('available');
      setIsLoading(false);
      setRetryCount(0);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load projects');
      setIsLoading(false);
      
      // Auto retry after 5 seconds if it's a network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 5000);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [retryCount]);

  // Apply theme to html data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const loadReviews = async (projectId: string) => {
    try {
      const res = await fetch(`https://portfolio-backend-ceqv.onrender.com/api/reviews/${projectId}`);
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
      const response = await fetch('https://portfolio-backend-ceqv.onrender.com/api/review', {
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

  const handleRetry = () => {
    setRetryCount(0);
    setLoadError(null);
    setBackendStatus('checking');
    fetchProjects();
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
    // New loading/error translations
    loading: language === 'fr' ? 'Chargement des projets...' : 'Loading projects...',
    backendStarting: language === 'fr' 
      ? 'Le serveur démarre. Cela peut prendre quelques instants...' 
      : 'Server is starting up. This may take a moment...',
    retry: language === 'fr' ? 'Réessayer' : 'Retry',
    errorOccurred: language === 'fr' 
      ? 'Une erreur est survenue lors du chargement des projets.' 
      : 'An error occurred while loading projects.',
    noProjects: language === 'fr' 
      ? 'Aucun projet trouvé.' 
      : 'No projects found.',
    checkingConnection: language === 'fr' 
      ? 'Vérification de la connexion...' 
      : 'Checking connection...',
    connectionReady: language === 'fr' 
      ? 'Connexion établie!' 
      : 'Connection established!',
    loadingDots: language === 'fr' 
      ? 'Chargement' 
      : 'Loading',
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

          {/* Category Filters - Only show if not loading */}
          {!isLoading && !loadError && (
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
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="projects-loading-container">
              <div className="loading-content">
                <div className="loading-spinner">
                  <svg className="spinner" viewBox="0 0 50 50">
                    <circle 
                      className="path" 
                      cx="25" 
                      cy="25" 
                      r="20" 
                      fill="none" 
                      strokeWidth="5"
                    />
                  </svg>
                </div>
                <div className="loading-text-container">
                  <h3 className="loading-title">
                    {backendStatus === 'checking' ? t.checkingConnection : t.backendStarting}
                  </h3>
                  <div className="loading-dots">
                    <span>{t.loadingDots}</span>
                    <span className="dot-animation">...</span>
                  </div>
                  {backendStatus === 'checking' && (
                    <div className="loading-progress-bar">
                      <div className="progress-bar-fill"></div>
                    </div>
                  )}
                </div>
                <p className="loading-subtitle">
                  {language === 'fr' 
                    ? 'Le backend hébergé sur Render peut prendre jusqu\'à 30 secondes pour démarrer après une période d\'inactivité.'
                    : 'The backend hosted on Render may take up to 30 seconds to start after a period of inactivity.'}
                </p>
                {retryCount > 0 && (
                  <div className="retry-info">
                    <span className="material-symbols-outlined">schedule</span>
                    <span>
                      {language === 'fr' 
                        ? `Tentative de reconnexion ${retryCount}/3...`
                        : `Retry attempt ${retryCount}/3...`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error State */}
          {loadError && (
            <div className="projects-error-container">
              <div className="error-content">
                <span className="material-symbols-outlined error-icon">error_outline</span>
                <h3 className="error-title">{t.errorOccurred}</h3>
                <p className="error-message">{loadError}</p>
                <button 
                  className="retry-button"
                  onClick={handleRetry}
                >
                  <span className="material-symbols-outlined">refresh</span>
                  <span>{t.retry}</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !loadError && filteredProjects.length === 0 && (
            <div className="projects-empty-container">
              <div className="empty-content">
                <span className="material-symbols-outlined empty-icon">folder_open</span>
                <h3 className="empty-title">{t.noProjects}</h3>
                <p className="empty-subtitle">
                  {language === 'fr' 
                    ? 'Revenez plus tard pour découvrir mes nouveaux projets.'
                    : 'Check back later to discover my new projects.'}
                </p>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && !loadError && filteredProjects.length > 0 && (
            <div className="projects-grid">
              {filteredProjects.map(project => {
                const avgRating = getAverageRating(project._id);
                const ratingCount = getRatingCount(project._id);         
                return (
                  <div key={project._id} className="project-card">
                    <div 
                      className="project-image"
                      style={{ 
                        backgroundImage: `url("${projectImages[project.title] || ''}")`,
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
          )}

          {/* View More Button - Only show if projects are loaded */}
          {!isLoading && !loadError && projects.length > 0 && (
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
          )}
        </div>
      </section>
    </>
  );
}