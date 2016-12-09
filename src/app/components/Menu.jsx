import React from 'react';

var Menu = React.createClass({
    render: function(){
        return(
            <div id='menu'>
                <div id="inline-items">
                    <span className="btn"
                          onClick={this.props.getArticles}>
                        <img className='icon'
                             src='img/reload.svg'/>
                         <span className="text">Load articles</span>
                    </span>
                    <span className={this.props.mapVisible ? 'btn hideable hide' : 'btn hideable'}
                          onClick={this.props.toggleVisible}>
                          <img className='icon'
                               src='img/map.svg'/>
                           <span className="text">Map</span>
                      </span>
                      <span className={this.props.mapVisible ? 'btn hideable' : 'btn hideable hide'}
                          onClick={this.props.toggleVisible}>
                          <img className='icon'
                               src='img/list.svg'/>
                          <span className="text">List</span>
                      </span>
                    <span className="btn last">
                        <img className='icon'
                             src='img/settings.svg'/>
                        <span className="text">Setings</span>
                    </span>
                </div>
            </div>
        )
    }
});

export default Menu;
