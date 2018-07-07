import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {
  constructor(...args) {
    super(...args);

    this.propTypes = {
      modal: PropTypes.string,
      closeModal: PropTypes.func.isRequired
    };
  }

  render() {
    return(
      <div id='modal' className={this.props.modal ? 'visible' : 'hide'}>
        <div id="close" onClick={this.props.closeModal}>x</div>
        {this.props.children}
      </div>
    );
  }
}

export default Modal;
