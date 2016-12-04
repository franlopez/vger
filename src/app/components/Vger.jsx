import React from 'react';
import Menu from './Menu.jsx';
import Vmap from './Vmap.jsx';
import List from './List.jsx';

var Vger = React.createClass({
    render: function(){
        return(
            <div id="container">
                <Menu />
                <div id="main">
                    <Vmap />
                    <List />
                </div>
            </div>
        )
    }
});

export default Vger;
