import React from 'react';
import PropTypes from 'prop-types';

var Modal = React.createClass({
  propTypes: {
    modal: PropTypes.string,
    closeModal: PropTypes.func.isRequired
  },

  render: function(){
    return(
      <div id='modal'
         className={this.props.modal ? 'visible' : 'hide'}>
         <div id="close"
            onClick={this.props.closeModal}>x</div>
          {this.props.children}
      </div>
    );
  }
});

export default Modal;
