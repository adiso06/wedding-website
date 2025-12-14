import React from 'react';
import './PullQuote.css';

interface PullQuoteProps {
  quote: string;
  position?: 'left' | 'right';
}

const PullQuote: React.FC<PullQuoteProps> = ({ quote, position = 'right' }) => {
  return (
    <aside className={`pull-quote pull-quote-${position}`}>
      <blockquote className="pull-quote-text">
        "{quote}"
      </blockquote>
    </aside>
  );
};

export default PullQuote;
