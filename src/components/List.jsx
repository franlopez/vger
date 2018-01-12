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
    var articles = [];
    for (var index in this.props.articles) {
      if (this.props.articles.hasOwnProperty(index)) {
        articles.push(
          <Article key={this.props.articles[index].pageid}
                   article={this.props.articles[index]}
                   excerpt={false}
                   setOpenArticle={this.props.setOpenArticle}
                   openArticle={this.props.openArticle} />
        );
      }
    }
    return(
      <div id='list'>
        {articles}
      </div>
    );
  }
}

export default List;
