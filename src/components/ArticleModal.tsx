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
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  return (
    <div className="article-modal-overlay" onClick={onClose}>
      <div className="article-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="article-modal-close" onClick={onClose}>✕</button>

        <article className="article-full">
          {article.category && (
            <div className="article-category">{article.category}</div>
          )}

          <h1 className="article-full-title">{article.title}</h1>

          {article.subtitle && (
            <h2 className="article-full-subtitle">{article.subtitle}</h2>
          )}

          <div className="article-meta">
            <span className="article-author">By {article.author}</span>
            <span className="article-date">{article.date}</span>
          </div>

          <div className="article-body">
            {article.content}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleModal;
