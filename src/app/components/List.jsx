import React from 'react';
import Article from './Article.jsx';

var List = React.createClass({
    render: function(){
        var articles = [];
        for (var index in this.props.articles) {
            if (this.props.articles.hasOwnProperty(index)) {
                articles.push(<Article article={this.props.articles[index]} excerpt={false}/>);
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
