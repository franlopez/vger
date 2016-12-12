import React from 'react';

var Article = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        setOpenArticle: React.PropTypes.func,
        excerpt: React.PropTypes.bool // conditionally render the excerpt
    },

    defaultProps: {
        excerpt: false
    },

    setOpenArticle: function() {
        if (this.props.setOpenArticle) {
            this.props.setOpenArticle(this.props.article.pageid);
        }
    },

    render: function(){
        var thumbnail = this.props.article.thumbnail
                            ? <img src={this.props.article.thumbnail.source} width={this.props.article.thumbnail.width} height={this.props.article.thumbnail.height} />
                            : null;
        var excerpt = this.props.excerpt
                          ? <div dangerouslySetInnerHTML={{__html: this.props.article.extract}} />
                      : null;
        return(
            <div className={thumbnail ? 'article with-image' : 'article no-image'}
                 onClick={this.setOpenArticle} >
                {thumbnail}
                <h3>{this.props.article.title}</h3>
                {excerpt}
            </div>
        )
    }
});

export default Article;
