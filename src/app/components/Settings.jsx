import React from 'react';

var Settings = React.createClass({
    propTypes: {
        display: React.PropTypes.bool.isRequired,
        toggleSettings: React.PropTypes.func.isRequired,
        language: React.PropTypes.string.isRequired,
        setLanguage: React.PropTypes.func.isRequired
    },

    setLanguage(event) {
        if (event.currentTarget.value !== this.props.language) {
            this.props.setLanguage(event.currentTarget.value);
        }
    },

    render: function(){
        return(
            <div id='settings'
                 className={this.props.display ? 'visible' : 'hide'}>
                 <div id="close"
                      onClick={this.props.toggleSettings}>x</div>
                 <h2>Settings</h2>
                 <h3>Language</h3>
                 <br />
                 <input type="radio"
                       name="en"
                       value='en'
                       checked={this.props.language === 'en'}
                       onChange={this.setLanguage} /> English
                 <br /><br />
                 <input type="radio"
                       name="es"
                       value='es'
                       checked={this.props.language === 'es'}
                       onChange={this.setLanguage} /> Español
            </div>
        );
    }
});

export default Settings;
