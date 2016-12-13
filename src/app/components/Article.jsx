import React from 'react';

const texts = {
    en: {
        'Read more': 'Read more'
    },
    es: {
        'Read more': 'Leer más'
    }
};

var Article = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        setOpenArticle: React.PropTypes.func,
        openArticle: React.PropTypes.number,
        excerpt: React.PropTypes.bool, // conditionally render the excerpt
        language: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            excerpt: false,
            language: 'en'
        };
    },

    setOpenArticle: function() {
        if (this.props.setOpenArticle) {
            this.props.setOpenArticle(this.props.article.pageid);
        }
    },

    render: function(){
        var text = texts[this.props.language];
        
        var thumbnail = this.props.article.thumbnail
                            ? <img src={this.props.article.thumbnail.source} width={this.props.article.thumbnail.width} height={this.props.article.thumbnail.height} />
                            : null;

        var classNames = thumbnail ? 'article with-image' : 'article no-image';
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
        )
    }
});

export default Article;
