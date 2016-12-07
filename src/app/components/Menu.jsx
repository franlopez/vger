import React from 'react';

var Menu = React.createClass({
    render: function(){
        return(
            <div id='menu'>
                <div id="inline-items">
                    <span className="btn">Load articles</span>
                    <span className="btn">Map</span>
                    <span className="btn">List</span>
                    <span className="btn last">Setings</span>
                </div>
            </div>
        )
    }
});

export default Menu;
