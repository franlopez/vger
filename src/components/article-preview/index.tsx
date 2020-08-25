import React from 'react';

import { Article } from '../../types';

import './style.css';

interface ArticlePreviewProps {
  article: Article,
}

function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <div className="articlePreview">
      <div className="header">
        { article.thumbnail && <img src={article.thumbnail.source} alt={article.title} />}
        <h1>{article.title}</h1>
      </div>
    </div>
  );
}

export default ArticlePreview;
