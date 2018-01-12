import React from 'react';
import PropTypes from 'prop-types';

const texts = {
  en: {
    'Read more': 'Read more'
  },
  es: {
    'Read more': 'Leer más'
  }
};

class Article extends React.Component {
  constructor(...args) {
    super(...args);

    this.propTypes = {
      article: PropTypes.object.isRequired,
      setOpenArticle: PropTypes.func,
      openArticle: PropTypes.number,
      excerpt: PropTypes.bool, // conditionally render the excerpt
      language: PropTypes.string
    };

    this.defaultProps = {
      excerpt: false,
      language: 'en'
    };
  }

  setOpenArticle = () => {
    if (this.props.setOpenArticle) {
      this.props.setOpenArticle(this.props.article.pageid);
    }
  }

  render() {
    var text = texts[this.props.language];

    var thumbnail = this.props.article.thumbnail
              ? <img src={this.props.article.thumbnail.source} width={this.props.article.thumbnail.width} height={this.props.article.thumbnail.height} />
              : null;

    var classNames = 'article';
    if (this.props.article.pageid == this.props.openArticle) classNames += ' opened';

    var excerpt = null;
    if (this.props.excerpt) {
      excerpt =
        <div>
          <div dangerouslySetInnerHTML={{__html: this.props.article.extract}} />
          <a className='btn' href={this.props.article.fullurl} target='_blank'>{text['Read more']}</a>
        </div>;
    }

    return(
      <div className={classNames}
         onClick={this.setOpenArticle} >
        {thumbnail}
        <h3>{this.props.article.title}</h3>
        {excerpt}
      </div>
    );
  }
};

export default Article;
