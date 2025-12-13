import React from 'react';
import './ArticleModal.css';

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  content: React.ReactNode;
  category?: string;
}

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  showPaywall?: boolean;
  onSubscribeClick?: () => void;
  onDismissPaywall?: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, showPaywall = false, onSubscribeClick, onDismissPaywall }) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Focus close button on mount
  React.useEffect(() => {
    const closeButton = document.querySelector('.article-modal-close') as HTMLElement;
    closeButton?.focus();
  }, []);

  return (
    <div 
      className="article-modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-title"
    >
      <div className="article-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="article-modal-close" 
          onClick={onClose}
          aria-label="Close article"
        >
          ✕
        </button>

        <article className="article-full">
          {article.category && (
            <div className="article-category">{article.category}</div>
          )}

          <h1 id="article-title" className="article-full-title">{article.title}</h1>

          {article.subtitle && (
            <h2 className="article-full-subtitle">{article.subtitle}</h2>
          )}

          <div className="article-meta">
            <span className="article-author">By {article.author}</span>
            <span className="article-date">{article.date}</span>
          </div>

          <div className={`article-body ${showPaywall ? 'article-body-blurred' : ''}`}>
            {article.content}
          </div>

          {/* Paywall Overlay */}
          {showPaywall && (
            <div className="article-paywall-overlay">
              <div className="paywall-box">
                <button 
                  className="paywall-dismiss-btn"
                  onClick={onDismissPaywall}
                  aria-label="Dismiss paywall"
                >
                  ✕
                </button>
                <h3>🔒 You've Read Your Free Articles</h3>
                <p>Love what you're reading? RSVP to unlock everything!</p>
                <p><strong>Get full access to:</strong></p>
                <ul>
                  <li>✓ Unlimited articles</li>
                  <li>✓ Full event schedule</li>
                  <li>✓ Exclusive behind-the-scenes content</li>
                  <li>✓ Interactive photo galleries</li>
                </ul>
                <button className="paywall-subscribe-btn" onClick={onSubscribeClick}>
                  RSVP to Continue →
                </button>
                <button className="paywall-dismiss-text-btn" onClick={onDismissPaywall}>
                  I'll browse without RSVP'ing
                </button>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default ArticleModal;
