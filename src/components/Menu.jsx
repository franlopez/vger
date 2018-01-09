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
        gettingArticles: React.PropTypes.bool.isRequired,
        toggleVisible: React.PropTypes.func.isRequired,
        setModal: React.PropTypes.func.isRequired,
        mapVisible: React.PropTypes.bool.isRequired,
        language: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            language: 'en'
        };
    },

    openSettings: function() {
        this.props.setModal('settings');
    },

    openAbout: function() {
        this.props.setModal('about');
    },

    render: function(){
        var text = texts[this.props.language];

        return(
            <div id='menu'>
                <div id="inline-items">
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
                    <span className="btn"
                          onClick={this.props.getArticles}>
                        <img className={'icon ' + (this.props.gettingArticles ? 'loading' : '')}
                             id='loadArticles'
                             src='img/reload.svg' />
                        <span className="text">{text['Load articles']}</span>
                    </span>
                    <span className="btn last"
                          onClick={this.openSettings}>
                        <img className='icon'
                             src='img/settings.svg'/>
                        <span className="text">{text['Settings']}</span>
                    </span>
                </div>
                <img id='logo'
                     src='img/logo.svg'
                     onClick={this.openAbout} />
            </div>
        )
    }
});

export default Menu;
