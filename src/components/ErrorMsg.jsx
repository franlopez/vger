import React from 'react';
import PropTypes from 'prop-types';

var ErrorMsg = React.createClass({
  propTypes: {
    language: PropTypes.string,
    modal: PropTypes.string,
    getUserLocation: PropTypes.func.isRequired,
    getArticles: PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      language: 'en'
    };
  },

  render: function(){
    var displayErrorMsg = null;

    const errorLocationEn =
      <div>
        <p>Sorry, <strong>Vger</strong> couldn't find your current loctaion.</p>
        <div className="btn" onClick={this.props.getUserLocation}>Try again</div>
      </div>;

    const errorLocationEs =
      <div>
        <p>Perdón, <strong>Vger</strong> no pudo encontrar su posición.</p>
        <div className="btn" onClick={this.props.getUserLocation}>Probar de nuevo</div>
      </div>;

    const errorArticlesEn =
      <div>
        <p>Sorry, <strong>Vger</strong> couldn't load the Wikipedia articles.</p>
        <div className="btn" onClick={this.props.getArticles}>Try again</div>
      </div>;

    const errorArticlesEs =
      <div>
        <p>Perdón, <strong>Vger</strong> no pudo cargar los artículos de Wikipedia.</p>
        <div className="btn" onClick={this.props.getArticles}>Probar de nuevo</div>
      </div>;

    if (this.props.language === 'en') {
      if (this.props.modal === 'error-location') {
        displayErrorMsg = errorLocationEn;
      } else if (this.props.modal === 'error-articles') {
        displayErrorMsg = errorArticlesEn;
      }
    } else if (this.props.language === 'es') {
      if (this.props.modal === 'error-location') {
        displayErrorMsg = errorLocationEs;
      } else if (this.props.modal === 'error-articles') {
        displayErrorMsg = errorArticlesEs;
      }
    }

    if (displayErrorMsg) {
      return(
        <div id="error">
          <div>
            <h2>Error</h2>
            {displayErrorMsg}
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
});

export default ErrorMsg;
