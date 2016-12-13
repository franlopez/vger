import React from 'react';

const texts = {
    en: {
        'Load articles': 'Load articles',
        'Map': 'Map',
        'List': 'List',
        'Settings': 'Settings'
    },
    es: {
        'Load articles': 'Cargar artículos',
        'Map': 'Mapa',
        'List': 'Lista',
        'Settings': 'Configuración'
    }
};

var Menu = React.createClass({
    propTypes: {
        getArticles: React.PropTypes.func.isRequired,
        toggleVisible: React.PropTypes.func.isRequired,
        toggleSettings: React.PropTypes.func.isRequired,
        mapVisible: React.PropTypes.bool.isRequired,
        language: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            language: 'en'
        };
    },

    render: function(){
        var text = texts[this.props.language];

        return(
            <div id='menu'>
                <div id="inline-items">
                    <span className="btn"
                          onClick={this.props.getArticles}>
                        <img className='icon'
                             src='img/reload.svg'/>
                         <span className="text">{text['Load articles']}</span>
                    </span>
                    <span className={this.props.mapVisible ? 'btn hideable hide' : 'btn hideable'}
                          onClick={this.props.toggleVisible}>
                          <img className='icon'
                               src='img/map.svg'/>
                           <span className="text">{text['Map']}</span>
                      </span>
                      <span className={this.props.mapVisible ? 'btn hideable' : 'btn hideable hide'}
                            onClick={this.props.toggleVisible}>
                          <img className='icon'
                               src='img/list.svg'/>
                           <span className="text">{text['List']}</span>
                      </span>
                    <span className="btn last"
                          onClick={this.props.toggleSettings}>
                        <img className='icon'
                             src='img/settings.svg'/>
                         <span className="text">{text['Settings']}</span>
                    </span>
                </div>
            </div>
        )
    }
});

export default Menu;
