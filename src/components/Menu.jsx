import React from 'react';
import PropTypes from 'prop-types';

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

class Menu extends React.Component {
  constructor(...args) {
    super(...args);

    this.propTypes = {
      getArticles: PropTypes.func.isRequired,
      gettingArticles: PropTypes.bool.isRequired,
      toggleVisible: PropTypes.func.isRequired,
      setModal: PropTypes.func.isRequired,
      mapVisible: PropTypes.bool.isRequired,
      language: PropTypes.string
    };

    this.defaultProps = {
      language: 'en'
    };
  }

  openSettings = () => {
    this.props.setModal('settings');
  }

  openAbout = () => {
    this.props.setModal('about');
  }

  render() {
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
    );
  }
}

export default Menu;
