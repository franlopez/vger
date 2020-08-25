import React from 'react';

import { Article } from '../../types';
import ArticlePreview from '../article-preview';

import './style.css';

interface ListProps {
  articles: Article[],
}

function List({ articles }: ListProps) {
  return (
    <div className="list">
      {articles.map(article => <ArticlePreview key={article.pageid} article={article} />)}
    </div>
  );
}

export default List;
