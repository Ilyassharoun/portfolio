// src/components/Contact/Contact.tsx
import { useState } from 'react';
import './Contact.css';

type ContactProps = {
  language: 'fr' | 'en';
};

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact({ language }: ContactProps) {
  const t = language === 'fr' ? {
    subtitle: 'Prenez contact',
    title: 'Contactez-moi',
    name: 'Nom',
    email: 'Email',
    subject: 'Sujet',
    message: 'Message',
    send: 'Envoyer',
    sending: 'Envoi en cours...',
    success: 'Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.',
    error: 'Erreur lors de l\'envoi. Veuillez réessayer ou me contacter directement par email.',
    namePlaceholder: 'Votre nom',
    emailPlaceholder: 'votre@email.com',
    subjectPlaceholder: 'De quoi s\'agit-il ?',
    messagePlaceholder: 'Votre message ici...',
    privacyPolicy: 'Politique de confidentialité',
    termsOfService: 'Conditions d\'utilisation',
    copyright: '© 2024 Portfolio Développeur. Construit avec précision.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    twitter: 'Twitter',
    validationErrors: {
      name: 'Le nom est requis',
      email: 'Email invalide',
      message: 'Le message est requis',
      subject: 'Le sujet est requis'
    }
  } : {
    subtitle: 'Get in touch',
    title: 'Contact Me',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    sending: 'Sending...',
    success: 'Message sent successfully! I\'ll get back to you as soon as possible.',
    error: 'Error sending message. Please try again or contact me directly via email.',
    namePlaceholder: 'Your Name',
    emailPlaceholder: 'your@email.com',
    subjectPlaceholder: 'What\'s this about?',
    messagePlaceholder: 'Your message here...',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    copyright: '© 2024 Software Developer Portfolio. Built with precision.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    twitter: 'Twitter',
    validationErrors: {
      name: 'Name is required',
      email: 'Invalid email address',
      message: 'Message is required',
      subject: 'Subject is required'
    }
  };

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.validationErrors.name;
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.validationErrors.email;
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = t.validationErrors.subject;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t.validationErrors.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error for this field when user starts typing
    if (errors[id as keyof FormData]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setStatus('sending');
    setErrors({});
    
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        console.error('Server error:', data.message);
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Section Header */}
        <div className="contact-header">
          <h2 className="contact-title">{t.title}</h2>
          <p className="contact-subtitle">{t.subtitle}</p>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  {t.name} <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  placeholder={t.namePlaceholder}
                  disabled={status === 'sending'}
                  className={errors.name ? 'error' : ''}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <span id="name-error" className="error-message" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  {t.email} <span className="required-star">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  placeholder={t.emailPlaceholder}
                  disabled={status === 'sending'}
                  className={errors.email ? 'error' : ''}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span id="email-error" className="error-message" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">
                {t.subject} <span className="required-star">*</span>
              </label>
              <input 
                type="text" 
                id="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required 
                placeholder={t.subjectPlaceholder}
                disabled={status === 'sending'}
                className={errors.subject ? 'error' : ''}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
              />
              {errors.subject && (
                <span id="subject-error" className="error-message" role="alert">
                  {errors.subject}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">
                {t.message} <span className="required-star">*</span>
              </label>
              <textarea 
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                required 
                placeholder={t.messagePlaceholder} 
                rows={5}
                disabled={status === 'sending'}
                className={errors.message ? 'error' : ''}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
              ></textarea>
              {errors.message && (
                <span id="message-error" className="error-message" role="alert">
                  {errors.message}
                </span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={status === 'sending'}
            >
              <span>{status === 'sending' ? t.sending : t.send}</span>
              <span className="material-symbols-outlined">
                {status === 'sending' ? 'hourglass_empty' : 'send'}
              </span>
            </button>

            {status === 'success' && (
              <div className="form-success" role="alert">
                <span className="material-symbols-outlined">check_circle</span>
                <p>{t.success}</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="form-error" role="alert">
                <span className="material-symbols-outlined">error</span>
                <p>{t.error}</p>
              </div>
            )}
          </form>
          
        </div>
        <footer>

        </footer>
      </div>
    </section>
  );
}