import React from 'react';
import PropTypes from 'prop-types';

class About extends React.Component {
  constructor(...args) {
    super(...args);

    this.propTypes = {
      language: PropTypes.string,
      modal: PropTypes.string
    };

    this.defaultProps = {
      language: 'en',
      modal: 'about'
    };
  }

  render() {
    if (this.props.modal === 'about') {
      return(
        <div id="about">
          <div>
            <h2>About</h2>
            <p><strong>Vger</strong> shows you a map with Wikepdia entries around you.</p>
            <p><strong>Vger</strong> is being designed and developed as a weekend project by <a href="http://www.franlopez.info" target="_blank">Fran López</a>.</p>
            <p><strong>Vger</strong> is your friend.</p>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default About;
