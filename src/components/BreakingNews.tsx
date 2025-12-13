import React from 'react';
import './BreakingNews.css';

const BreakingNews: React.FC = () => {
  return (
    <div className="breaking-news">
      <div className="breaking-label">UPDATE</div>
      <div className="breaking-content">
        <strong>Dress Code Strictly Enforced:</strong> Black Tie Optional —
        Formal Attire Requested. Sources Report "Creative Interpretations Welcome."
      </div>
    </div>
  );
};

export default BreakingNews;
