import React from 'react';

var Modal = React.createClass({
    propTypes: {
        modal: React.PropTypes.string,
        closeModal: React.PropTypes.func.isRequired
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
