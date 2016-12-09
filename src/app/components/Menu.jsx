import React from 'react';

var Menu = React.createClass({
    render: function(){
        return(
            <div id='menu'>
                <div id="inline-items">
                    <span className="btn"
                          onClick={this.props.getArticles}>Load articles</span>
                    <span className={this.props.mapVisible ? 'btn hideable hide' : 'btn hideable'}
                          onClick={this.props.toggleVisible}>Map</span>
                      <span className={this.props.mapVisible ? 'btn hideable' : 'btn hideable hide'}
                          onClick={this.props.toggleVisible}>List</span>
                    <span className="btn last">Setings</span>
                </div>
            </div>
        )
    }
});

export default Menu;
