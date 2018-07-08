import React from 'react';
import PropTypes from 'prop-types';
import Article from './Article.jsx';

class List extends React.Component {
  constructor(...args) {
    super(...args);
    this.propTypes = {
      articles: PropTypes.array.isRequired,
      setOpenArticle: PropTypes.func.isRequired,
      openArticle: PropTypes.number
    };
  }

  render() {
    const articles = this.props.articles.map((article, index) => {
      return (
        <Article
          key={this.props.articles[index].pageid}
          article={this.props.articles[index]}
          excerpt={false}
          setOpenArticle={this.props.setOpenArticle}
          openArticle={this.props.openArticle}
        />
      );
    });

    return(
      <div id='list'>
        {articles}
      </div>
    );
  }
}

export default List;
