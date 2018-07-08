import React from 'react';
import PropTypes from 'prop-types';

class ErrorMsg extends React.Component {
  constructor(...args) {
    super(...args);

    this.propTypes = {
      language: PropTypes.string,
      modal: PropTypes.string,
      getUserLocation: PropTypes.func.isRequired,
      getArticles: PropTypes.func.isRequired
    };

    this.defaultProps = {
      language: 'en',
      modal: ''
    };
  }

  render() {
    const errorMessages = {
      en: {
        errorLocation:
          <div>
            <p>Sorry, <strong>Vger</strong> couldn't find your current loctaion.</p>
            <div className="btn" onClick={this.props.getUserLocation}>Try again</div>
          </div>,
        errorArticles:
          <div>
            <p>Sorry, <strong>Vger</strong> couldn't load the Wikipedia articles.</p>
            <div className="btn" onClick={this.props.getArticles}>Try again</div>
          </div>
      },
      es: {
        errorLocation: 
          <div>
            <p>Perdón, <strong>Vger</strong> no pudo encontrar su posición.</p>
            <div className="btn" onClick={this.props.getUserLocation}>Probar de nuevo</div>
          </div>,
        errorArticles:
          <div>
            <p>Perdón, <strong>Vger</strong> no pudo cargar los artículos de Wikipedia.</p>
            <div className="btn" onClick={this.props.getArticles}>Probar de nuevo</div>
          </div>
      }
    };

    if (this.props.modal && this.props.modal.substring(0, 5) === 'error') {
      return(
        <div id="error">
          <div>
            <h2>Error</h2>
            {errorMessages[this.props.language][this.props.modal]}
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
};

export default ErrorMsg;
