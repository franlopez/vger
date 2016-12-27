import React from 'react';
import Article from './Article.jsx';

var List = React.createClass({
    propTypes: {
        articles: React.PropTypes.array.isRequired,
        setOpenArticle: React.PropTypes.func.isRequired,
        openArticle: React.PropTypes.number
    },

    render: function(){
        var articles = [];
        for (var index in this.props.articles) {
            if (this.props.articles.hasOwnProperty(index)) {
                articles.push(
                    <Article key={this.props.articles[index].pageid}
                             article={this.props.articles[index]}
                             excerpt={false}
                             setOpenArticle={this.props.setOpenArticle}
                             openArticle={this.props.openArticle} />);
            }
        }
        return(
            <div id='list'>
                {articles}
            </div>
        );
    }
});

export default List;
